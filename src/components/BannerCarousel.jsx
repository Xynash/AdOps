import { CAMPAIGN_BANNERS } from "../lib/campaignBanners";
import BannerCard from "./BannerCard";

export default function BannerCarousel() {
  const items = [...CAMPAIGN_BANNERS, ...CAMPAIGN_BANNERS];

  return (
    <div className="overflow-hidden w-full py-4">
      <div className="flex gap-5 banner-marquee-track w-max">
        {items.map((banner, i) => (
          <BannerCard key={i} banner={banner} />
        ))}
      </div>
    </div>
  );
}
