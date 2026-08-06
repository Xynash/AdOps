import { Check } from "lucide-react";
import Button from "./Button";

const borderMap = {
  "campaign-mint": "border-ink/10",
  "campaign-blue": "border-campaign-blue",
  "campaign-pink": "border-ink/10",
};

const checkColorMap = {
  "campaign-mint": "text-campaign-mint",
  "campaign-blue": "text-campaign-blue",
  "campaign-pink": "text-campaign-pink",
};

const badgeColorMap = {
  "campaign-blue": "bg-campaign-blue text-ink",
};

export default function PricingCard({ tier, annual }) {
  const price = annual ? tier.annualPrice : tier.monthlyPrice;
  const isCustom = price === null;

  return (
    <div
      className={
        "relative flex flex-col rounded-2xl p-8 border-2 transition-all duration-300 hover:-translate-y-2 " +
        borderMap[tier.color] +
        (tier.featured ? " bg-ink shadow-2xl" : " bg-paper")
      }
    >
      {tier.badge && (
        <div className={"absolute -top-3 left-8 text-[11px] font-medium px-3 py-1 rounded-full " + badgeColorMap[tier.color]}>
          {tier.badge}
        </div>
      )}

      <h3 className={"font-display text-xl font-semibold mb-2 " + (tier.featured ? "text-paper" : "text-ink")}>
        {tier.name}
      </h3>
      <p className={"text-sm mb-6 min-h-[40px] " + (tier.featured ? "text-white/50" : "text-slate")}>
        {tier.tagline}
      </p>

      <div className="mb-8">
        {isCustom ? (
          <div className={"font-display text-3xl font-semibold " + (tier.featured ? "text-paper" : "text-ink")}>
            Custom
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className={"font-display text-4xl font-semibold " + (tier.featured ? "text-paper" : "text-ink")}>
              ${price}
            </span>
            <span className={tier.featured ? "text-white/40 text-sm" : "text-slate text-sm"}>/ month</span>
          </div>
        )}
      </div>

      <div className="mb-8">
        <Button variant={tier.ctaVariant}>{tier.cta}</Button>
      </div>

      <div className="space-y-3 flex-1">
        {tier.features.map((feature) => (
          <div key={feature} className="flex items-start gap-2.5">
            <Check size={16} className={checkColorMap[tier.color] + " shrink-0 mt-0.5"} />
            <span className={"text-sm " + (tier.featured ? "text-white/70" : "text-slate")}>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
