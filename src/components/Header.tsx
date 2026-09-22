import { Sparkles, Wand2, ImageIcon } from "lucide-react";

interface HeaderProps {
  activeTab: "create" | "edit";
  onTabChange: (tab: "create" | "edit") => void;
  hasSelectedImageForEdit: boolean;
}

export function Header({
  activeTab,
  onTabChange,
  hasSelectedImageForEdit,
}: HeaderProps) {
  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-stone-900 to-stone-700 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-stone-900 flex items-center gap-2">
              Create & Edit Images
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                gemini-3.1-flash-image
              </span>
            </h1>
            <p className="text-xs text-stone-500 hidden sm:block">
              AI-driven synthesis and conversational image editing
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200/80">
          <button
            type="button"
            onClick={() => onTabChange("create")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              activeTab === "create"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Create New</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("edit")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all relative ${
              activeTab === "edit"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Wand2 className="w-4 h-4 text-indigo-600" />
            <span>Edit Image</span>
            {hasSelectedImageForEdit && (
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
