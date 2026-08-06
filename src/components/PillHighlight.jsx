export default function PillHighlight({ children, color = "signal-green" }) {
  const colorMap = {
    "signal-green": "bg-signal-green/15 text-signal-green",
    "campaign-blue": "bg-campaign-blue/15 text-campaign-blue",
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full ${colorMap[color]}`}>
      {children}
    </span>
  );
}