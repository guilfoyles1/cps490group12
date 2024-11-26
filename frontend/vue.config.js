const path = require('path'); // Import 'path' module

module.exports = {
  devServer: {
    proxy: {
      '/api': { // Proxy for backend API
        target: 'http://localhost:3001', // Backend running on port 3001
        changeOrigin: true,
        pathRewrite: { '^/api': '' }, // Rewrite '/api' prefix to ''
      },
      '/socket.io': { // Proxy for WebSocket
        target: 'http://localhost:3001', // Backend WebSocket running on port 3001
        ws: true, // Enable WebSocket proxying
        changeOrigin: true,
      },
      '/chat': { // Proxy for chat functionality
        target: 'http://localhost:8080', // Chat app running on port 8080
        changeOrigin: true,
        pathRewrite: { '^/chat': '' }, // Rewrite '/chat' prefix to ''
      },
    },
  },
};
