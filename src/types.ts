export interface CampaignAsset {
  subjectLines: string[];
  bodyCopy: string;
  imagePrompt: string;
  targetAudience: string;
  tone: string;
  callToAction: string;
}

export interface GeneratedCampaign extends CampaignAsset {
  id: string;
  createdAt: number;
  imageUrl?: string;
}
