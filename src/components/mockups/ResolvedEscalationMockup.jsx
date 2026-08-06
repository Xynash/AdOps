import { useState, useEffect } from "react";

const NODES = ["Reported", "Ad Tech", "Fixed"];

export default function ResolvedEscalationMockup() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage >= NODES.length - 1) {
      const resetTimer = setTimeout(() => setStage(0), 1800);
      return () => clearTimeout(resetTimer);
    }
    const timer = setTimeout(() => setStage((s) => s + 1), 900);
    return () => clearTimeout(timer);
  }, [stage]);

  return (
    <div className="flex items-center justify-between font-mono text-[10px]">
      {NODES.map((node, i) => (
        <div key={i} className="flex items-center">
          <div
            className={
              "px-2 py-1 rounded border transition-all duration-300 " +
              (i <= stage
                ? "bg-campaign-yellow/15 text-campaign-yellow border-campaign-yellow/30"
                : "bg-white/5 text-white/20 border-white/10")
            }
          >
            {node}
          </div>
          {i < NODES.length - 1 && (
            <span className={"mx-1 transition-colors duration-300 " + (i < stage ? "text-campaign-yellow" : "text-white/20")}>
              {"->"}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
