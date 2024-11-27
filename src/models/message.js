const mongoose = require('mongoose');


const MessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
      },
      sender: {
        type: String,
        required: true
      }
    },
    {
      timestamps: true
});



const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;