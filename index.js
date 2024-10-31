const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const session = require('express-session');

const db = require('./config/db');

app.set('view engine', 'pug');
app.set('views', './views');

//For parsing application/json
app.use(bodyParser.json());
//For parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//For parsing multipart/form-data
app.use(upload.array());

// Configure session middleware
app.use(session({
    secret: 'my_super_secret_key', // Hardcoded secret. Replace with an environment variable in production for enhanced security
    resave: false, // Forces session to be saved back to the session store, even if it was never modified
    saveUninitialized: true, // Forces a session that is uninitialized to be saved to the store
    cookie: { secure: false } // Set to true if using HTTPS
}));

//Initialize router in index
const router = require('./routes');
//Tell index to use router for all links starting with '/'
app.use('/', router);

//Run application
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});