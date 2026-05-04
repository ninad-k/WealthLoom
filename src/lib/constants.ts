// Allow white-labeling via environment variables, defaulting to LuminaCast
const PLATFORM_NAME = process.env.NEXT_PUBLIC_PLATFORM_NAME || "LuminaCast";
const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || "LuminaCast Inc.";
const BRAND_FIRST = process.env.NEXT_PUBLIC_BRAND_FIRST || "Lumina";
const BRAND_SECOND = process.env.NEXT_PUBLIC_BRAND_SECOND || "Cast";

export const SITE_CONFIG = {
  name: PLATFORM_NAME,
  company: COMPANY_NAME, // The legal/content brand
  description: "Next Gen Video Education & Premium Content Platform",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://luminacast.com",
  brand: {
    first: BRAND_FIRST,
    second: BRAND_SECOND,
  },
  links: {
    twitter: "https://twitter.com/luminacast",
    discord: "https://discord.gg/luminacast",
  },
  pricing: [
    {
      name: "Free",
      price: "$0",
      description: "Start your wealth journey with essential insights.",
      features: ["Basic Video Library", "Weekly Newsletter", "Community Discord Access"],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$49",
      description: "Advanced strategies for serious investors.",
      features: ["Full Video Archive", "Real-time Flow Analysis", "Priority Support", "Monthly Strategy Calls"],
      cta: "Go Pro",
      popular: true
    },
    {
      name: "Elite",
      price: "$149",
      description: "Direct mentorship and institutional tools.",
      features: ["Everything in Pro", "1-on-1 Coaching", "Custom Portfolio Reviews", "Private Signal Group"],
      cta: "Join Elite",
      popular: false
    }
  ]
};
