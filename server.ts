import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Support large payloads for base64 image data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Helper to get GoogleGenAI client
function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Image Generation Endpoint
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio = "1:1", imageSize = "1K" } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "A prompt is required to generate an image." });
    }

    const ai = getGenAIClient();
    const candidateModels = ["gemini-3.1-flash-image-preview", "gemini-3.1-flash-image"];
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              {
                text: prompt.trim(),
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio,
              imageSize,
            },
          },
        });

        let imageUrl = "";
        let textOutput = "";

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            const mimeType = part.inlineData.mimeType || "image/png";
            imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          } else if (part.text) {
            textOutput += part.text;
          }
        }

        if (imageUrl) {
          return res.json({
            imageUrl,
            text: textOutput,
            model: modelName,
            aspectRatio,
            imageSize,
          });
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Attempt with ${modelName} failed:`, err?.message || err);
      }
    }

    const errorMessage = lastError?.message || "Failed to generate image.";
    const isQuotaError =
      errorMessage.includes("quota") ||
      errorMessage.includes("RESOURCE_EXHAUSTED") ||
      errorMessage.includes("429");

    return res.status(isQuotaError ? 429 : 500).json({
      error: errorMessage,
      isQuotaError,
      details: isQuotaError
        ? "Gemini Image models require a paid API key with billing enabled. Please select or configure a project with billing in AI Studio."
        : errorMessage,
    });
  } catch (error: any) {
    console.error("Error in /api/generate-image:", error);
    return res.status(500).json({
      error: error?.message || "Internal server error",
    });
  }
});

// Image Edit Endpoint
app.post("/api/edit-image", async (req, res) => {
  try {
    const { prompt, image, mimeType = "image/png", aspectRatio = "1:1" } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "An instruction prompt is required to edit the image." });
    }

    if (!image || typeof image !== "string") {
      return res.status(400).json({ error: "An input image (base64 string) is required for editing." });
    }

    let cleanBase64 = image;
    let actualMime = mimeType;

    if (image.startsWith("data:")) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        actualMime = match[1];
        cleanBase64 = match[2];
      }
    }

    const ai = getGenAIClient();
    const candidateModels = ["gemini-3.1-flash-image-preview", "gemini-3.1-flash-image"];
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType: actualMime,
                },
              },
              {
                text: prompt.trim(),
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio,
            },
          },
        });

        let imageUrl = "";
        let textOutput = "";

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || "image/png";
            imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          } else if (part.text) {
            textOutput += part.text;
          }
        }

        if (imageUrl) {
          return res.json({
            imageUrl,
            text: textOutput,
            model: modelName,
            aspectRatio,
          });
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Attempt with ${modelName} failed:`, err?.message || err);
      }
    }

    const errorMessage = lastError?.message || "Failed to edit image.";
    const isQuotaError =
      errorMessage.includes("quota") ||
      errorMessage.includes("RESOURCE_EXHAUSTED") ||
      errorMessage.includes("429");

    return res.status(isQuotaError ? 429 : 500).json({
      error: errorMessage,
      isQuotaError,
      details: isQuotaError
        ? "Gemini Image models require a paid API key with billing enabled. Please select or configure a project with billing in AI Studio."
        : errorMessage,
    });
  } catch (error: any) {
    console.error("Error in /api/edit-image:", error);
    return res.status(500).json({
      error: error?.message || "Internal server error",
    });
  }
});

// Vite Middleware & Static Serving Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
