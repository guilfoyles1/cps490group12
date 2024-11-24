// const { Server } = require('socket.io');

// let io;

// const socket = (server) => {
//     io = new Server(server); // Initialize socketio

//     io.on("connection", (socket) => {
//         console.log("user connected");
    
//         socket.on("disconnect", function() {
//             console.log("user disconnected");
//         });
    
//         //active typing
//         socket.on("typing", data => {
//             socket.broadcast.emit("notifyTyping", {
//                 user: data.user,
//                 message: data.message
//             });
//         });
//     });
// };


// module.exports = {
//     socket,
// };

const socketio = require('socket.io');

module.exports = (server) => {
    const io = socketio(server); // Pass the server to Socket.IO

    io.on('connection', (socket) => {
        console.log('User connected');

        // Handle custom events
        socket.on('join', (user) => {
            console.log(`${user.username} joined the chat`);
            socket.username = user.username; // Store username for this connection
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};