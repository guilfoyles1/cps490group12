const mongoose = require('mongoose');
const Message = require("../models/message"); // Import the message model


const ChatRoomSchema = new mongoose.Schema(
    {
      name: {
        type: String
     }, // Optional for 1-to-1 chats
      type: { 
        type: String,
        enum: ['one_to_one', 'group', 'global'],
        required: true
    }, // Define chat type
      users: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }], // 2 users for one-to-one, all users added for global
      messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
      }],
      createdAt: {
        type: Date,
        default: Date.now
    },
    },
    { timestamps: true }
  );
  

const RoomModel = mongoose.model('ChatRoom', ChatRoomSchema);

module.exports = RoomModel;