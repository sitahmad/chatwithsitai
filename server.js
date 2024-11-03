const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-002",
  systemInstruction: "Your name is Sky Infotech technologies, ...", // Customize this as needed
});

const generationConfig = {
  temperature: 1.25,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

app.use(express.json());
app.use(express.static('public')); // This line serves the static files

app.post("/send-message", async (req, res) => {
  const { message } = req.body;

  try {
    const chatSession = model.startChat({ generationConfig, history: [] });
    const result = await chatSession.sendMessage(message);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error("Error during AI processing:", error.message || error);
    res.status(500).json({ error: "Error processing the AI request.", details: error.message });
  }
});

// Make sure to listen to the correct port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
