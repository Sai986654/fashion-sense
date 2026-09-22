import { AlertCircle, ExternalLink, KeyRound } from "lucide-react";

interface QuotaNoticeProps {
  onDismiss?: () => void;
  onOpenPaidFlow?: () => void;
  customMessage?: string;
}

export function QuotaNotice({
  onDismiss,
  onOpenPaidFlow,
  customMessage,
}: QuotaNoticeProps) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-4 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="p-1 rounded-lg bg-amber-100 text-amber-700 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-semibold text-amber-900">
            Paid API Key Required for Gemini Image Generation
          </h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            {customMessage ||
              "The gemini-3.1-flash-image model requires a Google AI Studio project with Pay-as-you-go billing enabled. Free-tier quota for image generation is restricted to 0 requests."}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {onOpenPaidFlow && (
              <button
                type="button"
                onClick={onOpenPaidFlow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-700 text-white hover:bg-amber-800 transition-colors shadow-xs"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Select Paid Key
              </button>
            )}
            <a
              href="https://ai.google.dev/gemini-api/docs/billing"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-amber-900 hover:underline"
            >
              <span>Gemini Billing Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="text-xs text-amber-800 hover:text-amber-950 font-medium ml-auto"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
