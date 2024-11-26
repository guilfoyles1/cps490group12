const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const session = require('express-session');
const cors = require('cors');

// SocketIO Loader
const { createServer } = require('http');
const httpServer = createServer(app);  // Create server after app initialization
const socket = require('./config/socket');
socket(httpServer);

// Database Loader (if required for user authentication or messaging)
const db = require('./config/db');  // Make sure this file is set up to handle DB connections if necessary

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // Adjust this path if necessary

// Set up static middleware to serve Vue app (Make sure your build directory is correct)
app.use('/', express.static(path.join(__dirname, 'dist')));
// Serve static files from public
app.use('/', express.static(path.join(__dirname, 'public')));

// For parsing application/json
app.use(bodyParser.json());
// For parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// For parsing multipart/form-data (e.g., file uploads)
app.use(upload.array());

// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'my_super_secret_key', // Use environment variable for production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Allow requests from the frontend URL
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',  // Allow frontend domain
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Initialize router
const router = require('./routes');
//Tell index to use router for all links starting with '/'
app.use('/', router);

// Handle all other routes (SPA behavior - ensure Vue app handles routes)
//app.get('*', (req, res) => {
//    res.render('index', { title: 'Your Page Title' });  // Pass dynamic data if necessary
//  });
  
// Run application on specified port
const port = process.env.PORT || 3001;
httpServer.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
