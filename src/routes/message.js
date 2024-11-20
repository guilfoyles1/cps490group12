const router = require("express").Router();


router.get("/:username/chat", (req, res) => {
    const { username } = req.session.user;
    res.render('test_message', { username });
});


module.exports = router;