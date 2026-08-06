import StatusPill from "./StatusPill";
import FloatingBadge from "./FloatingBadge";
import CountUp from "./CountUp";

const QUEUE = [
  { name: "SLEEPWELL_DIWALI", status: "qa", label: "QA pending" },
  { name: "NOVA_FITNESS_Q4", status: "live", label: "Live" },
  { name: "URBANCART_SALE", status: "draft", label: "Draft" },
];

export default function ProductPreviewCard() {
  return (
    <div className="relative">
      <div className="glow-card bg-ink rounded-2xl p-6 w-full max-w-md mx-auto">
        <div className="font-mono text-xs text-white/40 mb-4 tracking-wider">
          CAMPAIGN QUEUE
        </div>

        <div className="space-y-3">
          {QUEUE.map((item, i) => (
            <div
              key={item.name}
              className="queue-row flex items-center justify-between bg-white/5 rounded-lg px-4 py-3 transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5 cursor-default"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <span className="font-mono text-xs text-white/70">{item.name}</span>
              <StatusPill status={item.status} label={item.label} />
            </div>
          ))}
        </div>
      </div>

      <FloatingBadge
        label="QA pass rate"
        value={<CountUp end={98} suffix="%" />}
        className="-top-6 -left-6 hidden md:block transition-transform duration-300 hover:-translate-y-1"
      />
      <FloatingBadge
        label="Avg SLA response"
        value={<CountUp end={3.2} decimals={1} suffix="h" />}
        className="-bottom-6 -right-6 hidden md:block transition-transform duration-300 hover:-translate-y-1"
      />
    </div>
  );
}