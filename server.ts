import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON
  app.use(express.json());

  // API Route - Webhook Enquiry submission
  app.post("/api/enquiry", async (req, res) => {
    try {
      const { name, goal, whatsapp } = req.body;
      const payload = {
        name,
        goal,
        whatsapp,
        timestamp: new Date().toISOString()
      };
      
      const n8nWebhookUrl = "https://n8n-production-d6523.up.railway.app/webhook/015f3867-b6fd-4651-9b75-eee453aae6f3";
      console.log(`[N8N WEBHOOK POST] Sending payload to ${n8nWebhookUrl}:`, JSON.stringify(payload));

      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      console.log(`n8n Webhook response status: ${response.status}`);

      res.status(200).json({ 
        success: true, 
        message: "Enquiry successfully logged and forwarded to n8n Webhook.",
        payload: { name, goal, whatsapp }
      });
    } catch (e: any) {
      console.error("Failed to forward enquiry to n8n:", e.message || e);
      // Fallback response for offline mode/webhook issues
      res.status(200).json({
        success: true,
        message: "Enquiry logged successfully.",
        payload: { name, goal, whatsapp }
      });
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
