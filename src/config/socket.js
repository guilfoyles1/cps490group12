const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");
const socketio = require("socket.io");

// Create Redis clients for pub/sub
const pubClient = createClient({ host: "localhost", port: 6379 });
const subClient = pubClient.duplicate();

// Error handling for Redis clients
pubClient.on("error", (err) => console.log("Redis Client Error", err));
subClient.on("error", (err) => console.log("Redis Client Error", err));

// Connect Redis clients
pubClient.connect().catch(console.error);
subClient.connect().catch(console.error);

// Export Socket.IO setup function
module.exports = (httpServer) => {
    const io = socketio(httpServer, {
        cors: {
            origin: "http://localhost:8080", // Allow CORS for the specified origin
        },
    });

    // Attach Redis adapter to Socket.IO
    io.adapter(createAdapter(pubClient, subClient));

    // Middleware for authentication
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            console.log('Authentication error: No token provided');
            return next(new Error('Authentication error'));
        }

        try {
            const user = verifyToken(token); // Implement token verification logic
            socket.user = user;
            next(); // Proceed to connection
        } catch (err) {
            console.log('Authentication error: Invalid token');
            return next(new Error('Authentication error'));
        }
    });

    // Handle connection events
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.user.username}`);

        // Handle messaging event
        socket.on("sendMessage", (message) => {
            console.log(`Message from ${socket.user.username}: ${message.content}`);
            // Broadcast message to all clients (or a specific group)
            io.emit("receiveMessage", { username: socket.user.username, content: message.content });
        });

        // Handle join event
        socket.on("join", (user) => {
            console.log(`${user.username} joined the chat`);
            socket.username = user.username;
        });

        // Handle disconnect event
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};

// Example token verification function
function verifyToken(token) {
    if (token === "your-secret-token") {
        return { username: "authorized_user" };
    } else {
        throw new Error("Invalid token");
    }
}
