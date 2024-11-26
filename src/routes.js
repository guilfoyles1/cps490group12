const router = require("express").Router();
const userRouter = require("../src/routes/accounts");
const messageRouter = require("../src/routes/message");

// C for Create: HTTP POST
// R for Read: HTTP GET
// U for Update: HTTP PUT
// D for Delete: HTTP DELETE

// Handle '/' loading home page
router.get("/", (req, res) => {
    // Check user logged in and pass username to pug
    if (req.session && req.session.user) {
        username = req.session.user.username;
    } else {
        username = '';
    }
    res.render('home_page', {
        isLoggedIn: req.session && req.session.user,
        username
    });
});


// Tell routes.js to use accounts.js for handling user account info
router.use('/', userRouter);

//Adds message routes
router.use('/', messageRouter);

// General error handling middleware
router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Something went wrong!"); // Customize as needed
});

module.exports = router;