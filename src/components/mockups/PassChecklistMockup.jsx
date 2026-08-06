import { useState, useEffect } from "react";

const CHECKS = ["Banner_01.jpg", "landing_url", "utm_source", "tag_snippet"];

export default function PassChecklistMockup() {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (revealed >= CHECKS.length) {
      const resetTimer = setTimeout(() => setRevealed(0), 1800);
      return () => clearTimeout(resetTimer);
    }
    const timer = setTimeout(() => setRevealed((r) => r + 1), 500);
    return () => clearTimeout(timer);
  }, [revealed]);

  return (
    <div className="font-mono text-[11px] space-y-1.5">
      {CHECKS.map((row, i) => {
        const isDone = i < revealed;
        const isChecking = i === revealed;
        return (
          <div key={row} className="flex items-center justify-between bg-white/5 rounded px-2.5 py-1.5">
            <span className="text-white/50">{row}</span>
            {isDone ? (
              <span className="text-campaign-mint">check</span>
            ) : isChecking ? (
              <span className="text-campaign-yellow animate-pulse">checking...</span>
            ) : (
              <span className="text-white/20">queued</span>
            )}
          </div>
        );
      })}
    </div>
  );
}