export const AD_OPS_STATS = [
  { value: 600, prefix: "$", suffix: "B+", label: "Global digital ad spend annually" },
  { value: 1000, suffix: "s", label: "Campaigns launched across teams daily" },
  { value: 24, suffix: "h", label: "Typical SLA window for campaign fixes" },
];

export const AD_TYPES = [
  { name: "Display", icon: "LayoutGrid", color: "campaign-blue", desc: "Banner ads across web and app placements" },
  { name: "Social", icon: "Share2", color: "campaign-pink", desc: "Instagram, Meta, LinkedIn feed and story ads" },
  { name: "Video", icon: "Video", color: "campaign-red", desc: "Pre-roll, mid-roll, and connected TV spots" },
  { name: "Search", icon: "Search", color: "campaign-yellow", desc: "Paid listings on Google and Bing SERPs" },
  { name: "Native", icon: "Newspaper", color: "campaign-mint", desc: "In-feed content styled to match the platform" },
  { name: "Programmatic", icon: "Cpu", color: "campaign-blue", desc: "Automated bidding across ad exchanges" },
];

export const PIPELINE_STAGES = [
  {
    label: "Media planning",
    sub: "Strategy & buying",
    icon: "Users",
    color: "campaign-blue",
    detail: "Strategists decide targeting, budget, and channel mix before anything gets built.",
  },
  {
    label: "Trafficking",
    sub: "Upload & configure",
    icon: "Upload",
    color: "campaign-pink",
    detail: "Creatives, URLs, and tracking tags are uploaded and configured inside the ad server.",
  },
  {
    label: "QA validation",
    sub: "Rules & checks",
    icon: "ShieldCheck",
    color: "campaign-mint",
    detail: "Every link, tag, and creative spec is checked against QA rules before launch is allowed.",
  },
  {
    label: "Live campaign",
    sub: "Monitor & fix",
    icon: "Rocket",
    color: "campaign-yellow",
    detail: "Ops monitors delivery, catches issues in real time, and manages fixes within SLA.",
  },
  {
    label: "Optimize",
    sub: "Report & improve",
    icon: "TrendingUp",
    color: "campaign-red",
    detail: "Performance data feeds back into planning for the next round of campaigns.",
  },
];