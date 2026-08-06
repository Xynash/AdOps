import { useState, useEffect } from "react";

export default function DashboardMockup() {
  const [bars, setBars] = useState([60, 85, 45, 95, 70]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBars((prev) => prev.map((h) => {
        const next = h + (Math.random() * 16 - 8);
        return Math.max(30, Math.min(98, Math.round(next)));
      }));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end gap-2 h-16">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t bg-campaign-mint/60 transition-all duration-700 ease-out"
          style={{ height: h + "%" }}
        />
      ))}
    </div>
  );
}

