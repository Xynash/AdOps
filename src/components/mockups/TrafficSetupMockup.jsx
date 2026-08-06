import { useState, useEffect } from "react";

const FIELDS = [
  { label: "Creative", value: "Banner_01.jpg" },
  { label: "Destination URL", value: "sleepwell.com/diwali" },
  { label: "Tracking tag", value: "utm_src=dv360" },
];

export default function TrafficSetupMockup() {
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    if (filled >= FIELDS.length) {
      const resetTimer = setTimeout(() => setFilled(0), 1800);
      return () => clearTimeout(resetTimer);
    }
    const timer = setTimeout(() => setFilled((f) => f + 1), 600);
    return () => clearTimeout(timer);
  }, [filled]);

  return (
    <div className="font-mono text-[11px] space-y-2">
      {FIELDS.map((field, i) => {
        const isFilled = i < filled;
        return (
          <div key={field.label} className="bg-white/5 rounded px-2.5 py-2">
            <div className="text-white/30 text-[10px] mb-1">{field.label}</div>
            <div className={isFilled ? "text-campaign-red" : "text-white/15"}>
              {isFilled ? field.value : "..."}
            </div>
          </div>
        );
      })}
    </div>
  );
}
