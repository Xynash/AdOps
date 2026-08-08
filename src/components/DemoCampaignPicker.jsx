import { Sparkles } from "lucide-react";
import { DEMO_CAMPAIGNS } from "../lib/demoCampaigns";

export default function DemoCampaignPicker({ onLoad, disabled }) {
  return (
    <div className="bg-campaign-blue/5 border border-campaign-blue/20 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={16} className="text-campaign-blue" />
        <h3 className="font-display font-semibold text-sm">New here? Try a demo campaign</h3>
      </div>
      <p className="text-slate text-xs mb-4">
        Don't have a campaign to test? Load one of these sample campaigns to see QA validation in action.
      </p>
      <div className="grid md:grid-cols-3 gap-3">
        {DEMO_CAMPAIGNS.map((demo) => (
          <button
            key={demo.name}
            onClick={() => onLoad(demo)}
            disabled={disabled}
            className="text-left bg-white border border-ink/10 rounded-lg p-3 hover:border-campaign-blue/50 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="font-display font-medium text-sm mb-1">{demo.name}</div>
            <div className="text-slate text-xs truncate">{demo.destination_url}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
