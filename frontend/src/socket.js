import { io } from 'socket.io-client';

// Retrieve the JWT token from localStorage
const token = localStorage.getItem('auth_token');  // Adjust this based on your actual token storage method

let socket;
let sendMessage;
let users = [];  // Store list of users

// Connect to the server with the JWT token if available
if (!token) {
  console.error('Authentication error: No token found');
} else {
  // Connect to the server with the JWT token
  socket = io('http://localhost:3000', {
    auth: {
      token: token,  // Send the JWT token to the server for authentication
    },
  });

  // Listen for the 'users' event to update the users list
  socket.on('users', (userList) => {
    users = userList;
    console.log('Connected users:', users);
  });

  // Listen for incoming private messages
  socket.on('private message', (message) => {
    console.log('Received private message:', message);
    // Handle the message (e.g., update Vue component state)
  });

  // Function to send a private message
  sendMessage = function(content, recipientId) {
    if (recipientId) {
      const message = { content, to: recipientId };
      socket.emit('private message', message);  // Emit private message to the server
    } else {
      console.error('No recipient selected');
    }
  };
}

// Export socket and sendMessage for use in Vue components
export { socket, sendMessage, users };
