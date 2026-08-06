import Button from "../components/Button";
import BannerCarousel from "../components/BannerCarousel";

export default function FinalCTA() {
  return (
    <section className="bg-paper px-6 md:px-10 py-20 border-t border-ink/10 text-center">
      <h2 className="font-display text-3xl md:text-4xl font-semibold mb-10">
        Your campaigns are ready. Is your QA?
      </h2>

      <div className="mb-10">
        <BannerCarousel />
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Button variant="dark">Try AdSquadOps today</Button>
        <Button variant="outlineDark">Get a demo</Button>
      </div>
    </section>
  );
}
