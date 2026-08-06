import { useState, useEffect } from "react";
import { Upload, ShieldCheck, Rocket, Activity, Check } from "lucide-react";
import { HOW_IT_WORKS_STEPS } from "../lib/howItWorks";
import PersonaToggle from "../components/PersonaToggle";
import EyebrowBadge from "../components/EyebrowBadge";
import WindowChrome from "../components/mockups/WindowChrome";
import TrafficUploadMockup from "../components/mockups/TrafficUploadMockup";
import ValidateScanMockup from "../components/mockups/ValidateScanMockup";
import LaunchStatusMockup from "../components/mockups/LaunchStatusMockup";
import MonitorMetricsMockup from "../components/mockups/MonitorMetricsMockup";

const ICON_MAP = { traffic: Upload, validate: ShieldCheck, launch: Rocket, monitor: Activity };
const MOCKUP_MAP = { traffic: TrafficUploadMockup, validate: ValidateScanMockup, launch: LaunchStatusMockup, monitor: MonitorMetricsMockup };

const activeBg = {
  "campaign-red": "bg-campaign-red text-ink",
  "campaign-blue": "bg-campaign-blue text-ink",
  "campaign-mint": "bg-campaign-mint text-ink",
  "campaign-yellow": "bg-campaign-yellow text-ink",
};

const textColor = {
  "campaign-red": "text-campaign-red",
  "campaign-blue": "text-campaign-blue",
  "campaign-mint": "text-campaign-mint",
  "campaign-yellow": "text-campaign-yellow",
};

const checkColor = {
  "campaign-red": "text-campaign-red",
  "campaign-blue": "text-campaign-blue",
  "campaign-mint": "text-campaign-mint",
  "campaign-yellow": "text-campaign-yellow",
};

const HEADING_WORDS = ["just you", "your whole desk", "a freelancer", "a 50-person agency"];

export default function HowItWorks() {
  const [persona, setPersona] = useState("individual");
  const [activeStep, setActiveStep] = useState(0);
  const [headingIndex, setHeadingIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeadingIndex((prev) => (prev + 1) % HEADING_WORDS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const step = HOW_IT_WORKS_STEPS[activeStep];
  const content = step[persona];
  const Icon = ICON_MAP[step.key];
  const Mockup = MOCKUP_MAP[step.key];
  const transitionKey = step.key + "-" + persona;

  return (
    <section id="how-it-works" className="bg-ink px-6 md:px-10 py-24">
      <div className="max-w-4xl mx-auto text-center mb-14">
        <div className="flex justify-center mb-5">
          <EyebrowBadge label="How it works" invert />
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-paper mb-6">
          Built to work whether it is{" "}
          <span
            key={headingIndex}
            className="inline-block px-3 py-1 rounded-full bg-campaign-mint/15 text-campaign-mint fade-up-visible"
            style={{ minWidth: "220px" }}
          >
            {HEADING_WORDS[headingIndex]}
          </span>
        </h2>
        <div className="flex justify-center">
          <PersonaToggle persona={persona} setPersona={setPersona} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {HOW_IT_WORKS_STEPS.map((s, i) => {
            const StepIcon = ICON_MAP[s.key];
            const isActive = i === activeStep;
            return (
              <button
                key={s.key}
                onClick={() => setActiveStep(i)}
                className={
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 " +
                  (isActive ? activeBg[s.color] : "bg-white/5 text-white/50 hover:bg-white/10")
                }
              >
                <StepIcon size={15} />
                {s.label}
              </button>
            );
          })}
        </div>

        <div key={transitionKey} className="grid md:grid-cols-2 gap-10 items-start fade-up-visible">
          <div>
            <div className={"font-mono text-xs mb-2 " + textColor[step.color]}>
              STEP {String(activeStep + 1).padStart(2, "0")} · {persona === "individual" ? "INDIVIDUAL" : "TEAM"}
            </div>
            <h3 className="font-display text-2xl font-semibold text-paper mb-2">{content.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">{content.description}</p>

            <div className={"inline-block text-xs font-medium px-3 py-1.5 rounded-full mb-6 bg-white/5 " + textColor[step.color]}>
              Built for {content.builtFor}
            </div>

            <div className="space-y-2.5">
              {content.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5">
                  <Check size={15} className={checkColor[step.color] + " shrink-0 mt-0.5"} />
                  <span className="text-white/70 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <WindowChrome title={step.key + "_" + persona}>
            <Mockup />
          </WindowChrome>
        </div>
      </div>
    </section>
  );
}
