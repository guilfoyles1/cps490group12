const socket = require('../config/socket');
const Message = require('../models/message');
const User = require('../models/users');
const ChatRoom = require('../models/chatRoom');

const globalChat = new ChatRoom({
    name: "Global Chat",
    type: "global",
    users: [],
    messages: []
});

modules.exports = {
    globalChat
};