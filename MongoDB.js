const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Short topic name
  content: { type: String, required: true }, // Full conversation text
  tags: [{ type: String }], // Keywords for searchability
  createdAt: { type: Date, default: Date.now }, // Timestamp
  visibility: { type: String, enum: ["private", "public"], default: "private" }, // Determines if it should be displayed on the website
});

module.exports = mongoose.model("Conversation", conversationSchema);
