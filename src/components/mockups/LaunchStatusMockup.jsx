import { useState, useEffect } from "react";

export default function LaunchStatusMockup() {
  const [isLive, setIsLive] = useState(false);
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    const cycle = setInterval(() => {
      setIsLive((prev) => {
        const next = !prev;
        if (next) {
          setTimestamp(new Date().toLocaleTimeString());
        }
        return next;
      });
    }, 2200);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="font-mono text-[11px] flex flex-col items-center justify-center py-2">
      <div
        className={
          "w-14 h-7 rounded-full flex items-center px-1 transition-colors duration-300 " +
          (isLive ? "bg-campaign-mint" : "bg-white/10")
        }
      >
        <div
          className={
            "w-5 h-5 rounded-full bg-ink transition-transform duration-300 " +
            (isLive ? "translate-x-7" : "translate-x-0")
          }
        />
      </div>
      <div className="mt-3 text-white/50">
        {isLive ? "LIVE since " + timestamp : "Not live"}
      </div>
    </div>
  );
}
