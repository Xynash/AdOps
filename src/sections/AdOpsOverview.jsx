import { LayoutGrid, Share2, Video, Search, Newspaper, Cpu } from "lucide-react";
import { AD_OPS_STATS, AD_TYPES } from "../lib/adOpsData";
import StatBlock from "../components/StatBlock";
import PipelineDiagram from "../components/PipelineDiagram";
import EyebrowBadge from "../components/EyebrowBadge";
import CyclingWord from "../components/CyclingWord";
import useInView from "../lib/useInView";

const ICON_MAP = { LayoutGrid, Share2, Video, Search, Newspaper, Cpu };

const bgMap = {
  "campaign-blue": "bg-campaign-blue",
  "campaign-pink": "bg-campaign-pink",
  "campaign-red": "bg-campaign-red",
  "campaign-yellow": "bg-campaign-yellow",
  "campaign-mint": "bg-campaign-mint",
};

const CYCLE_WORDS = ["operations layer", "QA checkpoint", "trafficking desk", "SLA engine", "control tower"];

export default function AdOpsOverview() {
  const [introRef, introInView] = useInView(0.3);

  return (
    <section id="product" className="bg-paper px-6 md:px-10 py-24 border-t border-ink/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 divide-x divide-ink/10 border-y border-ink/10 mb-20 py-8">
          {AD_OPS_STATS.map((stat) => (
            <div key={stat.label} className="px-6 first:pl-0">
              <StatBlock {...stat} />
            </div>
          ))}
        </div>

        <div
          ref={introRef}
          className={"max-w-2xl mx-auto mb-16 text-center " + (introInView ? "fade-up-visible" : "fade-up-hidden")}
        >
          <div className="flex justify-center mb-5">
            <EyebrowBadge label="What is ad ops" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-6 leading-tight">
            The <CyclingWord words={CYCLE_WORDS} /> behind every ad
            campaign you see online
          </h2>
          <p className="text-slate text-base leading-relaxed">
            Ad operations teams sit between media planning and the live campaign,
            trafficking creatives into ad servers, validating every link and tracking
            tag, and responding when something breaks. Every brand running digital
            ads relies on this function to keep campaigns accurate and on schedule.
          </p>
        </div>

        <div className="mb-24 py-4">
          <PipelineDiagram />
        </div>

        <p className="font-mono text-xs text-slate tracking-wider mb-6">
          AD FORMATS AD OPS TEAMS VALIDATE
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[140px]">
          {AD_TYPES.map((type, i) => {
            const Icon = ICON_MAP[type.icon];
            const isFeatured = i === 0;
            return (
              <div
                key={type.name}
                className={
                  "flex flex-col justify-between p-5 rounded-xl border border-ink/10 transition-all duration-300 hover:-translate-y-1 hover:border-ink/30 " +
                  (isFeatured ? "col-span-2 row-span-1" : "")
                }
              >
                <div className={"w-9 h-9 rounded-lg flex items-center justify-center " + bgMap[type.color]}>
                  <Icon size={16} className="text-ink" />
                </div>
                <div>
                  <div className="font-display font-semibold text-sm mb-1">{type.name}</div>
                  <p className="text-slate text-xs leading-snug">{type.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
