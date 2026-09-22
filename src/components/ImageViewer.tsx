import { useState } from "react";
import {
  Download,
  Copy,
  Check,
  Wand2,
  Maximize2,
  Columns,
  Sparkles,
  Info,
  Clock,
  Layers,
} from "lucide-react";
import { GeneratedImage } from "../types";

interface ImageViewerProps {
  image: GeneratedImage;
  onUseForEdit: (imageUrl: string) => void;
  onOpenZoom: (imageUrl: string) => void;
}

export function ImageViewer({
  image,
  onUseForEdit,
  onOpenZoom,
}: ImageViewerProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"result" | "compare">("result");

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(image.imageUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.error("Failed to copy image URL", e);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.imageUrl;
    link.download = `gemini-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formattedDate = new Date(image.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs flex flex-col gap-4">
      {/* Top Bar / Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
              image.type === "edit"
                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            {image.type === "edit" ? (
              <>
                <Wand2 className="w-3 h-3" />
                Edited Image
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                Generated Image
              </>
            )}
          </span>
          <span className="text-xs text-stone-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formattedDate}
          </span>
        </div>

        {/* View mode toggle if parent exists */}
        {image.parentImage && (
          <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
            <button
              type="button"
              onClick={() => setViewMode("result")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === "result"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Result
            </button>
            <button
              type="button"
              onClick={() => setViewMode("compare")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                viewMode === "compare"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Columns className="w-3 h-3" />
              Before & After
            </button>
          </div>
        )}
      </div>

      {/* Visual Display */}
      <div className="relative rounded-xl overflow-hidden bg-stone-950 flex items-center justify-center min-h-[320px] max-h-[540px]">
        {viewMode === "compare" && image.parentImage ? (
          <div className="grid grid-cols-2 w-full h-full gap-1 p-2">
            <div className="relative flex flex-col items-center justify-center bg-stone-900/50 rounded-lg p-2 overflow-hidden">
              <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded font-medium z-10">
                Original
              </span>
              <img
                src={image.parentImage}
                alt="Original"
                referrerPolicy="no-referrer"
                className="max-h-[460px] max-w-full object-contain rounded"
              />
            </div>
            <div className="relative flex flex-col items-center justify-center bg-stone-900/50 rounded-lg p-2 overflow-hidden">
              <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[11px] px-2 py-0.5 rounded font-medium z-10">
                Edited
              </span>
              <img
                src={image.imageUrl}
                alt="Edited"
                referrerPolicy="no-referrer"
                className="max-h-[460px] max-w-full object-contain rounded"
              />
            </div>
          </div>
        ) : (
          <div className="relative group w-full h-full flex items-center justify-center p-3">
            <img
              src={image.imageUrl}
              alt={image.prompt}
              referrerPolicy="no-referrer"
              className="max-h-[500px] max-w-full object-contain rounded-lg shadow-lg"
            />
            <button
              type="button"
              onClick={() => onOpenZoom(image.imageUrl)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-stone-900/70 hover:bg-stone-900 text-white backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100"
              title="View full size"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download PNG
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-800 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Data
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={() => onUseForEdit(image.imageUrl)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors shadow-xs"
        >
          <Wand2 className="w-3.5 h-3.5 text-indigo-200" />
          Edit this Image
        </button>
      </div>

      {/* Prompt & Details Card */}
      <div className="rounded-xl bg-stone-50 p-3.5 border border-stone-100 text-xs space-y-2">
        <div>
          <span className="font-semibold text-stone-900 block mb-1 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-stone-500" />
            Prompt used:
          </span>
          <p className="text-stone-700 leading-relaxed font-sans">{image.prompt}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-2 text-stone-500 border-t border-stone-200/60 text-[11px]">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            Ratio: <strong className="text-stone-700">{image.aspectRatio}</strong>
          </span>
          {image.imageSize && (
            <span>
              Size: <strong className="text-stone-700">{image.imageSize}</strong>
            </span>
          )}
          {image.model && (
            <span>
              Model: <strong className="text-stone-700">{image.model}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
