import { io } from 'socket.io-client';

// Retrieve the JWT token from localStorage (or Vuex store, or wherever you store it)
const token = localStorage.getItem('auth_token'); // Replace with your token retrieval method

// Declare socket and sendMessage at the top level
let socket;
let sendMessage;

// Check if the token exists before attempting to connect
if (!token) {
  console.error('Authentication error: No token found');
  // Handle the error appropriately, such as redirecting to login
} else {
  // Connect to the backend server using the token
  socket = io('http://localhost:3000', {
    auth: {
      token: token, // Send the token to the backend for authentication
    },
  });

  // Listen for messages from the server
  socket.on('receiveMessage', (message) => {
    console.log('Received message:', message);
    // You can handle the message here, like updating your Vue component's state
  });

  // Function to send a message to the server
  sendMessage = function(content) {
    const message = { content: content };
    socket.emit('sendMessage', message); // Emit the message event to the server
  };
}

// Export the socket instance and sendMessage function for use in components
export { socket, sendMessage };
