const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow CORS for frontend requests
app.use(express.json()); // Parse JSON bodies

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  res.json({ reply: `You said: ${message}` }); // Example response
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

