import { GoogleGenAI, Type } from "@google/genai";
import { CampaignAsset } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateCampaignContent = async (userPrompt: string): Promise<CampaignAsset> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a comprehensive email marketing campaign based on the following request: "${userPrompt}". 
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

  try {
    return JSON.parse(response.text.trim()) as CampaignAsset;
  } catch (e) {
    console.error("Failed to parse campaign JSON:", e);
    throw new Error("Invalid response format from AI");
  }
};

export const generateCampaignVisual = async (imagePrompt: string): Promise<string> => {
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

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("No image was generated");
};
