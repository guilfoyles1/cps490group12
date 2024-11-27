const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");
const socketio = require("socket.io");
const jwt = require("jsonwebtoken");

// Load environment variables from .env file
require("dotenv").config();

// Redis clients for pub/sub
const pubClient = createClient({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
});
const subClient = pubClient.duplicate();

// Redis connection error handling
pubClient.on("error", (err) => console.log("Redis Client Error", err));
subClient.on("error", (err) => console.log("Redis Client Error", err));

pubClient.connect().catch(console.error);
subClient.connect().catch(console.error);

// Socket.IO setup function
module.exports = (httpServer) => {
    const io = socketio(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || "https://group12frontendserver-1bde9aa1d224.herokuapp.com/",  // Allow CORS
            methods: ["GET", "POST"],
        },
    });

    // Attach Redis adapter to Socket.IO
    io.adapter(createAdapter(pubClient, subClient));

    // Middleware for authentication using JWT
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            console.log("Authentication error: No token provided");
            return next(new Error("Authentication error"));
        }

        try {
            const user = verifyToken(token);  // Token verification
            socket.user = user;
            next();  // Proceed to connection
        } catch (err) {
            console.log("Authentication error: Invalid token");
            return next(new Error("Authentication error"));
        }
    });

    // Connection event handling
    io.on("connection", (socket) => {
        const { userId, username } = socket.handshake.auth;
        console.log(`User connected: ${socket.user.username}`);

        socket.on("sync session", (sessionData) => {
            console.log("Received session: ", sessionData);
        });

        // Handle sending private messages
        socket.on("private message", ({ content, to }) => {
            socket.to(to).emit("private message", {
                content,
                from: socket.user.username,
            });
        });

        // Handle user disconnection
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.user.username}`);
        });
    });
};

// JWT Token verification function
function verifyToken(token) {
    const SECRET_KEY = process.env.JWT_SECRET_KEY;

    if (!SECRET_KEY) {
        throw new Error("Missing JWT secret key");
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);  // Decode JWT token
        return decoded;  // Return decoded user data
    } catch (err) {
        throw new Error("Invalid token");
    }
}
