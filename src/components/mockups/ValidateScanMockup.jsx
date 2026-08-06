import { useState, useEffect } from "react";

const ITEMS = ["destination_url", "utm_params", "creative_spec", "tag_syntax"];

export default function ValidateScanMockup() {
  const [checked, setChecked] = useState([]);
  const [scanIndex, setScanIndex] = useState(0);

  useEffect(() => {
    if (scanIndex >= ITEMS.length) {
      const resetTimer = setTimeout(() => {
        setChecked([]);
        setScanIndex(0);
      }, 1500);
      return () => clearTimeout(resetTimer);
    }
    const delay = 350 + Math.round(Math.random() * 300);
    const timer = setTimeout(() => {
      setChecked((prev) => [...prev, scanIndex]);
      setScanIndex((i) => i + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [scanIndex]);

  return (
    <div className="font-mono text-[11px] space-y-1.5">
      {ITEMS.map((item, i) => {
        const isDone = checked.includes(i);
        const isScanning = i === scanIndex;
        return (
          <div
            key={item}
            className={
              "flex items-center justify-between rounded px-2.5 py-1.5 transition-colors duration-300 " +
              (isScanning ? "bg-campaign-blue/20" : "bg-white/5")
            }
          >
            <span className="text-white/50">{item}</span>
            {isDone ? (
              <span className="text-campaign-blue">verified</span>
            ) : isScanning ? (
              <span className="text-white/40 animate-pulse">scanning</span>
            ) : (
              <span className="text-white/15">pending</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
