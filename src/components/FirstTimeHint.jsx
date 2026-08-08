import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";

export default function FirstTimeHint({ hintKey, message }) {
  const storageKey = "adsquadops_hint_seen_" + hintKey;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!localStorage.getItem(storageKey));
  }, [storageKey]);

  function dismiss() {
    localStorage.setItem(storageKey, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="flex items-start gap-3 bg-campaign-blue/10 border border-campaign-blue/25 rounded-lg px-4 py-3 mb-6">
      <Sparkles size={15} className="text-campaign-blue shrink-0 mt-0.5" />
      <p className="text-sm text-ink flex-1">{message}</p>
      <button
        onClick={dismiss}
        className="text-ink/40 hover:text-ink transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <X size={15} />
      </button>
    </div>
  );
}
