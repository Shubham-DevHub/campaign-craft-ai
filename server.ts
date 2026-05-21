import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
// Must set 'User-Agent': 'aistudio-build' in httpOptions for telemetry per skill instructions
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.post("/api/campaign/content", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate a comprehensive email marketing campaign based on the following request: "${prompt}". 
      Include 3 catchy subject lines, highly engaging body copy (with placeholders for name/company), a descriptive image generation prompt for the main visual, target audience description, tone of voice, and a strong call to action.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subjectLines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 varying subject lines"
            },
            bodyCopy: {
              type: Type.STRING,
              description: "The full HTML/Markdown-ready body copy of the email"
            },
            imagePrompt: {
              type: Type.STRING,
              description: "A detailed prompt for generating a visual asset that matches the campaign mood"
            },
            targetAudience: {
              type: Type.STRING,
              description: "Description of who this email is targeting"
            },
            tone: {
              type: Type.STRING,
              description: "The stylistic tone of the writing"
            },
            callToAction: {
              type: Type.STRING,
              description: "The primary button or link text"
            }
          },
          required: ["subjectLines", "bodyCopy", "imagePrompt", "targetAudience", "tone", "callToAction"]
        }
      }
    });

    const parsedData = JSON.parse(response.text.trim());
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error generating campaign content:", error);
    return res.status(500).json({ error: error.message || "Failed to generate campaign content" });
  }
});

const getFallbackImageUrl = (prompt: string): string => {
  const lowercasePrompt = prompt.toLowerCase();
  
  if (lowercasePrompt.includes("coffee") || lowercasePrompt.includes("bean") || lowercasePrompt.includes("cafe")) {
    return "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=85";
  }
  if (lowercasePrompt.includes("hotel") || lowercasePrompt.includes("boutique") || lowercasePrompt.includes("stay") || lowercasePrompt.includes("travel") || lowercasePrompt.includes("resort") || lowercasePrompt.includes("vacation")) {
    return "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=85";
  }
  if (lowercasePrompt.includes("sneaker") || lowercasePrompt.includes("shoe") || lowercasePrompt.includes("footwear") || lowercasePrompt.includes("fashion") || lowercasePrompt.includes("style")) {
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85";
  }
  if (lowercasePrompt.includes("cyber") || lowercasePrompt.includes("security") || lowercasePrompt.includes("healthcare") || lowercasePrompt.includes("analytics") || lowercasePrompt.includes("ai") || lowercasePrompt.includes("tech") || lowercasePrompt.includes("software") || lowercasePrompt.includes("code")) {
    return "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=85";
  }
  if (lowercasePrompt.includes("food") || lowercasePrompt.includes("dining") || lowercasePrompt.includes("drink") || lowercasePrompt.includes("restaurant") || lowercasePrompt.includes("beverage") || lowercasePrompt.includes("cook")) {
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=85";
  }
  if (lowercasePrompt.includes("marketing") || lowercasePrompt.includes("sales") || lowercasePrompt.includes("business") || lowercasePrompt.includes("corporate")) {
    return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=85";
  }
  
  // High-end minimalist design abstract background as the supreme ultimate fallback
  return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=85"; 
};

app.post("/api/campaign/visual", async (req, res) => {
  const { imagePrompt } = req.body;
  
  if (!imagePrompt) {
    return res.status(400).json({ error: "Image prompt is required" });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          { text: `${imagePrompt}. Professional, high-quality commercial photography, clean composition, minimalist.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    let imageUrl: string | null = null;
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error("No image data returned from Gemini image model");
    }

    return res.json({ imageUrl });
  } catch (error: any) {
    console.warn("Gemini image generation rate-limited or failed. Initiating high-resolution fallback mechanism:", error.message || error);
    
    // Fallback gracefully instead of failing the request
    const fallbackUrl = getFallbackImageUrl(imagePrompt);
    return res.json({ imageUrl: fallbackUrl, isFallback: true });
  }
});

// Vite Middleware for development / Static file serving for production
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
