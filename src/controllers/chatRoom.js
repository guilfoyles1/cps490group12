// imports
const Message = require('../models/message');
const User = require('../models/users');
const ChatRoom = require('../models/chatRoom');


// Create room


// Add to room
const joinRoom = async (chatRoomId, user) => {
    const room = await ChatRoom.findById(chatRoomId);

    // Check user
    if (!user) {
        console.log('User does not exist.');
    }
    
    // Add user to room
    room.users.push(user);

    // Update room type
    if (room.type != 'global') {
        room.type = room.users.length > 2 ? 'group' : 'one_to_one';
        }
    
    await room.save();
};

// Leave room
// const Room = async (chatRoomId, user) => {};


// Exports
modules.exports = {
    joinRoom,
};