import { useState, useEffect, useRef } from "react";
import { Users, Upload, ShieldCheck, Rocket, TrendingUp, Play, RotateCcw } from "lucide-react";
import { PIPELINE_STAGES } from "../lib/adOpsData";

const ICON_MAP = { Users, Upload, ShieldCheck, Rocket, TrendingUp };
const STEP_DURATION = 2000;

const bgActive = {
  "campaign-blue": "bg-campaign-blue text-ink shadow-campaign-blue/40",
  "campaign-pink": "bg-campaign-pink text-ink shadow-campaign-pink/40",
  "campaign-mint": "bg-campaign-mint text-ink shadow-campaign-mint/40",
  "campaign-yellow": "bg-campaign-yellow text-ink shadow-campaign-yellow/40",
  "campaign-red": "bg-campaign-red text-ink shadow-campaign-red/40",
};

const bgPassed = {
  "campaign-blue": "bg-campaign-blue/20 text-campaign-blue",
  "campaign-pink": "bg-campaign-pink/20 text-campaign-pink",
  "campaign-mint": "bg-campaign-mint/20 text-campaign-mint",
  "campaign-yellow": "bg-campaign-yellow/20 text-[#a37a15]",
  "campaign-red": "bg-campaign-red/20 text-campaign-red",
};

const popupBg = {
  "campaign-blue": "bg-campaign-blue text-ink",
  "campaign-pink": "bg-campaign-pink text-ink",
  "campaign-mint": "bg-campaign-mint text-ink",
  "campaign-yellow": "bg-campaign-yellow text-ink",
  "campaign-red": "bg-campaign-red text-ink",
};

export default function PipelineDiagram() {
  const [active, setActive] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) return;

    if (active >= PIPELINE_STAGES.length - 1) {
      timeoutRef.current = setTimeout(() => setIsPlaying(false), STEP_DURATION);
      return () => clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setActive((prev) => prev + 1);
    }, STEP_DURATION);

    return () => clearTimeout(timeoutRef.current);
  }, [isPlaying, active]);

  function handlePlay() {
    clearTimeout(timeoutRef.current);
    setActive(0);
    setIsPlaying(true);
  }

  function handleReset() {
    clearTimeout(timeoutRef.current);
    setIsPlaying(false);
    setActive(2);
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex justify-center gap-3 mb-20">
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className="flex items-center gap-2 bg-ink text-paper text-sm font-medium px-4 py-2 rounded-md transition-transform duration-200 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
        >
          <Play size={14} fill="currentColor" />
          {isPlaying ? "Running..." : "Run simulation"}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 border border-ink/20 text-ink text-sm font-medium px-4 py-2 rounded-md transition-transform duration-200 hover:scale-105"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      <div className="w-full max-w-5xl flex items-start justify-center pt-24 mx-auto">
        {PIPELINE_STAGES.map((stage, i) => {
          const Icon = ICON_MAP[stage.icon];
          const isActive = active === i;
          const isPassed = active > i;
          return (
            <div key={stage.label} className="flex items-start flex-1">
              <div className="flex flex-col items-center text-center gap-3 flex-1 relative">
                {isActive && (
                  <div
                    className={
                      "popup-bubble absolute -top-24 text-xs font-medium rounded-lg px-4 py-3 w-[200px] shadow-xl z-10 " +
                      popupBg[stage.color]
                    }
                  >
                    {stage.detail}
                    <div
                      className={
                        "absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 rotate-45 " +
                        popupBg[stage.color]
                      }
                    />
                  </div>
                )}

                <button
                  onClick={() => {
                    if (isPlaying) return;
                    setActive(i);
                  }}
                  className="flex flex-col items-center text-center gap-3 group relative z-0"
                >
                  <div
                    className={
                      "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg " +
                      (isActive
                        ? "scale-110 " + bgActive[stage.color]
                        : isPassed
                        ? bgPassed[stage.color]
                        : "bg-ink/5 text-ink/40 shadow-none")
                    }
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <div
                      className={
                        "font-display font-semibold text-xs md:text-sm transition-colors duration-300 " +
                        (isActive || isPassed ? "text-ink" : "text-ink/50")
                      }
                    >
                      {stage.label}
                    </div>
                    <div className="text-[11px] text-slate mt-0.5">{stage.sub}</div>
                  </div>
                </button>
              </div>

              {i < PIPELINE_STAGES.length - 1 && (
                <div className="h-1 rounded-full bg-ink/10 flex-1 mt-6 overflow-hidden relative">
                  <div
                    className="h-full pipeline-flow opacity-70 transition-all duration-700 ease-out"
                    style={{ width: active > i ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
