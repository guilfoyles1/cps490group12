// routes/chat.js

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController'); // Import the chat controller

// Route for creating a new chat message
router.post('/create', chatController.createChat);

// Route for retrieving chat messages
router.get('/retrieve', chatController.getChats);

module.exports = router;
