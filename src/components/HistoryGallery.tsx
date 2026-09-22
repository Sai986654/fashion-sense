import { Sparkles, Wand2, Trash2, Eye, Clock } from "lucide-react";
import { GeneratedImage } from "../types";

interface HistoryGalleryProps {
  images: GeneratedImage[];
  selectedId: string | null;
  onSelect: (image: GeneratedImage) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function HistoryGallery({
  images,
  selectedId,
  onSelect,
  onDelete,
  onClearAll,
}: HistoryGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200/80 p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-stone-900">No images created yet</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
          Type a prompt or upload a photo to start creating and editing with Gemini 3.1 Flash Image.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div>
          <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
            Gallery History
            <span className="text-xs font-normal text-stone-500">
              ({images.length} {images.length === 1 ? "item" : "items"})
            </span>
          </h3>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-stone-500 hover:text-red-600 font-medium transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {images.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all aspect-square bg-stone-900 ${
                isSelected
                  ? "ring-2 ring-stone-900 border-transparent shadow-md"
                  : "border-stone-200 hover:border-stone-400"
              }`}
            >
              <img
                src={item.imageUrl}
                alt={item.prompt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Tag Badge */}
              <div className="absolute top-1.5 left-1.5 z-10">
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 text-white ${
                    item.type === "edit" ? "bg-indigo-600/90" : "bg-stone-900/90"
                  }`}
                >
                  {item.type === "edit" ? <Wand2 className="w-2.5 h-2.5" /> : <Sparkles className="w-2.5 h-2.5" />}
                  {item.type === "edit" ? "Edit" : "New"}
                </span>
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="p-1 rounded-md bg-stone-900/80 hover:bg-red-600 text-stone-300 hover:text-white transition-colors"
                    title="Delete image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <p className="text-[10px] line-clamp-2 leading-tight text-stone-200 font-sans">
                    {item.prompt}
                  </p>
                  <span className="text-[9px] text-stone-400 flex items-center gap-1 mt-1">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
