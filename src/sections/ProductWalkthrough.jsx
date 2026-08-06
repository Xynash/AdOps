import { useState } from "react";
import { Upload, ShieldCheck, Ticket, GitBranch, LayoutDashboard, Plus, Minus } from "lucide-react";
import { SOLUTIONS } from "../lib/solutions";
import WindowChrome from "../components/mockups/WindowChrome";
import TrafficSetupMockup from "../components/mockups/TrafficSetupMockup";
import PassChecklistMockup from "../components/mockups/PassChecklistMockup";
import TicketTimerMockup from "../components/mockups/TicketTimerMockup";
import ResolvedEscalationMockup from "../components/mockups/ResolvedEscalationMockup";
import DashboardMockup from "../components/mockups/DashboardMockup";
import EyebrowBadge from "../components/EyebrowBadge";
import useInView from "../lib/useInView";

const ICON_MAP = { setup: Upload, checklist: ShieldCheck, ticket: Ticket, escalation: GitBranch, dashboard: LayoutDashboard };
const MOCKUP_MAP = { setup: TrafficSetupMockup, checklist: PassChecklistMockup, ticket: TicketTimerMockup, escalation: ResolvedEscalationMockup, dashboard: DashboardMockup };

const dotMap = {
  "campaign-red": "bg-campaign-red",
  "campaign-blue": "bg-campaign-blue",
  "campaign-pink": "bg-campaign-pink",
  "campaign-yellow": "bg-campaign-yellow",
  "campaign-mint": "bg-campaign-mint",
};

const textMap = {
  "campaign-red": "text-campaign-red",
  "campaign-blue": "text-campaign-blue",
  "campaign-pink": "text-campaign-pink",
  "campaign-yellow": "text-[#a37a15]",
  "campaign-mint": "text-campaign-mint",
};

const borderHoverMap = {
  "campaign-red": "hover:border-campaign-red/60",
  "campaign-blue": "hover:border-campaign-blue/60",
  "campaign-pink": "hover:border-campaign-pink/60",
  "campaign-yellow": "hover:border-campaign-yellow/60",
  "campaign-mint": "hover:border-campaign-mint/60",
};

function Station({ sol, index }) {
  const [ref, inView] = useInView(0.35);
  const [expanded, setExpanded] = useState(false);
  const Icon = ICON_MAP[sol.mockup];
  const Mockup = MOCKUP_MAP[sol.mockup];
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={
        "relative grid md:grid-cols-2 gap-8 md:gap-16 items-center transition-all duration-700 " +
        (inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")
      }
    >
      <div
        className={
          "hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full items-center justify-center border-4 border-paper z-10 transition-transform duration-500 " +
          dotMap[sol.color] +
          (inView ? " scale-100" : " scale-0")
        }
      >
        <Icon size={18} className="text-ink" />
      </div>

      <div className={isEven ? "md:order-1 md:text-right" : "md:order-2"}>
        <div className={"font-mono text-xs mb-2 " + textMap[sol.color]}>STEP {sol.step}</div>
        <h3 className="font-display text-2xl font-semibold mb-2">{sol.title}</h3>
        <p className={"text-sm font-medium mb-4 " + textMap[sol.color]}>{sol.tagline}</p>
        <p className="text-slate text-sm leading-relaxed mb-3">{sol.description}</p>

        <button
          onClick={() => setExpanded(!expanded)}
          className={
            "inline-flex items-center gap-1.5 text-xs font-medium " +
            textMap[sol.color] +
            (isEven ? " md:flex-row-reverse" : "")
          }
        >
          {expanded ? <Minus size={14} /> : <Plus size={14} />}
          {expanded ? "Show less" : "How it works"}
        </button>

        <div
          className={
            "overflow-hidden transition-all duration-300 " +
            (expanded ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0")
          }
        >
          <p className="text-slate text-xs leading-relaxed bg-ink/5 rounded-lg p-3">{sol.expanded}</p>
        </div>
      </div>

      <div className={isEven ? "md:order-2" : "md:order-1"}>
        <div className={"rounded-lg transition-all duration-300 border-2 border-transparent " + borderHoverMap[sol.color]}>
          <WindowChrome title={sol.title.toLowerCase().replace(/ /g, "_")}>
            <Mockup />
          </WindowChrome>
        </div>
      </div>
    </div>
  );
}

export default function ProductWalkthrough() {
  return (
    <section className="bg-paper px-6 md:px-10 py-24 border-t border-ink/10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <div className="flex justify-center mb-5">
            <EyebrowBadge label="The solution" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">
            One console, the whole campaign lifecycle
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-ink/10 hidden md:block" />

          <div className="space-y-16 md:space-y-24">
            {SOLUTIONS.map((sol, i) => (
              <Station key={sol.step} sol={sol} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
