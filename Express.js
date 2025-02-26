const express = require("express");
const mongoose = require("mongoose");
const Conversation = require("./models/Conversation"); // Import schema
require("dotenv").config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Store a new conversation
app.post("/conversations", async (req, res) => {
  try {
    const { title, content, tags, visibility } = req.body;
    const newConversation = new Conversation({ title, content, tags, visibility });
    await newConversation.save();
    res.status(201).json({ message: "✅ Conversation saved!", data: newConversation });
  } catch (error) {
    res.status(500).json({ message: "❌ Error saving conversation", error });
  }
});

// Retrieve all public conversations
app.get("/conversations", async (req, res) => {
  try {
    const conversations = await Conversation.find({ visibility: "public" }).sort({ createdAt: -1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching conversations", error });
  }
});

// Retrieve a specific conversation by ID
app.get("/conversations/:id", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ message: "❌ Conversation not found" });
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching conversation", error });
  }
});

// Update a conversation's visibility
app.put("/conversations/:id", async (req, res) => {
  try {
    const { visibility } = req.body;
    const updatedConversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { visibility },
      { new: true }
    );
    res.json({ message: "✅ Conversation updated!", data: updatedConversation });
  } catch (error) {
    res.status(500).json({ message: "❌ Error updating conversation", error });
  }
});

// Delete a conversation
app.delete("/conversations/:id", async (req, res) => {
  try {
    await Conversation.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Conversation deleted!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting conversation", error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
