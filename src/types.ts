export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
export type ImageSize = "512px" | "1K" | "2K";

export interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  type: "create" | "edit";
  timestamp: number;
  aspectRatio: AspectRatio;
  imageSize?: ImageSize;
  parentImage?: string; // original image URL if this was edited
  parentPrompt?: string;
  model?: string;
  notes?: string;
}

export interface GenerationParams {
  prompt: string;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
}

export interface EditParams {
  prompt: string;
  image: string; // base64
  aspectRatio?: AspectRatio;
  mimeType?: string;
}
