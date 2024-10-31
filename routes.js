const router = require("express").Router();
const userRouter = require("./routes/accounts");

// C for Create: HTTP POST
// R for Read: HTTP GET
// U for Update: HTTP PUT
// D for Delete: HTTP DELETE

// Handle '/' loading home page
router.get("/", (req, res) => {
    res.render('home_page');
});

// Tell routes.js to use accounts.js for handling user account info
router.use('/', userRouter);

// General error handling middleware
router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Something went wrong!"); // Customize as needed
});

module.exports = router;
