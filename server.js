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
  console.log("✅ Incoming Request Body:", req.body); // Debugging log

  if (!req.body || !req.body.message) {
    console.error("❌ Missing 'message' field in request!");
    return res.status(400).json({ error: "Message text is required" });
  }

  console.log(`👤 User: ${req.body.message}`);
  res.json({ reply: `Echo: ${req.body.message}` });
});

const os = require('os');

const getNetworkIPs = () => {
  const nets = os.networkInterfaces();
  const results = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        results.push(net.address);
      }
    }
  }

  return results;
};

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

//app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT} (Available at: ${getNetworkIPs().join(', ')})`);
});