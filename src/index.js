const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const { createServer } = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");
const bcrypt = require('bcrypt');
const sharedSession = require('express-socket.io-session');

// Load environment variables from .env file
require("dotenv").config();

// Models
const User = require('./models/users');
const ChatRoom = require('./models/chatRoom'); 
const MessageModel = require('./models/message');

// Initialize Express App
const app = express();
const httpServer = createServer(app);
const io = socketIO(httpServer);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Redis clients for pub/sub
const pubClient = createClient({
  url: `redis://${process.env.REDIS_HOST || "localhost"}:${process.env.REDIS_PORT || 6379}`
});
const subClient = pubClient.duplicate();

pubClient.connect().catch(console.error);
subClient.connect().catch(console.error);

// Attach Redis adapter to Socket.IO
io.adapter(createAdapter(pubClient, subClient));

// Set up view engine for server-side rendering (using Pug)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session middleware for handling sessions
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'my_super_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});

app.use(sessionMiddleware);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST'],
  credentials: true,
}));

// Static Middleware for serving public assets
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    req.session.redirectTo = req.originalUrl; // Store the originally requested URL
    res.redirect('/login');
  }
}

// Routes
const routes = require('./routes');
app.use('/', routes);

// Login Route (GET)
app.get('/login', (req, res) => {
  res.render('login');
});

// Login Route (POST)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).lean();
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = { username: user.username, _id: user._id }; // Set the user in the session
      const redirectTo = req.session.redirectTo || '/';
      delete req.session.redirectTo; // Clean up session data
      res.redirect(redirectTo);
    } else {
      res.render('login', { error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.render('login', { error: 'An error occurred' });
  }
});

// Route to create a new chat room
app.post('/chat/new', isAuthenticated, async (req, res) => {
  const { recipients } = req.body;
  const currentUser = req.session.user;

  try {
    if (!recipients || recipients.trim() === "") {
      return res.render('chat_room_list', {
        username: currentUser.username,
        chatRooms: await ChatRoom.find({ users: { $in: [currentUser._id] } }).distinct('name'),
        error: 'Please enter at least one recipient.',
      });
    }

    let recipientList = recipients.split(',').map(r => r.trim()).filter(r => r !== currentUser.username);

    if (recipientList.length === 0) {
      return res.render('chat_room_list', {
        username: currentUser.username,
        chatRooms: await ChatRoom.find({ users: { $in: [currentUser._id] } }).distinct('name'),
        error: 'You cannot create a chat with only yourself.',
      });
    }

    const validUsers = await User.find({ username: { $in: recipientList } });
    if (validUsers.length !== recipientList.length) {
      return res.render('chat_room_list', {
        username: currentUser.username,
        chatRooms: await ChatRoom.find({ users: { $in: [currentUser._id] } }).distinct('name'),
        error: 'One or more recipients do not exist.',
      });
    }

    // Sort users and create a unique room name
    const users = [...validUsers.map(user => user._id), currentUser._id];
    users.sort(); // Sorting to ensure the same room is found for the same group of users

    // Find or create the chat room
    let chatRoom = await ChatRoom.findOne({ users: { $all: users }, type: users.length > 2 ? 'group' : 'one_to_one' });

    if (!chatRoom) {
      chatRoom = new ChatRoom({
        name: `Chat with ${recipientList.join(', ')}`,
        type: users.length > 2 ? 'group' : 'one_to_one',
        users,
      });
      await chatRoom.save();
    }

    res.redirect(`/chat/${chatRoom._id}`);
  } catch (err) {
    console.error('Error creating new chat:', err);
    res.status(500).render('chat_room_list', {
      username: currentUser.username,
      chatRooms: await ChatRoom.find({ users: { $in: [currentUser._id] } }).distinct('name'),
      error: 'An error occurred while creating the chat.',
    });
  }
});

// Route to render the form to create a new chat
app.get('/new_chat', isAuthenticated, (req, res) => {
  res.render('new_chat');
});

// Protected Chat Route for Group and Direct Messages
app.get('/chat', isAuthenticated, async (req, res) => {
  const currentUser = req.session.user;

  try {
    const chatRooms = await ChatRoom.find({ users: { $in: [currentUser._id] } });

    res.render('chat_room_list', {
      username: currentUser.username,
      chatRooms,
    });
  } catch (err) {
    console.error('Error loading chat rooms:', err);
    res.render('chat_room_list', {
      username: currentUser.username,
      chatRooms: [],
    });
  }
});

// Route to access specific chat room
app.get('/chat/:id', isAuthenticated, async (req, res) => {
  const roomId = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).render('chat_room', { error: 'Invalid room ID.' });
    }

    const chatRoom = await ChatRoom.findById(roomId).populate('users');
    if (!chatRoom) {
      return res.status(404).render('chat_room', { error: 'Chat room not found.' });
    }

    const messages = await MessageModel.find({ room: roomId }).sort({ createdAt: 1 });

    res.render('chat_room', {
      room: chatRoom,
      messages,
      username: req.session.user.username, // Pass the username to the client
    });
  } catch (err) {
    console.error('Error loading chat room:', err);
    res.status(500).render('chat_room', { error: 'Error loading chat room.' });
  }
});

io.use(sharedSession(sessionMiddleware, {
  autoSave: true,
}));

// Socket.IO Handlers for Direct and Group Messages
io.on('connection', (socket) => {
  if (socket.handshake.session.user) {
    socket.username = socket.handshake.session.user.username;
    console.log(`A user connected: ${socket.username}`);
  } else {
    console.log(`A user connected without a session: ${socket.id}`);
    return; // Disconnect if no session is available
  }

  // Handle joining a room
  socket.on('join room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.username} joined room: ${roomId}`);
  });

  // Handle sending private messages
  socket.on('private message', async ({ content, room }) => {
    const username = socket.username;

    // Emit the message to everyone in the room (including sender)
    io.in(room).emit('private message', {
      content,
      from: username,
    });

    // Save the message to MongoDB
    try {
      const message = new MessageModel({
        message: content,
        sender: username,
        room: room,
        createdAt: new Date(),
      });
      await message.save();
      console.log('Message saved to MongoDB:', message);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.username}`);
  });
});

// Start the HTTP server with Socket.IO integrated
const port = process.env.PORT || 3001;
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
