import { CampaignAsset } from "../types";

export const generateCampaignContent = async (userPrompt: string): Promise<CampaignAsset> => {
  const response = await fetch("/api/campaign/content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt: userPrompt })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to generate campaign content from server");
  }

  return response.json();
};

export const generateCampaignVisual = async (imagePrompt: string): Promise<string> => {
  const response = await fetch("/api/campaign/visual", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ imagePrompt })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to generate campaign visual from server");
  }

  const data = await response.json();
  return data.imageUrl;
};

