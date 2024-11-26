<template>
  <div>
    <div class="left-panel">
      <user
        v-for="user in users"
        :key="user.userID"
        :user="user"
        :selected="selectedUser === user"
        @select="onSelectUser(user)"
      />
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
import User from "./User";
import MessagePanel from "./MessagePanel";

export default {
  name: "Chat",
  components: { User, MessagePanel },
  data() {
    return {
      selectedUser: null,
      users: [],
    };
  },
  methods: {
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

    // Assuming you will pass user data (e.g., from the backend or socket connection)
    socket.emit('joinRoom', { roomID: this.$route.params.roomID });
  },
};
</script>
