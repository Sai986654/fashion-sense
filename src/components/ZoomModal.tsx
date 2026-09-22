import { X, Download } from "lucide-react";

interface ZoomModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export function ZoomModal({ imageUrl, onClose }: ZoomModalProps) {
  if (!imageUrl) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `gemini-image-zoom-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
      >
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <button
            type="button"
            onClick={handleDownload}
            className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-900 text-white backdrop-blur-xs transition-colors shadow-md"
            title="Download image"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-900 text-white backdrop-blur-xs transition-colors shadow-md"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <img
          src={imageUrl}
          alt="Enlarged view"
          referrerPolicy="no-referrer"
          className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
        />
      </div>
    </div>
  );
}
