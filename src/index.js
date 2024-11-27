const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const session = require('express-session');
const cors = require('cors');

// Socket.IO Loader
const { createServer } = require('http');
const httpServer = createServer(app);  // Create server after app initialization
const socket = require('./config/socket');
socket(httpServer);

// Database Loader (if required for user authentication or messaging)
const db = require('./config/db');  // Make sure this file is set up to handle DB connections if necessary

// Set up view engine for any server-side rendering (using Pug here, adjust as needed)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // Adjust this path if necessary

// Set up static middleware to serve Vue app (Make sure your build directory is correct)
app.use('/', express.static(path.join(__dirname, 'dist')));
// Serve static files from public
app.use('/', express.static(path.join(__dirname, 'public')));

// Middleware for parsing JSON data
app.use(bodyParser.json());
// Middleware for parsing URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware for parsing multipart/form-data (e.g., file uploads)
app.use(upload.array());

// Configure session middleware for handling sessions (like authentication)
app.use(session({
    secret: process.env.SESSION_SECRET || 'my_super_secret_key', // Use environment variable for production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// CORS configuration to allow requests from frontend (adjust URL as necessary)
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://group12frontend-defd760e75d0.herokuapp.com/',  // Allow frontend domain (Vue app)
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Initialize router and use it for all routes starting with '/'
const router = require('./routes');
app.use('/', router);

// For handling SPA (Vue Router) behavior: catch-all route to return Vue's index.html for any routes not handled by API
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html')); // Corrected path
});

// Start the HTTP server with Socket.io integrated
const port = process.env.PORT || 3001;
httpServer.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
