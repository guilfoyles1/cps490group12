// imports
const Message = require('../models/message');
const User = require('../models/users');
const ChatRoom = require('../models/chatRoom');

// Create a new room
const createRoom = async (user1, user2) => {
    const existingRoom = await ChatRoom.findOne({
        users: { $all: [user1._id, user2._id] },
        type: 'one_to_one',
    });

    if (existingRoom) {
        return existingRoom; // Return the existing room if it already exists
    }

    // Create a new room for private messaging
    const room = new ChatRoom({
        users: [user1._id, user2._id],
        type: 'one_to_one',
    });

    await room.save();
    return room;
};

// Add user to a room
const joinRoom = async (chatRoomId, user) => {
    const room = await ChatRoom.findById(chatRoomId);

    // Check if user already exists
    if (!user) {
        console.log('User does not exist.');
        return;
    }

    // Add user to room
    if (!room.users.includes(user._id)) {
        room.users.push(user._id);
    }

    // Update room type based on the number of users
    if (room.users.length > 2) {
        room.type = 'group';
    } else {
        room.type = 'one_to_one';
    }

    await room.save();
};

// Leave a room
const leaveRoom = async (chatRoomId, user) => {
    const room = await ChatRoom.findById(chatRoomId);

    // Remove the user from the room
    room.users = room.users.filter((userId) => userId.toString() !== user._id.toString());

    // Save the updated room
    await room.save();
};

// Get messages in a room
const getMessagesInRoom = async (chatRoomId) => {
    const room = await ChatRoom.findById(chatRoomId).populate('messages');
    return room.messages;
};

// Export the functions
module.exports = {
    createRoom,
    joinRoom,
    leaveRoom,
    getMessagesInRoom,
};
