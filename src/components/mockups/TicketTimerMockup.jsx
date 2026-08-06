import { useState, useEffect } from "react";

export default function TicketTimerMockup() {
  const [seconds1, setSeconds1] = useState(72 * 60);
  const [seconds2, setSeconds2] = useState(40 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds1((s) => (s > 0 ? s - 1 : 72 * 60));
      setSeconds2((s) => (s > 0 ? s - 1 : 40 * 60));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function format(s) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return h + "h " + m + "m";
    return m + "m " + sec + "s";
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2.5">
        <span className="font-mono text-[11px] text-white/60">Checkout URL 404</span>
        <span className="font-mono text-[10px] bg-campaign-mint/20 text-campaign-mint px-2 py-0.5 rounded">
          {format(seconds1)} left
        </span>
      </div>
      <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2.5">
        <span className="font-mono text-[11px] text-white/60">Tag mismatch, Q4 push</span>
        <span className="font-mono text-[10px] bg-campaign-yellow/20 text-campaign-yellow px-2 py-0.5 rounded">
          {format(seconds2)} left
        </span>
      </div>
    </div>
  );
}
