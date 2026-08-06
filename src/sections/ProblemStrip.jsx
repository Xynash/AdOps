import { AlertTriangle, MessageCircleWarning, GitBranch } from "lucide-react";
import { PROBLEMS } from "../lib/problems";
import SpreadsheetMockup from "../components/mockups/SpreadsheetMockup";
import ChatMockup from "../components/mockups/ChatMockup";
import EscalationMockup from "../components/mockups/EscalationMockup";
import WindowChrome from "../components/mockups/WindowChrome";

const ICONS = [AlertTriangle, MessageCircleWarning, GitBranch];

const MOCKUPS = {
  spreadsheet: SpreadsheetMockup,
  chat: ChatMockup,
  escalation: EscalationMockup,
};

const bgMap = {
  "campaign-blue": "bg-campaign-blue/10 hover:border-campaign-blue/40",
  "campaign-pink": "bg-campaign-pink/10 hover:border-campaign-pink/40",
  "campaign-yellow": "bg-campaign-yellow/10 hover:border-campaign-yellow/40",
};

const textMap = {
  "campaign-blue": "text-campaign-blue",
  "campaign-pink": "text-campaign-pink",
  "campaign-yellow": "text-[#d1a233]",
};

const iconBgMap = {
  "campaign-blue": "bg-campaign-blue",
  "campaign-pink": "bg-campaign-pink",
  "campaign-yellow": "bg-campaign-yellow",
};

export default function ProblemStrip() {
  return (
    <section className="bg-ink px-6 md:px-10 py-24">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs text-white/40 tracking-wider mb-3">
          THE PROBLEM
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-paper mb-16 max-w-xl">
          Ad ops runs on tools that were never built for it
        </h2>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PROBLEMS.map((problem, i) => {
            const Icon = ICONS[i];
            const Mockup = MOCKUPS[problem.mockup];
            return (
              <div
                key={problem.title}
                className={`flex flex-col rounded-2xl p-6 border border-white/5 transition-all duration-300 hover:-translate-y-1.5 ${bgMap[problem.color]}`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-6 ${iconBgMap[problem.color]}`}
                >
                  <Icon size={20} className="text-ink" />
                </div>
                <h3 className={`font-display text-lg font-semibold mb-2 min-h-[3.5rem] ${textMap[problem.color]}`}>
                  {problem.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  {problem.description}
                </p>
                <div className="mt-auto">
                  <WindowChrome title={problem.windowTitle}>
                    <Mockup />
                  </WindowChrome>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}