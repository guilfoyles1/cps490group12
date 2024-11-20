const app = require("express");
//Require http and socket.io
const io = require("socket.io");
const http = require("http").Server(app);

//Adding event listeners to http instance
const socket = io(http);

const Message = require("../models/message");

socket.on("connection", socket => {
    console.log("user connected");

    socket.on("disconnect", function() {
        console.log("user disconnected");
    });

    //active typing
    socket.on("typing", data => {
        socket.broadcast.emit("notifyTyping", {
            user: data.user,
            message: data.message
        });
    });
});
