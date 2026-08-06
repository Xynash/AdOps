import Button from "../components/Button";
import PillHighlight from "../components/PillHighlight";
import ProductPreviewCard from "../components/ProductPreviewCard";
import LogoMarquee from "../components/LogoMarquee";
import { scrollToId } from "../lib/smoothScroll";

export default function Hero({ onRequestDemo }) {
  return (
    <section className="bg-paper text-ink px-6 md:px-10 pt-20 pb-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-6">
            Catch{" "}
            <PillHighlight color="signal-green">broken campaigns</PillHighlight>{" "}
            before they{" "}
            <PillHighlight color="campaign-blue">go live</PillHighlight>
          </h1>

          <p className="text-slate text-base md:text-lg max-w-md mb-8 leading-relaxed">
            Validate creatives, URLs, and tracking tags automatically. Track
            SLA-bound support tickets and escalations in one console built
            for the ad ops desk.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-14">
            <Button variant="dark" onClick={onRequestDemo}>Request demo</Button>
            <Button variant="outlineDark" onClick={() => scrollToId("how-it-works", 900)}>
              See how it works
            </Button>
          </div>

          <p className="font-mono text-xs text-slate tracking-wider mb-4">
            BUILT FOR TEAMS RUNNING CAMPAIGNS ACROSS
          </p>
          <LogoMarquee />
        </div>

        <ProductPreviewCard />
      </div>
    </section>
  );
}
