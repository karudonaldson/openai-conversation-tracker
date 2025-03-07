const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // ✅ Import body-parser (optional)
require("dotenv").config();

const app = express();

// ✅ Make sure JSON parsing middleware is loaded BEFORE routes
app.use(express.json());
app.use(bodyParser.json()); // 🔹 (Backup in case Express' built-in parser isn't working)

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => res.send("Server is running!"));

// 🔹 Chat API Route (Recheck This)
app.post("/api/chat", (req, res) => {
  console.log("Incoming Request Body:", req.body); // ✅ Debugging log

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message text is required" });
  }

  console.log(`User: ${message}`);

  const botReply = `Echo: ${message}`;
  res.json({ reply: botReply });
});

const PORT = process.env.PORT || 5000;
//app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT} and accessible externally!`));