const LOGOS = ["Google Ads", "Meta Ads", "DV360", "CM360", "Kevel"];

export default function LogoMarquee() {
  const items = [...LOGOS, ...LOGOS];

  return (
    <div className="overflow-hidden relative w-full max-w-md">
      <div className="flex gap-10 marquee-track whitespace-nowrap">
        {items.map((logo, i) => (
          <span key={i} className="font-display text-base text-ink/60 shrink-0">
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}