const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

const db = require('./config/db');

app.set('view engine', 'pug');
app.set('views', './views');

//For parsing application/json
app.use(bodyParser.json());
//For parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//For parsing multipart/form-data
app.use(upload.array());

//Initialize router in index
const router = require('./routes');
//Tell index to use router for all links starting with '/'
app.use('/', router);

//Run application
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});