export const DEMO_CAMPAIGNS = [
  {
    name: "AdSquadOps Launch (should pass QA)",
    destination_url: "https://adsquadops.vercel.app/",
    tracking_tag: "utm_source=google&utm_medium=cpc&utm_campaign=launch",
    ad_copy: "Catch broken campaigns before they go live. Validate links, tags and ad copy in one console.",
  },
  {
    name: "Broken Tracking Tag (should fail QA)",
    destination_url: "https://adsquadops.vercel.app/",
    tracking_tag: "campaign=launch",
    ad_copy: "Catch broken campaigns before they go live. Validate links, tags and ad copy in one console.",
  },
  {
    name: "Mismatched Ad Copy (should fail QA)",
    destination_url: "https://adsquadops.vercel.app/",
    tracking_tag: "utm_source=meta&utm_medium=social&utm_campaign=sale",
    ad_copy: "Get 40% off all mattresses this Diwali. Limited time offer.",
  },
];
