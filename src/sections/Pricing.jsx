import { useState } from "react";
import { Gift } from "lucide-react";
import { PRICING_TIERS, PRICING_BONUS } from "../lib/pricing";
import PricingCard from "../components/PricingCard";
import BillingToggle from "../components/BillingToggle";
import EyebrowBadge from "../components/EyebrowBadge";

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="bg-paper px-6 md:px-10 py-24 border-t border-ink/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <EyebrowBadge label="Pricing" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Priced for the size of your desk
          </h2>
          <p className="text-slate text-base max-w-lg mx-auto mb-8">
            Start free, upgrade when your campaign volume grows. No setup fees, cancel anytime.
          </p>

          <BillingToggle annual={annual} setAnnual={setAnnual} />
        </div>

        <div className="flex items-center justify-center gap-2 mb-14 text-sm text-slate">
          <Gift size={16} className="text-campaign-pink" />
          {PRICING_BONUS}
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.name} tier={tier} annual={annual} />
          ))}
        </div>
      </div>
    </section>
  );
}
