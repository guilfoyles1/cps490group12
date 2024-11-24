const router = require("express").Router();


// router.get("/:username/chat", (req, res) => {
//     const { username } = req.session.user.name;
//     res.render('test_message', { username });
// });

router.get('/chatrooms', (req, res) => {
    res.render('test_message');
});

router.post('/chatrooms', async (req, res) => {
    const { usernames } = req.body; //Sets array of usernames
    try {
        //Grab ids from input usernames
        const users = await User.find({ username: { $in: usernames } });
        if (users.length === 0)
            return res.status(404).json({ error: 'User(s) not found' });

        //Extract user ids
        const userIds = users.map(user => user._id);

        //Set chat room type
        const roomType = userIds.length > 1 ? 'group' : 'one_to_one';

        //Check for 1-1 chat to exist
        if (roomType === 'one_to_one') {
            const existingRoom = await ChatRoom.findOne({
                type: 'one_to_one',
                participants: { $all: userIds, $size: 2 }, //Checks both participants
            });
            if (existingRoom) {
                return res.status(200).json(existingRoom); //Returns existing room
            }
        }

        //Create new chat room
        const chatRoom = await ChatRoom.create({
            type: roomType,
            participants: userIds,
        });

        res.status(201).json(chatRoom);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

router.get('/global', (req, res) => {
    res.render('global');
});

module.exports = router;