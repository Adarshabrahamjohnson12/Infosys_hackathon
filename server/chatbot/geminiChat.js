// server/chatbot/geminiChat.js

require("dotenv").config();
const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/chatbot
router.post("/", async (req, res) => {
try {
const { message } = req.body;
if (!message || typeof message !== "string") {
  return res.status(400).json({ error: "Invalid input. 'message' is required." });
}

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const result = await model.generateContent(message);
const response = result.response;
const reply = response.text();

res.status(200).json({ reply });
} catch (error) {
console.error("Gemini API error:", error);
res.status(500).json({ error: "Failed to generate response from Gemini" });
}
});

module.exports = router;