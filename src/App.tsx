import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { CreatePanel } from "./components/CreatePanel";
import { EditPanel } from "./components/EditPanel";
import { ImageViewer } from "./components/ImageViewer";
import { HistoryGallery } from "./components/HistoryGallery";
import { QuotaNotice } from "./components/QuotaNotice";
import { ZoomModal } from "./components/ZoomModal";
import { GeneratedImage, AspectRatio, ImageSize } from "./types";
import { Sparkles, Wand2, AlertTriangle } from "lucide-react";

const STORAGE_KEY = "gemini_image_studio_history";

export default function App() {
  const [activeTab, setActiveTab] = useState<"create" | "edit">("create");
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [activeImage, setActiveImage] = useState<GeneratedImage | null>(null);
  const [selectedImageForEdit, setSelectedImageForEdit] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuotaError, setIsQuotaError] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          setActiveImage(parsed[0]);
        }
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (items: GeneratedImage[]) => {
    setHistory(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  };

  // Generate Image
  const handleGenerate = async ({
    prompt,
    aspectRatio,
    imageSize,
  }: {
    prompt: string;
    aspectRatio: AspectRatio;
    imageSize: ImageSize;
  }) => {
    setIsLoading(true);
    setError(null);
    setIsQuotaError(false);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aspectRatio, imageSize }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.isQuotaError || res.status === 429) {
          setIsQuotaError(true);
          setError(
            data.details ||
              "Gemini 3.1 Flash Image model requires a paid API key with billing enabled on Google AI Studio."
          );
        } else {
          setError(data.error || "Failed to generate image.");
        }
        return;
      }

      const newImage: GeneratedImage = {
        id: `gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        imageUrl: data.imageUrl,
        prompt,
        type: "create",
        timestamp: Date.now(),
        aspectRatio,
        imageSize,
        model: data.model || "gemini-3.1-flash-image",
      };

      const updated = [newImage, ...history];
      saveHistory(updated);
      setActiveImage(newImage);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred while generating image.");
    } finally {
      setIsLoading(false);
    }
  };

  // Edit Image
  const handleEdit = async ({
    prompt,
    image,
    aspectRatio,
  }: {
    prompt: string;
    image: string;
    aspectRatio: AspectRatio;
  }) => {
    setIsLoading(true);
    setError(null);
    setIsQuotaError(false);

    try {
      const res = await fetch("/api/edit-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, image, aspectRatio }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.isQuotaError || res.status === 429) {
          setIsQuotaError(true);
          setError(
            data.details ||
              "Gemini 3.1 Flash Image model requires a paid API key with billing enabled on Google AI Studio."
          );
        } else {
          setError(data.error || "Failed to edit image.");
        }
        return;
      }

      const newImage: GeneratedImage = {
        id: `edit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        imageUrl: data.imageUrl,
        prompt,
        type: "edit",
        timestamp: Date.now(),
        aspectRatio,
        parentImage: image,
        model: data.model || "gemini-3.1-flash-image",
      };

      const updated = [newImage, ...history];
      saveHistory(updated);
      setActiveImage(newImage);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred while editing image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseForEdit = (imageUrl: string) => {
    setSelectedImageForEdit(imageUrl);
    setActiveTab("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
    if (activeImage?.id === id) {
      setActiveImage(updated[0] || null);
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      saveHistory([]);
      setActiveImage(null);
      setSelectedImageForEdit(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans antialiased selection:bg-amber-200 selection:text-stone-900">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasSelectedImageForEdit={Boolean(selectedImageForEdit)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Error notification banner */}
        {error && (
          <div className="space-y-4">
            {isQuotaError ? (
              <QuotaNotice
                customMessage={error}
                onDismiss={() => {
                  setError(null);
                  setIsQuotaError(false);
                }}
              />
            ) : (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-900">Operation Error</h4>
                  <p className="text-xs text-red-700 mt-0.5">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-xs text-red-700 hover:text-red-900 font-medium"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        )}

        {/* Main Work Area: Left Controls & Right Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-6">
            {activeTab === "create" ? (
              <div>
                <div className="mb-4">
                  <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Text-to-Image Generation
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Generate visual scenes from descriptive prompts with Gemini 3.1 Flash Image.
                  </p>
                </div>
                <CreatePanel onGenerate={handleGenerate} isLoading={isLoading} />
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-indigo-600" />
                    Image-to-Image Editing
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Upload an image and use natural language instructions to transform it.
                  </p>
                </div>
                <EditPanel
                  selectedImage={selectedImageForEdit}
                  onSelectImage={setSelectedImageForEdit}
                  onEdit={handleEdit}
                  isLoading={isLoading}
                  history={history}
                />
              </div>
            )}
          </div>

          {/* Result / Output Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="text-base font-semibold text-stone-900 mb-4">
                Canvas Preview
              </h2>

              {activeImage ? (
                <ImageViewer
                  image={activeImage}
                  onUseForEdit={handleUseForEdit}
                  onOpenZoom={(url) => setZoomImageUrl(url)}
                />
              ) : (
                <div className="bg-white rounded-2xl border border-stone-200/80 p-10 text-center shadow-xs min-h-[380px] flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                    <Sparkles className="w-7 h-7 text-amber-500/60" />
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    Ready to Generate
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
                    Enter a prompt or select an image to edit on the left to see the result here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gallery / History Section */}
        <section className="pt-4">
          <HistoryGallery
            images={history}
            selectedId={activeImage?.id || null}
            onSelect={(img) => {
              setActiveImage(img);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onDelete={handleDeleteHistoryItem}
            onClearAll={handleClearAllHistory}
          />
        </section>
      </main>

      {/* Fullscreen Zoom Modal */}
      <ZoomModal imageUrl={zoomImageUrl} onClose={() => setZoomImageUrl(null)} />
    </div>
  );
}
