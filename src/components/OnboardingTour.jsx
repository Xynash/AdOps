import { useState } from "react";
import { X } from "lucide-react";
import { ONBOARDING_SLIDES } from "../lib/onboardingSlides";
import OnboardingIllustration from "./OnboardingIllustration";

const bgMap = {
  "campaign-blue": "bg-campaign-blue",
  "campaign-pink": "bg-campaign-pink",
  "campaign-mint": "bg-campaign-mint",
  "campaign-yellow": "bg-campaign-yellow",
};

const textMap = {
  "campaign-blue": "text-campaign-blue",
  "campaign-pink": "text-campaign-pink",
  "campaign-mint": "text-campaign-mint",
  "campaign-yellow": "text-[#8a6d1a]",
};

export default function OnboardingTour({ onFinish }) {
  const [index, setIndex] = useState(0);
  const slide = ONBOARDING_SLIDES[index];
  const isLast = index === ONBOARDING_SLIDES.length - 1;

  function handleNext() {
    if (isLast) {
      onFinish();
    } else {
      setIndex(index + 1);
    }
  }

  function handleBack() {
    if (index > 0) setIndex(index - 1);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" />

      <div className="relative bg-paper rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden grid md:grid-cols-2 fade-up-visible">
        <button
          onClick={onFinish}
          className="absolute top-5 right-5 z-10 text-white/70 hover:text-white md:text-slate md:hover:text-ink transition-colors"
        >
          <X size={20} />
        </button>

        <div key={"panel-" + index} className={"hidden md:block " + bgMap[slide.color] + " fade-up-visible min-h-[420px]"}>
          <OnboardingIllustration index={index} />
        </div>

        <div key={"content-" + index} className="p-8 md:p-10 flex flex-col justify-center fade-up-visible min-h-[420px]">
          <div className="flex gap-1.5 mb-8">
            {ONBOARDING_SLIDES.map((s, i) => (
              <div
                key={i}
                className={
                  "h-1.5 flex-1 rounded-full transition-colors duration-300 " +
                  (i <= index ? bgMap[slide.color] : "bg-ink/10")
                }
              />
            ))}
          </div>

          <p className={"font-mono text-xs tracking-wider mb-3 " + textMap[slide.color]}>
            STEP {index + 1} OF {ONBOARDING_SLIDES.length}
          </p>

          <h3 className="font-display text-3xl font-semibold mb-4 leading-tight">{slide.title}</h3>
          <p className="text-slate text-base leading-relaxed mb-10">{slide.body}</p>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={onFinish}
                className="text-sm text-slate hover:text-ink transition-colors"
              >
                Skip
              </button>
              {index > 0 && (
                <button
                  onClick={handleBack}
                  className="text-sm text-slate hover:text-ink transition-colors"
                >
                  Back
                </button>
              )}
            </div>
            <button
              onClick={handleNext}
              className="bg-ink text-paper px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#1a2129] transition-all duration-200 hover:scale-105"
            >
              {isLast ? "Get started" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
