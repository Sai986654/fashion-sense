import { useState } from "react";
import { Sparkles, Dices, Layers, RefreshCw } from "lucide-react";
import { AspectRatio, ImageSize } from "../types";
import { ASPECT_RATIOS, IMAGE_SIZES, STYLE_TAGS, EXAMPLE_PROMPTS } from "../constants";

interface CreatePanelProps {
  onGenerate: (params: { prompt: string; aspectRatio: AspectRatio; imageSize: ImageSize }) => Promise<void>;
  isLoading: boolean;
}

export function CreatePanel({ onGenerate, isLoading }: CreatePanelProps) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [imageSize, setImageSize] = useState<ImageSize>("1K");

  const handleRandomPrompt = () => {
    const random = EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)];
    setPrompt(random);
  };

  const handleAddStyle = (style: string) => {
    if (!prompt.trim()) {
      setPrompt(`${style} style`);
      return;
    }
    if (!prompt.toLowerCase().includes(style.toLowerCase())) {
      setPrompt((prev) => `${prev.trim()}, ${style.toLowerCase()}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate({
      prompt: prompt.trim(),
      aspectRatio,
      imageSize,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Prompt Card */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <label htmlFor="create-prompt" className="text-sm font-semibold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Prompt Description
          </label>
          <button
            type="button"
            onClick={handleRandomPrompt}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium py-1 px-2.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <Dices className="w-3.5 h-3.5 text-amber-600" />
            Random Idea
          </button>
        </div>

        <textarea
          id="create-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to create in vivid detail (e.g., A futuristic glass conservatory floating above misty clouds at dawn, architectural rendering, warm soft morning light...)"
          rows={4}
          disabled={isLoading}
          className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-stone-400 focus:outline-hidden transition-all resize-y min-h-[110px]"
        />

        {/* Style Tag Presets */}
        <div className="mt-3.5 pt-3 border-t border-stone-100">
          <span className="text-xs font-medium text-stone-500 block mb-2">Add Style Modifiers:</span>
          <div className="flex flex-wrap gap-1.5">
            {STYLE_TAGS.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => handleAddStyle(style)}
                disabled={isLoading}
                className="text-xs px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200/70 text-stone-700 transition-colors whitespace-nowrap"
              >
                + {style}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Aspect Ratio and Resolution Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Aspect Ratio */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
          <label className="text-sm font-semibold text-stone-900 block mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-stone-600" />
            Aspect Ratio
          </label>
          <div className="grid grid-cols-5 gap-2">
            {ASPECT_RATIOS.map((ratio) => {
              const isSelected = aspectRatio === ratio.value;
              return (
                <button
                  key={ratio.value}
                  type="button"
                  onClick={() => setAspectRatio(ratio.value)}
                  disabled={isLoading}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "border-stone-900 bg-stone-900 text-white shadow-xs"
                      : "border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-700"
                  }`}
                >
                  <div className={`mb-1.5 flex items-center justify-center ${isSelected ? "text-amber-300" : "text-stone-600"}`}>
                    <div className={ratio.iconClass} />
                  </div>
                  <span className="text-xs font-semibold">{ratio.label}</span>
                  <span className={`text-[10px] truncate max-w-full ${isSelected ? "text-stone-300" : "text-stone-400"}`}>
                    {ratio.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resolution */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
          <label className="text-sm font-semibold text-stone-900 block mb-3">
            Resolution Quality
          </label>
          <div className="grid grid-cols-3 gap-2">
            {IMAGE_SIZES.map((size) => {
              const isSelected = imageSize === size.value;
              return (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => setImageSize(size.value)}
                  disabled={isLoading}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "border-stone-900 bg-stone-900 text-white shadow-xs"
                      : "border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-700"
                  }`}
                >
                  <span className="text-xs font-semibold">{size.label}</span>
                  <span className={`text-[10px] mt-1 ${isSelected ? "text-stone-300" : "text-stone-400"}`}>
                    {size.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between gap-4">
        {prompt && (
          <button
            type="button"
            onClick={() => setPrompt("")}
            disabled={isLoading}
            className="text-xs text-stone-500 hover:text-stone-800 font-medium px-3 py-2"
          >
            Clear prompt
          </button>
        )}
        <button
          type="submit"
          disabled={!prompt.trim() || isLoading}
          className={`ml-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-sm ${
            !prompt.trim() || isLoading
              ? "bg-stone-200 text-stone-400 cursor-not-allowed"
              : "bg-stone-900 hover:bg-stone-800 text-white active:scale-98"
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
              <span>Generating with Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Create Image</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
