export default function EscalationMockup() {
  const nodes = ["Reported", "???", "???", "Fixed?"];

  return (
    <div className="bg-black/30 rounded-lg p-3 flex items-center justify-between font-mono text-[10px]">
      {nodes.map((node, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`px-2 py-1 rounded ${
              node === "???"
                ? "bg-campaign-yellow/10 text-campaign-yellow border border-dashed border-campaign-yellow/40"
                : "bg-white/10 text-white/60"
            }`}
          >
            {node}
          </div>
          {i < nodes.length - 1 && <span className="text-white/20 mx-1">→</span>}
        </div>
      ))}
    </div>
  );
}