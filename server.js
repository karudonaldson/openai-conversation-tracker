const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => res.send("Server is running!"));

// 🔹 Add this API route
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message text is required" });
  }

  console.log(`User: ${message}`);

  // Mock response for now
  const botReply = `Echo: ${message}`;
  res.json({ reply: botReply });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
