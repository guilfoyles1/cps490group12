const mongoose = require('mongoose');

const FeedPostSchema = new mongoose.Schema({
  content: { type: String, required: true }, // Post content
  author: { type: String, required: true },  // Username of the author
  createdAt: { type: Date, default: Date.now }, // Timestamp of the post
});

module.exports = mongoose.model('FeedPost', FeedPostSchema);
