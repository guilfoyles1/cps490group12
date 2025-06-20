const userController = require("../controllers/user");
const Users = require("../models/users"); // Import the User model
const bcrypt = require('bcrypt'); // Import bcrypt
const router = require("express").Router();
const userControl = require("../controllers/user");

// GET & POST for Signup
router.get('/signup', (req, res) => { // Signup GET request
    res.render('signup');
});

router.post('/signup', async (req, res) => { // Signup POST request
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        return res.render('signup', { message: "Please enter name, username, email, and password!" });
    }

    const userExists = await Users.exists({ username });
    if (userExists) {
        return res.render('signup', { message: "User already exists! Login or choose another username." });
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);
    //const newUser = { name, username, email, password: hashedPassword };

    // Create a new user object
    const newUser = {
        name,
        username,
        email,
        password: hashedPassword // Store password
    };

    try {
        const createdUser = await Users.create(newUser);
        req.session.user = createdUser; // Set the session user
        res.redirect('/protected_page'); // Redirect to protected page
    } catch (error) {
        console.error(error);
        res.status(500).render('signup', { message: "Error while creating user." });
    }
});

// GET & POST for Login
router.use((req, res, next) => {
    if (!req.session.user && !req.originalUrl.startsWith('/login') && !req.originalUrl.startsWith('/signup') && !req.originalUrl.match(/^\/(styles|js|images|favicon)/) ) {
        req.session.redirectTo = req.originalUrl; // Save the requested URL in the session
    }
    // Set redirectTo to '/' by default if undefined
    if (!req.session.redirectTo) {
        req.session.redirectTo = '/';
    } 
    next();
});


router.get('/login', (req, res) => {
    // Redirect if already logged in
    if (req.session.user && req.session) {
        res.redirect('/');
    }
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // Logic to redirect back to page they started from
    const fromUrl = req.session.redirectTo;
    delete req.session.redirectTo; // Clears saved URL from session

    if (!username || !password) {
        res.render('login', { message: "Please enter both username and password!" });
        return;
    }

    const user = await Users.findOne({ username });
    if (!user) {
        return res.render('login', { message: "User does not exist!" });
    }

    // Validate password using bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (match) {
        req.session.user = user;
        console.log("Session after login:", req.session);
        console.log(`${user.id} logged in.`);

        // Redirect to original page, otherwise redirect home
        return res.redirect(fromUrl);
    } else {
        return res.render('login', { message: "Invalid credentials!" });
    }
});

// GET /logout
router.get('/logout', (req, res) => {
    // Redirect if not logged in
    if (!req.session || !req.session.user) {
        console.log("No session found. Redirecting to homepage.");
        delete req.session.redirectTo; // Clears saved URL from session
        return res.redirect('/');
    }

    const username = req.session.user.username;
    req.session.destroy(() => {
        console.log(`${username} logged out.`);
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

// GET /protected_page
router.get('/protected_page', (req, res) => {
    console.log("Accessing protected page - Session data:", req.session);
    if (!req.session.user) { // Check if user is logged in
        req.session.redirectTo = req.originalUrl;
        return res.redirect('/login'); // Redirect to login if not
    }
    res.render('protected_page', { name: req.session.user.name }); // Passing 'name' instead of 'id'
});

// Error handling middleware for protected page
router.use((err, req, res, next) => {
    console.error("Error accessing protected page:", err);
    res.redirect('/login');
});

// GET & POST for Forgot Username and Password functionality (if needed)
router.get('/update_user', (req, res) => {
    console.log("Accessing update user page = Session data: ", req.session);
    if (!req.session.user) { //Check if logged in
        return res.redirect('/login');    
    }
    res.render('update_user', { name: req.session.user.name });
});

router.post('/update_user', async (req, res) => {
    const { actionType } = req.body;

    try {
        switch(actionType) {
            case 'update-username':
                const { newUsername } = req.body;
                await userControl.updateUsername(req, res, newUsername);
                console.log('Updating username to: ', newUsername);
                break;
            case 'update-email':
                const { newEmail } = req.body;
                await userControl.updateEmail(req, res, newEmail);
                console.log('Updating email to: ', newEmail);
                break;
            case 'update-password':
                const { newPassword } = req.body;
                await userControl.updatePassword(req, res, newPassword);
                console.log('Updating password');
                break;
            default:
                return res.status(400).json({ error: 'Invalid action'});
        }
    } catch {
        console.error('Error updating user: ', error);
        res.status(500).json({ error: 'Failed to update user.' });
    }
});

module.exports = router;
