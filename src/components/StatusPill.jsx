const statusStyles = {
  draft: "bg-white/10 text-white/60",
  qa: "bg-[#412402] text-[#FAC775]",
  live: "bg-[#173404] text-[#97C459]",
};

const dotStyles = {
  draft: "bg-white/40",
  qa: "bg-[#FAC775]",
  live: "bg-[#97C459]",
};

export default function StatusPill({ status, label }) {
  const isPulsing = status === "live" || status === "qa";

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs transition-transform duration-200 hover:scale-105 ${statusStyles[status]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dotStyles[status]} ${isPulsing ? "pulse-dot" : ""}`}
      />
      {label}
    </div>
  );
}