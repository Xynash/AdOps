export default function BannerCard({ banner }) {
  return (
    <div className="shrink-0 w-64 h-40 rounded-xl overflow-hidden relative shadow-lg">
      <img
        src={banner.image}
        alt={banner.brand}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="relative h-full flex flex-col justify-between p-4">
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-paper text-sm drop-shadow">{banner.brand}</span>
          <span className="font-mono text-[9px] text-paper/80 bg-black/40 px-2 py-0.5 rounded">{banner.format}</span>
        </div>
        <p className="font-display text-paper text-lg font-semibold leading-tight drop-shadow">{banner.tagline}</p>
      </div>
    </div>
  );
}
