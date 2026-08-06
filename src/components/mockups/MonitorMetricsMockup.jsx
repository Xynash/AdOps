import { useState, useEffect } from "react";

export default function MonitorMetricsMockup() {
  const [clicks, setClicks] = useState(1204);
  const [ctr, setCtr] = useState(2.8);

  useEffect(() => {
    const interval = setInterval(() => {
      setClicks((c) => c + Math.round(Math.random() * 6));
      setCtr((r) => Math.max(1.5, Math.min(4.5, r + (Math.random() * 0.4 - 0.2))));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-[11px] grid grid-cols-2 gap-3">
      <div className="bg-white/5 rounded px-3 py-2.5">
        <div className="text-white/30 text-[10px] mb-1">Clicks</div>
        <div className="text-[#a37a15] text-base font-semibold">{clicks.toLocaleString()}</div>
      </div>
      <div className="bg-white/5 rounded px-3 py-2.5">
        <div className="text-white/30 text-[10px] mb-1">CTR</div>
        <div className="text-[#a37a15] text-base font-semibold">{ctr.toFixed(1)}%</div>
      </div>
    </div>
  );
}
