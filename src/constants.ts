import { AspectRatio, ImageSize } from "./types";

export const ASPECT_RATIOS: { value: AspectRatio; label: string; desc: string; iconClass: string }[] = [
  { value: "1:1", label: "1:1", desc: "Square", iconClass: "w-6 h-6 border-2 border-current rounded-sm" },
  { value: "16:9", label: "16:9", desc: "Landscape", iconClass: "w-8 h-4.5 border-2 border-current rounded-sm" },
  { value: "9:16", label: "9:16", desc: "Story / Portrait", iconClass: "w-4.5 h-8 border-2 border-current rounded-sm" },
  { value: "4:3", label: "4:3", desc: "Standard", iconClass: "w-7 h-5.5 border-2 border-current rounded-sm" },
  { value: "3:4", label: "3:4", desc: "Vertical", iconClass: "w-5.5 h-7 border-2 border-current rounded-sm" },
];

export const IMAGE_SIZES: { value: ImageSize; label: string; desc: string }[] = [
  { value: "1K", label: "1K (Standard)", desc: "1024×1024 balanced speed" },
  { value: "2K", label: "2K (Ultra HD)", desc: "2048×2048 crisp detail" },
  { value: "512px", label: "512px (Fast)", desc: "Fastest generation" },
];

export const STYLE_TAGS = [
  "Photorealistic",
  "Digital Painting",
  "Cinematic 35mm",
  "3D Isometric",
  "Studio Lighting",
  "Watercolor Wash",
  "Cyberpunk Neon",
  "Minimalist Vector",
  "Vintage 1970s",
  "Anime Aesthetic",
];

export const EXAMPLE_PROMPTS = [
  "A majestic snow leopard resting on a Himalayan cliff at sunset, cinematic lighting, 8k resolution",
  "A serene Japanese tea house surrounded by blossoming cherry trees with a koi pond reflection",
  "Futuristic glass greenhouse on Mars with neon-lit hydroponic plants and starry sky",
  "Minimalist ceramic coffee mug on a slate coaster beside eucalyptus leaves, soft morning light",
  "Whimsical treehouse library nestled inside an ancient glowing oak tree, cozy interior glow",
];

export const EDIT_PRESETS = [
  { label: "Golden Hour", prompt: "Transform lighting to a warm, glowing golden hour sunset with long soft shadows." },
  { label: "Cyberpunk Neon", prompt: "Add vibrant cyan and magenta cyberpunk neon lighting and reflective wet surfaces." },
  { label: "Winter Snow", prompt: "Add a gentle blanket of fresh winter snow and frost to the scene." },
  { label: "Watercolor Style", prompt: "Re-render this in an elegant, soft watercolor painting style with paper texture." },
  { label: "Studio Portrait", prompt: "Apply dramatic studio portrait lighting with a clean, softly blurred background." },
  { label: "Vintage Film", prompt: "Give it 1970s vintage film grain, nostalgic color toning, and warm tones." },
];
