module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',  // Backend API (your app running on port 3001)
        changeOrigin: true,
        pathRewrite: { '^/api': '' },  // Rewrites '/api' to base URL for the backend
      },
      '/socket.io': {
        target: 'http://localhost:3001',  // WebSocket API (Backend Socket.IO service)
        ws: true,  // Enable WebSocket proxying
        changeOrigin: true,
      },
      '/chat': {
        target: 'http://localhost:8080', // Chat app running on port 8080
        changeOrigin: true,
        pathRewrite: { '^/chat': '' },  // Rewrites '/chat' to base URL for the chat app
      },
    },
  },
};
