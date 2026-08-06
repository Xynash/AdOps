export default function SpreadsheetMockup() {
  const rows = [
    { label: "Banner_01.jpg", status: "ok" },
    { label: "landing_url", status: "fail" },
    { label: "utm_source", status: "ok" },
    { label: "tag_snippet", status: "fail" },
  ];

  return (
    <div className="bg-black/30 rounded-lg p-3 font-mono text-[11px] space-y-1">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between bg-white/5 rounded px-2 py-1.5"
        >
          <span className="text-white/50">{row.label}</span>
          <span className={row.status === "ok" ? "text-campaign-mint" : "text-campaign-red"}>
            {row.status === "ok" ? "✓" : "✕"}
          </span>
        </div>
      ))}
    </div>
  );
}