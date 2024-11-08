//DB info
const uname = "admin";
const pword = "CapstoneG12Admin!";
const cluster = "capstone-1-app.ynepw"
const dbname = ""; //defaults to "test" if left blank

//Login to DB
const uri = `mongodb+srv://${uname}:${pword}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`;

const mongoose = require('mongoose');
const mongoose_settings = {useNewUrlParser: true};

//Connect to DB
mongoose.connect(uri, mongoose_settings);
const db = mongoose.connection;

//DB connection success/fail
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Connected successfully to MongoDB")
});

module.exports = {db}