const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const { createServer } = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

// Models
const User = require('./models/users');
const Chat = require('./models/chat'); // Import Chat model for chat functionality

// Initialize Express App
const app = express();
const httpServer = createServer(app);
const io = socketIO(httpServer);

// Connect to MongoDB
const dbURI = process.env.MONGO_URI || 'mongodb+srv://admin:CapstoneG12Admin!@capstone-1-app.ynepw.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Set up view engine for server-side rendering (using Pug)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session middleware for handling sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'my_super_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

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
    const user = await User.findOne({ username, password }).lean();
    if (user) {
      req.session.user = { username: user.username }; // Set the user in the session
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

// Protected Chat Route for Group and Direct Messages
app.get('/chat', isAuthenticated, (req, res) => {
  res.render('chat_room', { username: req.session.user.username });
});

// Socket.IO Handlers for Direct and Group Messages
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Store the username of the connected user
  socket.on('join', (username) => {
    socket.username = username;
    console.log(`${username} has joined the chat.`);
  });

  // Handle sending direct messages
  socket.on('direct message', ({ recipient, message }) => {
    const recipientSocket = [...io.sockets.sockets.values()].find(
      (s) => s.username === recipient
    );

    if (recipientSocket) {
      recipientSocket.emit('direct message', {
        sender: socket.username,
        message,
      });
    }
  });

  // Handle sending group messages
  socket.on('group message', ({ room, message }) => {
    io.to(room).emit('group message', {
      sender: socket.username,
      message,
    });
  });

  // Handle joining a group room
  socket.on('join room', (room) => {
    socket.join(room);
    console.log(`${socket.username} joined room: ${room}`);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`${socket.username} has disconnected.`);
  });
});

// Start the HTTP server with Socket.IO integrated
const port = process.env.PORT || 3001;
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
