const bcrypt = require('bcrypt');
const User = require('../models/users');

// Helper function to check if a user exists
const userExists = async (username, email) => {
    const query = { username: username, email: email };
    return await User.exists(query);
};

// Middleware to check if the user is signed in
const checkSignIn = (req, res, next) => {
    if (req.session.user) {
        return next(); // If session exists, proceed to the next middleware
    } else {
        const err = new Error("Not logged in!");
        err.status = 401; // Unauthorized status code
        return next(err); // Pass the error to the error handling middleware
    }
};

// Request Handling

// Create a new user
const createUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // Check if the user already exists
        if (await userExists(username, email)) {
            return res.status(400).json({ success: false, message: "User already exists!" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user and save to the database
        const db_data = { name, username, email, password: hashedPassword };
        const createdUser = await User.create(db_data);
        if (!createdUser) {
            return res.status(404).json({ success: false, message: "User creation failed" });
        }

        res.status(201).json({ success: true, createdUser });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Login a user
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body; // Get the username and password from the request body

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

        // If successful, set the session and return a success response
        req.session.user = { id: user._id, username: user.username };
        res.status(200).json({ success: true, message: "Login successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get a user by username and email
const getUser = async (req, res) => {
    try {
        const { username, email } = req.params;
        const query = { username, email };

        const foundUser = await User.findOne(query);
        if (!foundUser) {
            return res.status(404).json({ success: false, message: "User retrieval failed" });
        }
        res.status(200).json({ success: true, foundUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Function to update the user's username
const updateUsername = async (req = null, res = null, newUsername = null) => {
    try {
        // Check session and set userId
        if (!req.session.user) {
            console.log('No user!');
        }
        const userId = req.session.user._id;

        // Check if the new username already exists
        const usernameExists = await User.exists({ username: newUsername });
        if (usernameExists) {
            return res.status(400).json({ success: false, message: "Username is already taken!" });
        }

        // Update the user's username
        const updatedUser = await User.findByIdAndUpdate(userId, { username: newUsername }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        req.session.message = { type: 'success', text: 'Username updated successfully!'};
        res.redirect('/update_user');
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Function to update the user's email
const updateEmail = async (req = null, res = null, newEmail = null) => {
    try {
        // Check session and set userId
        if (!req.session.user) {
            console.log('No user!');
        }
        const userId = req.session.user._id;

        // Check if the new email already exists
        if (await User.exists({ email: newEmail })) {
            return res.status(400).json({ success: false, message: "Email is already taken!" });
        }

        // Update the user's email
        const updatedUser = await User.findByIdAndUpdate(userId, { email: newEmail }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        req.session.message = { type: 'success', text: 'Email updated successfully!'};
        res.redirect('/update_user');
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Function to update the user's password
const updatePassword = async (req = null, res = null, newPassword = null) => {
    try {
        // Check session and set userId
        if (!req.session.user) {
            console.log('No user!');
        }
        const userId = req.session.user._id;

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        const updatedUser = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        req.session.message = { type: 'success', text: 'Password updated successfully!'};
        res.redirect('/update_user');
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const { username, email } = req.params;
        const query = { username, email };

        const deletedUser = await User.findOneAndDelete(query);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User deletion failed" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find().sort('-date');
        res.status(200).json({ success: true, allUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

// Export functions
module.exports = {
    userExists,
    createUser,
    loginUser,
    getUser,
    updateUsername,
    updateEmail,
    updatePassword,
    deleteUser,
    getAllUsers,
    checkSignIn
};
