<template>
  <div>
    <div class="left-panel">
      <button @click="startNewChat">New Chat</button>
      <!-- Iterate over users and display user information -->
      <div
        v-for="user in users"
        :key="user.userID"
        :class="{ selected: selectedUser === user }"
        @click="onSelectUser(user)"
        class="user-item"
      >
        <span>{{ user.name }}</span> <!-- Display user name or any other property -->
        <span v-if="user.hasNewMessages" class="new-message-indicator">New Messages</span>
      </div>
    </div>
    <message-panel
      v-if="selectedUser"
      :user="selectedUser"
      @input="onMessage"
      class="right-panel"
    />
  </div>
</template>

<script>
import socket from "../socket";
import MessagePanel from "./MessagePanel";

export default {
  name: "ChatComponent",
  components: { MessagePanel },
  data() {
    return {
      selectedUser: null,
      users: [],
    };
  },
  methods: {
    startNewChat() {
      this.$router.push({ name: "NewChat" }); // Navigate to the New Chat route
    },
    onMessage(content) {
      if (this.selectedUser) {
        socket.emit("private message", {
          content,
          to: this.selectedUser.userID,
        });
        this.selectedUser.messages.push({
          content,
          fromSelf: true,
        });
      }
    },
    onSelectUser(user) {
      this.selectedUser = user;
      user.hasNewMessages = false;
    },
  },
  created() {
    socket.on("users", (users) => {
      this.users = users;
    });

    socket.on("private message", ({ content, from }) => {
      for (let user of this.users) {
        if (user.userID === from) {
          user.messages.push({ content, fromSelf: false });
          if (user !== this.selectedUser) {
            user.hasNewMessages = true;
          }
          break;
        }
      }
    });

    if (this.$route.params.roomID) {
      socket.emit("joinRoom", { roomID: this.$route.params.roomID });
    }
  },
};
</script>

<style scoped>
/* Add some basic styling for the user list */
.user-item {
  padding: 10px;
  cursor: pointer;
}

.user-item.selected {
  background-color: #e0e0e0;
}

.new-message-indicator {
  color: red;
  font-size: 12px;
}
</style>
