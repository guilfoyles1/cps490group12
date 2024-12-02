const socket = require('../config/socket');
const Message = require('../models/message');
const User = require('../models/users');
const ChatRoom = require('../models/chatRoom');

// Chat Functions

// Send Message
const sendMessage = async (chatRoomId, senderId, messageText) => {
    try {
        // Create a new message
        const newMessage = new Message({
            sender: senderId,
            message: messageText,
        });

        // Save the message to the database
        await newMessage.save();

        // Find the chat room and add the message ID to its messages array
        const chatRoom = await ChatRoom.findById(chatRoomId);
        if (!chatRoom) {
            throw new Error('Chat room not found.');
        }
        chatRoom.messages.push(newMessage._id); // Add the new message's ObjectId to the room

        // Save the updated chat room
        await chatRoom.save();

        // Emit the new message to all users in the chat room
        socket.to(chatRoomId).emit('newMessage', {
            senderId,
            message: messageText,
            timestamp: newMessage.createdAt,
        });

        console.log('Message sent and added to chat room.');

        // Return the saved message in case it’s needed elsewhere
        return newMessage;
    } catch (err) {
        console.error('Error sending message:', err);
        throw err; // Ensure errors are handled properly in calling code
    }
};

// Delete Message
const deleteMessage = async (chatRoomId, messageId) => {
    try {
        // Find the chat room
        const chatRoom = await ChatRoom.findById(chatRoomId);
        if (!chatRoom) {
            throw new Error('Chat room not found.');
        }

        // Remove the message ID from the chat room's messages array
        chatRoom.messages = chatRoom.messages.filter(
            (id) => id.toString() !== messageId
        );

        // Save the updated chat room
        await chatRoom.save();

        // Delete the message from the database
        await Message.findByIdAndDelete(messageId);

        console.log('Message deleted successfully.');
    } catch (err) {
        console.error('Error deleting message:', err);
        throw err; // Ensure errors are handled properly in calling code
    }
};

module.exports = {
    sendMessage,
    deleteMessage, // Export the deleteMessage function if needed
};
