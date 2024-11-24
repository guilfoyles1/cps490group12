const Message = require('../models/message');
const User = require('../models/users');
const ChatRoom = require('../models/chatRoom');

//Initialize socket.io server connection
const io = new Server(server);
const socket = io();

//Message form
const form = document.getElementById('message-form');



//Chat control functions
function joinRoom(roomId) {
    socket.emit('join_room', roomId);
}

function sendMessage(roomId, senderId, content) {
    socket.emit('send_message', { roomId, senderId, content });
}

//New Message Listener
socket.on('new_message', (message) => {
    //Test command to register messages
    console.log('New message: ', message);
});





//User connection handler
io.on('connection', (socket) => {
    //Test log to ensure users are loaded when they open the site
    console.log('User connected: ', socket.id);

    //Joining a chat room
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        //Test check for user joined
        console.log(`User has joined room: ${roomId}.`);
    });

    //Message handler
    socket.on('send_message', async ({ roomId, senderId, content }) => {
        try {
            const chat = await Message.create({
                room: roomId,
                sender: senderId,
                content,
            });
            io.to(roomId).emit('new_message', chat);
        } catch (error) {
            console.error('Error sending message: ', error);
        }
    });

    socket.on('disconnect', () => {
        //Test log to ensure disconnect detected
        console.log('User disconnected: ', socket.id);
    });
});