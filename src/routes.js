const router = require("express").Router();
const userRouter = require("./routes/accounts");
const chatRouter = require("./routes/chat"); // Import chat routes

// C for Create: HTTP POST
// R for Read: HTTP GET
// U for Update: HTTP PUT
// D for Delete: HTTP DELETE

// Handle '/' loading home page
router.get("/", (req, res) => {
    // Check user logged in and pass username to pug
    let username = req.session && req.session.user ? req.session.user.username : '';
    res.render('home_page', {
        isLoggedIn: req.session && req.session.user,
        username
    });
});

// Tell routes.js to use accounts.js for handling user account info
router.use('/', userRouter)

// Adds middleware to check if user is authenticated for chat routes
router.use('/chat', (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
});

// Adds chat routes
router.use('/chat', chatRouter); // Use chatRouter for handling chat-related requests

// General error handling middleware
router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Something went wrong!"); // Customize as needed
});

module.exports = router;
