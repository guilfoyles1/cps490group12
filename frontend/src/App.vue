<template>
  <div id="app">
    <div>
      <h1>Welcome to the Chat App</h1>
      <div v-if="!usernameSelected">
        <label for="username">Select your username:</label>
        <input v-model="username" placeholder="Enter username" />
        <button @click="selectUsername">Select Username</button>
      </div>

      <div v-if="usernameSelected">
        <h3>Users</h3>
        <ul>
          <li v-for="user in users" :key="user.userID">
            <button @click="selectRecipient(user)">{{ user.username }}</button>
          </li>
        </ul>

        <div v-if="selectedUser">
          <h3>Chat with {{ selectedUser.username }}</h3>
          <textarea v-model="messageContent" placeholder="Type a message..."></textarea>
          <button @click="sendPrivateMessage">Send Message</button>
          <div>
            <h4>Messages:</h4>
            <ul>
              <li v-for="msg in messages" :key="msg.timestamp">
                <p>{{ msg.fromSelf ? 'You' : selectedUser.username }}: {{ msg.content }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { socket, sendMessage, users } from './socket';

export default {
  name: 'App',
  data() {
    return {
      username: '',
      usernameSelected: false,
      selectedUser: null,
      messageContent: '',
      messages: [],
    };
  },
  computed: {
    users() {
      return users; // Get the list of connected users from the socket.js module
    }
  },
  methods: {
    selectUsername() {
      if (socket && !socket.connected) {
        // Connect the socket if it's not already connected
        socket.connect();
      }
      
      // Set the username in the socket auth object
      socket.auth = { username: this.username };
      
      // Emit the username selection event
      socket.emit('user selected', this.username);
      
      // Set usernameSelected flag to true
      this.usernameSelected = true;
    },
    selectRecipient(user) {
      // Set the selected user for private messaging
      this.selectedUser = user;
      this.messages = []; // Clear previous messages
    },
    sendPrivateMessage() {
      if (this.selectedUser && this.messageContent.trim()) {
        // Send the private message to the server
        sendMessage(this.messageContent, this.selectedUser.userID);
        
        // Update the local messages list with the sent message
        this.messages.push({
          content: this.messageContent,
          fromSelf: true,
          timestamp: Date.now(),
        });

        // Clear the message input
        this.messageContent = '';
      }
    }
  },
  mounted() {
    // Listen for incoming private messages and update the messages list
    socket.on('private message', (message) => {
      if (this.selectedUser && message.from === this.selectedUser.userID) {
        this.messages.push({
          content: message.content,
          fromSelf: false,
          timestamp: Date.now(),
        });
      }
    });
  }
};
</script>

<style scoped>
#app {
  text-align: center;
  margin-top: 60px;
}

button {
  margin-top: 10px;
}

ul {
  list-style-type: none;
}

textarea {
  width: 100%;
  height: 100px;
}

h3 {
  margin-top: 20px;
}
</style>
