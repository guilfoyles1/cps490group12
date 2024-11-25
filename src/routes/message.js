const router = require("express").Router();
const Message = require('../models/message');
const User = require('../models/users');
const ChatRoom = require('../models/chatRoom');

// router.get("/:username/chat", (req, res) => {
//     const { username } = req.session.user.name;
//     res.render('test_message', { username });
// });

router.get('/new_chat', (req, res) => {
    if (!req.session.user) { // Check if user is logged in
        return res.redirect('/login?from=${encodeURIComponent(req.originalUrl)}'); // Redirect to login if not
    }
    res.render('test_message');
});

router.post('/new_chat', async (req, res) => {
    const { usernames } = req.body;
    const currentUser = req.session.user;

    // Check logged-in
    if (!currentUser) {
        return res.status(401).render('test_message', { message: `You must be logged in to create a new chat!` });
    }

    // Check input > 0
    if (!usernames || usernames.length === 0) {
        return res.status(400).render('test_message', { message: 'Please enter at least one username.' });
    }

    // Validate input users
    const validUsers = await User.find({ username: { $in: usernames } });

    if (validUsers.length != usernames.length) {
        return res.status(500).render('test_message', { message: 'Some users do not exist!' });
    } else {
        usernames.push(currentUser.username);
    }

    const newRoom = new ChatRoom({
        name: `${usernames.join(`, `)}`,
        type: usernames.length > 2 ? 'group' : 'one_to_one',
        users: validUsers.map(user => user._id),
    });
    
    try {
        await newChat.save();
        res.status(200).json(newChat);
    } catch (error) {
        console.error('Error creating chat room: ', error);
        return res.status(500).render('test_message', { message: 'Error creating chat room.' });

    }
});

router.get('/global', async (req, res) => {
    try {
        // Check if a global chat room already exists
        let globalChatRoom = await ChatRoom.findOne({ type: 'global' }).populate('messages.sender');

        if (!globalChatRoom) {
            // If no global room exists, create one
            globalChatRoom = new ChatRoom({
                name: 'Global Chat',
                type: 'global',
                users: [], // Can leave empty or add default users
                messages: [],
            });
            await globalChatRoom.save();
        }

        // Fetch all messages for the global chat room
        const messages = globalChatRoom.messages;

        // Render the global chat page, passing the messages
        res.render('global', { messages });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading global chat');
    }
});

module.exports = router;