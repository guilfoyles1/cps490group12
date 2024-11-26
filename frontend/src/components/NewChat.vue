<template>
  <div>
    <h1>Start a New Chat</h1>
    <form @submit.prevent="createNewChat">
      <input v-model="userName" placeholder="Enter username" />
      <button type="submit">Create Chat</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: "",
    };
  },
  methods: {
    async createNewChat() {
      try {
        const response = await this.$axios.post("/api/chatrooms", {
          userName: this.userName,
        }); // Create new chat room via API
        console.log("Chat created:", response.data);
        this.$router.push({ name: "Chat" }); // Redirect back to Chat
      } catch (error) {
        console.error("Error creating chat room:", error);
      }
    },
  },
};
</script>
