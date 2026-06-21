import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON
  app.use(express.json());

  // Initialize Gemini if key exists
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("GEMINI_API_KEY is not defined in the environment. AI trainer will run in demo/mock mode.");
  }

  // API Route - Trainer Chatbot
  app.post("/api/ai-trainer", async (req, res) => {
    try {
      const { message, chatHistory } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!ai) {
        // Fallback demo responses if Gemini API Key isn't configured yet
        const demoResponses = [
          "ELITE IRON AI is ready. To get real personalized training programs, configure your GEMINI_API_KEY in the Secrets panel! For now: Let's crush this session! 100% effort, zero excuses.",
          "Train like an elite champion today! If your goal is fat loss or raw muscle hypertrophy, consistency is your absolute key weapon. What muscle group are we destroying today?",
          "Elite Nutrition Check! Are you getting at least 1.6g to 2.2g of protein per kg of bodyweight? Our Premium Elite Whey is designed for rapid restoration.",
          "Welcome to ELITE IRON. I'm your AI Trainer. Tell me your specific targets and we'll engineer a customized protocol to shatter your previous metrics!"
        ];
        const randomDemo = demoResponses[Math.floor(Math.random() * demoResponses.length)];
        return res.json({ text: randomDemo });
      }

      // System instruction for the trainer
      const systemPrompt = "You are the head athletic coach and elite personal trainer at 'ELITE IRON', an ultra-premium luxury gym. Your posture is hyper-motivating, intense, sharp, deeply expert, and punchy. You guide users concerning fitness, bodybuilding, conditioning, and nutrition. Let responses be exciting, concise, and professional. Address the user directly and always keep them motivated like a high-intensity elite coach. Keep responses within 3-4 sentences. Do not use complex markdown, keep it clean.";
      
      // Compile the history safe prompt
      let promptWithContext = `${systemPrompt}\n\n`;
      if (chatHistory && Array.isArray(chatHistory)) {
        chatHistory.slice(-5).forEach((h: { sender: string; text: string }) => {
          promptWithContext += `${h.sender === 'user' ? 'User' : 'Trainer'}: ${h.text}\n`;
        });
      }
      promptWithContext += `User: ${message}\nTrainer:`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptWithContext,
      });

      const replyText = response.text || "I'm ready. Let's crush our goals together. What's next on our agenda?";
      res.json({ text: replyText });
    } catch (error: any) {
      console.error("Error in Gemini API route:", error);
      res.status(500).json({ error: "Failed to generate AI response. Please try again." });
    }
  });

  // API Route - Webhook Enquiry submission
  app.post("/api/enquiry", async (req, res) => {
    try {
      const { name, goal, whatsapp } = req.body;
      console.log("Enquiry payload received on server:", { name, goal, whatsapp, timestamp: new Date().toISOString() });
      
      // Simulate sending a JSON payload to a POST webhook
      const mockWebhookUrl = "https://webhook.eliteiron.com/v1/enquiry";
      console.log(`[SIMULATED WEBHOOK POST] Sending to ${mockWebhookUrl}:`, JSON.stringify({ name, goal, whatsapp }));

      res.status(200).json({ 
        success: true, 
        message: "Enquiry successfully logged and forwarded to Elite Iron Webhook.",
        payload: { name, goal, whatsapp }
      });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to process enquiry" });
    }
  });

  // Serve static UI using Vite middleware in development, and direct filesystem files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve build directory
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ELITE IRON Server] running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
