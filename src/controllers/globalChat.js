// const socket = require('../config/socket');
const Message = require('../models/message');
const User = require('../models/users');
const ChatRoom = require('../models/chatRoom');

const socket = io();
const rooms = require('../controllers/chatRoom');

const globalChat = new ChatRoom({
    name: "Global Chat",
    type: "global",
    users: [],
    messages: []
});

// Add user to global chat
socket.on('join', (room, user) => {
    //Check user
    if (!user) {
        console.log('No user found.');
    }
    // Add user to room
    rooms.joinRoom(room, user);


    socket.emit('joinChat', user + ' has joined room: ', room);
});

// Remove user from global chat

modules.exports = {
    globalChat
};