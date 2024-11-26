const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const session = require('express-session');

// SocketIO Loader
const { createServer } = require('http');
const httpServer = createServer(app);
const socket = require('./config/socket');
socket(httpServer);

// Database Loader
const db = require('./config/db');

app.set('view engine', 'pug');
app.set('views', './views');

// Set up static middleware
app.use('/', express.static('public'));

// For parsing application/json
app.use(bodyParser.json());
// For parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// For parsing multipart/form-data
app.use(upload.array());

// Configure session middleware
app.use(session({
    secret: 'my_super_secret_key', // Hardcoded secret. Replace with an environment variable in production for enhanced security
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize router in index
const router = require('./routes');
app.use('/', router);

// Run application
const port = process.env.PORT || 3000; // Changed to 3000 as per instructions
httpServer.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
