import { useState, useRef } from "react";
import { Wand2, Upload, X, RefreshCw, Sparkles, Layers } from "lucide-react";
import { AspectRatio, GeneratedImage } from "../types";
import { ASPECT_RATIOS, EDIT_PRESETS } from "../constants";

interface EditPanelProps {
  selectedImage: string | null;
  onSelectImage: (imgUrl: string | null) => void;
  onEdit: (params: { prompt: string; image: string; aspectRatio: AspectRatio }) => Promise<void>;
  isLoading: boolean;
  history: GeneratedImage[];
}

export function EditPanel({
  selectedImage,
  onSelectImage,
  onEdit,
  isLoading,
  history,
}: EditPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onSelectImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onSelectImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = (presetPrompt: string) => {
    setPrompt(presetPrompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage || !prompt.trim() || isLoading) return;

    onEdit({
      prompt: prompt.trim(),
      image: selectedImage,
      aspectRatio,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Target Image to Edit */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-stone-900 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-indigo-600" />
            Source Image to Edit
          </label>
          {selectedImage && (
            <button
              type="button"
              onClick={() => onSelectImage(null)}
              disabled={isLoading}
              className="text-xs text-stone-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Remove image
            </button>
          )}
        </div>

        {selectedImage ? (
          <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100 flex items-center justify-center max-h-72 p-2">
            <img
              src={selectedImage}
              alt="Source to edit"
              referrerPolicy="no-referrer"
              className="max-h-64 max-w-full rounded-lg object-contain shadow-xs"
            />
            <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md font-medium">
              Ready for editing
            </div>
          </div>
        ) : (
          <div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-200 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-50 rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-900">
                  Drop an image here, or{" "}
                  <span className="text-indigo-600 hover:underline">browse</span>
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Supports PNG, JPEG, WebP up to 20MB
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Quick Pick from History */}
            {history.length > 0 && (
              <div className="mt-4 pt-4 border-t border-stone-100">
                <span className="text-xs font-medium text-stone-500 block mb-2">
                  Or pick a recently generated image:
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {history.slice(0, 6).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectImage(item.imageUrl)}
                      className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-stone-200 hover:border-indigo-500 transition-all hover:scale-105"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.prompt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Instructions Prompt */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
        <label htmlFor="edit-prompt" className="text-sm font-semibold text-stone-900 block mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Edit Instructions
        </label>
        <textarea
          id="edit-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe how to transform this image (e.g., 'Change the background to a tropical beach at sunset', 'Add vintage sunglasses and a scarf', 'Turn this into an oil painting')..."
          rows={3}
          disabled={isLoading}
          className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-stone-400 focus:outline-hidden transition-all resize-y min-h-[90px]"
        />

        {/* Quick Edit Presets */}
        <div className="mt-3.5 pt-3 border-t border-stone-100">
          <span className="text-xs font-medium text-stone-500 block mb-2">
            One-Click Transformations:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {EDIT_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleApplyPreset(preset.prompt)}
                disabled={isLoading}
                className="text-xs px-2.5 py-1 rounded-md bg-stone-100 hover:bg-indigo-50 hover:text-indigo-700 text-stone-700 transition-colors whitespace-nowrap"
              >
                ✨ {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Aspect Ratio config */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
        <label className="text-sm font-semibold text-stone-900 block mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-stone-600" />
          Output Aspect Ratio
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
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-xs"
                    : "border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-700"
                }`}
              >
                <div className={`mb-1.5 flex items-center justify-center ${isSelected ? "text-amber-300" : "text-stone-600"}`}>
                  <div className={ratio.iconClass} />
                </div>
                <span className="text-xs font-semibold">{ratio.label}</span>
              </button>
            );
          })}
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
            Clear instruction
          </button>
        )}
        <button
          type="submit"
          disabled={!selectedImage || !prompt.trim() || isLoading}
          className={`ml-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-sm ${
            !selectedImage || !prompt.trim() || isLoading
              ? "bg-stone-200 text-stone-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white active:scale-98"
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Editing with Gemini...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 text-indigo-200" />
              <span>Apply Edit</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
