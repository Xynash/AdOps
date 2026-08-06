import CountUp from "./CountUp";

export default function StatBlock({ value, prefix = "", suffix = "", label }) {
  return (
    <div className="border-l-2 border-ink/10 pl-5 transition-colors duration-300 hover:border-signal-green">
      <div className="font-display text-3xl md:text-4xl font-semibold text-ink mb-2">
        {prefix}
        <CountUp end={value} />
        {suffix}
      </div>
      <p className="text-slate text-sm max-w-[220px]">{label}</p>
    </div>
  );
}