import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CASE_STUDIES } from "../lib/caseStudies";
import CaseStudyCard from "../components/CaseStudyCard";
import EyebrowBadge from "../components/EyebrowBadge";

export default function CampaignNews() {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function scroll(direction) {
    if (!trackRef.current) return;
    const amount = 360;
    trackRef.current.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  function scrollToIndex(i) {
    if (!trackRef.current) return;
    trackRef.current.scrollTo({ left: i * 360, behavior: "smooth" });
    setActiveIndex(i);
  }

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    function handleScroll() {
      const index = Math.round(el.scrollLeft / 360);
      setActiveIndex(index);
    }
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="bg-ink px-6 md:px-10 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <div className="mb-4">
              <EyebrowBadge label="From the desk" invert />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold max-w-lg text-paper">
              How teams are using AdSquadOps in the field
            </h2>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-full border border-white/20 text-paper flex items-center justify-center transition-colors hover:bg-paper hover:text-ink"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-full border border-white/20 text-paper flex items-center justify-center transition-colors hover:bg-paper hover:text-ink"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto pb-4 scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {CASE_STUDIES.map((study) => (
            <CaseStudyCard key={study.company} study={study} />
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-10">
          {CASE_STUDIES.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={
                "h-1.5 rounded-full transition-all duration-300 " +
                (activeIndex === i ? "w-8 bg-paper" : "w-1.5 bg-white/20")
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}