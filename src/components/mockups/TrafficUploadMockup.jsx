import { useState, useEffect } from "react";

export default function TrafficUploadMockup() {
  const [progress, setProgress] = useState(0);
  const [fileName] = useState("Banner_Diwali_300x250.jpg");

  useEffect(() => {
    if (progress >= 100) {
      const resetTimer = setTimeout(() => setProgress(0), 1500);
      return () => clearTimeout(resetTimer);
    }
    const step = 6 + Math.round(Math.random() * 10);
    const timer = setTimeout(() => setProgress((p) => Math.min(100, p + step)), 180);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="font-mono text-[11px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/50">{fileName}</span>
        <span className="text-campaign-red">{progress}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-campaign-red transition-all duration-150 ease-out"
          style={{ width: progress + "%" }}
        />
      </div>
      <div className="mt-3 text-white/30 text-[10px]">
        {progress < 100 ? "Uploading to trafficking queue..." : "Ready for QA"}
      </div>
    </div>
  );
}
