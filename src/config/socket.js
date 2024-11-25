const socketio = require('socket.io');

module.exports = (server) => {
    const io = socketio(server); // Pass the server to Socket.IO

    io.on('connection', (socket) => {
        console.log('User connected');

        // Handle custom events
        // socket.on('join', (user) => {
        //     console.log(`${user.username} joined the chat`);
        //     socket.username = user.username; // Store username for this connection
        // });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};