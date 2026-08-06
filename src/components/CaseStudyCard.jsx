import { ArrowRight } from "lucide-react";

const bandMap = {
  "campaign-blue": "bg-campaign-blue",
  "campaign-mint": "bg-campaign-mint",
  "campaign-pink": "bg-campaign-pink",
  "campaign-yellow": "bg-campaign-yellow",
  "campaign-red": "bg-campaign-red",
};

const textMap = {
  "campaign-blue": "text-campaign-blue",
  "campaign-mint": "text-campaign-mint",
  "campaign-pink": "text-campaign-pink",
  "campaign-yellow": "text-[#a37a15]",
  "campaign-red": "text-campaign-red",
};

export default function CaseStudyCard({ study }) {
  return (
    <div className="shrink-0 w-[300px] md:w-[340px] bg-ink rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
      <div className={"h-2 w-full " + bandMap[study.color]} />

      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div
            className={
              "w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-ink " +
              bandMap[study.color]
            }
          >
            {study.company.charAt(0)}
          </div>
          <div>
            <div className="font-display font-semibold text-paper text-sm">{study.company}</div>
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">{study.industry}</div>
          </div>
        </div>

        <p className="text-white/70 text-sm leading-relaxed mb-8 min-h-[64px]">{study.headline}</p>

        <div className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3">
          <div className="text-center flex-1">
            <div className="text-white/40 text-xs mb-1">Before</div>
            <div className="text-white/60 font-mono text-sm">{study.before}</div>
          </div>
          <ArrowRight size={16} className={textMap[study.color]} />
          <div className="text-center flex-1">
            <div className="text-white/40 text-xs mb-1">After</div>
            <div className={"font-mono text-sm font-semibold " + textMap[study.color]}>{study.after}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
