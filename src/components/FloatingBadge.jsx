export default function FloatingBadge({ label, value, className = "" }) {
  return (
    <div
      className={`absolute bg-paper border border-ink/10 shadow-lg rounded-xl px-4 py-3 ${className}`}
    >
      <div className="font-display text-lg font-semibold text-ink">{value}</div>
      <div className="text-xs text-slate">{label}</div>
    </div>
  );
}