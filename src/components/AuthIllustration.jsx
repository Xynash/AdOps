import { useState, useEffect, useRef } from "react";

export default function AuthIllustration() {
  const [statusIndex, setStatusIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const statuses = ["QA pending", "check", "live"];

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statuses.length);
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  function handleMouseMove(e) {
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 10, y: y * -10 });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  const statusColor =
    statuses[statusIndex] === "live"
      ? "text-campaign-mint"
      : statuses[statusIndex] === "check"
      ? "text-campaign-blue"
      : "text-campaign-yellow";

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full bg-ink flex items-center justify-center overflow-hidden"
    >
      <div className="absolute top-8 left-8 w-16 h-16 rounded-2xl bg-campaign-blue/80 float-slow" />
      <div className="absolute bottom-12 left-16 w-10 h-10 rounded-full bg-campaign-mint/70 float-fast" />
      <div className="absolute top-16 right-10 w-12 h-12 rounded-xl bg-campaign-pink/70 float-medium" />

      <div
        className="relative bg-white/5 border border-white/10 rounded-2xl p-5 w-48 shadow-2xl transition-transform duration-150 ease-out"
        style={{
          transform: "perspective(600px) rotateX(" + tilt.y + "deg) rotateY(" + tilt.x + "deg)",
        }}
      >
        <div className="font-mono text-[10px] text-white/40 mb-3">campaign_queue</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-white/5 rounded px-2 py-1.5">
            <span className="text-[10px] text-white/50">Banner_01</span>
            <span className={"text-[10px] transition-colors duration-300 " + statusColor}>
              {statuses[statusIndex]}
            </span>
          </div>
          <div className="flex items-center justify-between bg-white/5 rounded px-2 py-1.5">
            <span className="text-[10px] text-white/50">Diwali_Sale</span>
            <span className="text-[10px] text-campaign-yellow">live</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 text-center">
        <p className="font-display text-paper text-sm font-medium">Join the desk</p>
        <p className="text-white/40 text-xs mt-1">500+ campaigns validated weekly</p>
      </div>
    </div>
  );
}
