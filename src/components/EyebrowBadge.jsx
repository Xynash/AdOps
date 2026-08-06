export default function EyebrowBadge({ label }) {
  return (
    <div className="inline-flex items-center gap-2 border border-ink/20 px-3 py-1.5 rounded-md font-mono text-xs tracking-wider text-ink/70 uppercase">
      <span className="w-1.5 h-1.5 bg-ink/60 inline-block" />
      {label}
    </div>
  );
}