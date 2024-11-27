// controllers/chatController.js

const Chat = require('../models/chat'); // Import the Chat model

// Controller to handle chat operations
const chatController = {

    // Function to create a new chat message
    createChat: async (req, res) => {
        try {
            const { content, recipient, isGroup } = req.body;
            const sender = req.session.user.username;

            // Creating a new chat message
            const newChat = new Chat({
                sender,
                recipient,
                content,
                isGroup,
                timestamp: new Date()
            });

            await newChat.save();
            res.status(201).json({ message: "Chat message created successfully." });
        } catch (error) {
            console.error("Error creating chat message:", error);
            res.status(500).json({ message: "Failed to create chat message." });
        }
    },

    // Function to retrieve chat messages for a user
    getChats: async (req, res) => {
        try {
            const username = req.session.user.username;

            // Retrieving chat messages where the user is either sender or recipient
            const chats = await Chat.find({
                $or: [
                    { sender: username },
                    { recipient: username }
                ]
            }).sort({ timestamp: 1 }); // Sorting by timestamp in ascending order

            res.status(200).json(chats);
        } catch (error) {
            console.error("Error retrieving chat messages:", error);
            res.status(500).json({ message: "Failed to retrieve chat messages." });
        }
    }
};

module.exports = chatController;
