const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  sender: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: false, // Optional for group messages
  },
  room: {
    type: String,
    required: false, // Used for group messages
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isGroup: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('Chat', chatSchema);
