export default function WindowChrome({ title, children }) {
  return (
    <div className="bg-ink rounded-lg overflow-hidden border border-white/10 shadow-lg">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10 bg-white/5">
        <span className="w-2 h-2 rounded-full bg-campaign-red/70" />
        <span className="w-2 h-2 rounded-full bg-campaign-yellow/70" />
        <span className="w-2 h-2 rounded-full bg-campaign-mint/70" />
        <span className="font-mono text-[10px] text-white/40 ml-2">{title}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}
