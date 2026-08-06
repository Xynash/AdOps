import { User, Users, ArrowLeft } from "lucide-react";
import { COMPANY_NAME } from "../lib/constants";

const OPTIONS = [
  {
    key: "individual",
    icon: User,
    title: "Just me",
    description: "Solo ops managers and freelancers running campaigns without a team behind them.",
    points: ["Save reusable templates", "No approval chain", "Personal campaign history"],
    color: "campaign-blue",
  },
  {
    key: "team",
    icon: Users,
    title: "My whole desk",
    description: "Teams and agencies coordinating QA, tickets, and escalations across multiple people.",
    points: ["Shared campaign queue", "SLA tickets across the desk", "Escalation routing between teams"],
    color: "campaign-mint",
  },
];

const bgTint = {
  "campaign-blue": "hover:bg-campaign-blue/5 hover:border-campaign-blue/40",
  "campaign-mint": "hover:bg-campaign-mint/5 hover:border-campaign-mint/40",
};

const iconBg = {
  "campaign-blue": "bg-campaign-blue/15 text-campaign-blue",
  "campaign-mint": "bg-campaign-mint/15 text-campaign-mint",
};

export default function PersonaSelect({ onSelect, onBack }) {
  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col">
      <div className="px-6 md:px-10 py-6 flex items-center justify-between">
        <span className="font-display font-semibold text-lg">{COMPANY_NAME}</span>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} />
          Back to site
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-center mb-3">
          Who's running this demo?
        </h1>
        <p className="text-white/50 text-sm md:text-base text-center mb-12 max-w-md">
          We'll shape the campaign queue around how you actually work.
        </p>

        <div className="grid md:grid-cols-2 gap-5 max-w-3xl w-full">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.key}
                onClick={() => onSelect(opt.key)}
                className={
                  "text-left border border-white/10 rounded-2xl p-8 transition-all duration-200 " +
                  bgTint[opt.color]
                }
              >
                <div className={"w-11 h-11 rounded-xl flex items-center justify-center mb-5 " + iconBg[opt.color]}>
                  <Icon size={20} />
                </div>
                <h2 className="font-display text-xl font-semibold mb-2">{opt.title}</h2>
                <p className="text-white/50 text-sm leading-relaxed mb-5">{opt.description}</p>
                <div className="space-y-2">
                  {opt.points.map((point) => (
                    <div key={point} className="text-white/70 text-xs flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                      {point}
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
