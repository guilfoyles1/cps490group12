const socket = require('../config/socket');
const Message = require('../models/message');
const User = require('../models/users');
const ChatRoom = require('../models/chatRoom');


// Chat Functions

// Send Message
const sendMessage = async (chatRoomId, sender, messageText) => {
    try {
      // Step 1: Create a new message
      const newMessage = new Message({
        sender,
        message: messageText
      });
  
      // Save the message to the database
      await newMessage.save();
  
      // Step 2: Find the chat room and add the message ID to its messages array
      const chatRoom = await ChatRoom.findById(chatRoomId);
      chatRoom.messages.push(newMessage._id); // Add the new message's ObjectId to the room
  
      // Save the updated chat room
      await chatRoom.save();
  
      console.log('Message sent and added to chat room.');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

// Delete Message (?)
// const deleteMessage = async () {};

modules.exports = {
    sendMessage,
};