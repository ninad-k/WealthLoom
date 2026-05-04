export interface TenantConfig {
  id: string;
  name: string;
  company: string;
  description: string;
  customDomain?: string; // e.g. "academy.wealthloom.com"
  logoUrl?: string;
  brand: {
    first: string;
    second: string;
    primaryColor: string;
    secondaryColor: string;
  };
  pricing: any[];
}

export const MOCK_TENANTS: Record<string, TenantConfig> = {
  "wealthloom": {
    id: "wealthloom",
    name: "WealthLoom Academy",
    company: "WealthLoom Inc.",
    description: "Master the markets with precision and vision.",
    customDomain: "academy.wealthloom.com",
    brand: {
      first: "Wealth",
      second: "Loom",
      primaryColor: "#f59e0b", // Gold
      secondaryColor: "#020617" // Navy
    },
    pricing: [
      { name: "Free", price: "$0", features: ["Basic Videos"] },
      { name: "Pro", price: "$49", features: ["All Videos", "Flow Analysis"] }
    ]
  },
  "tradezenith": {
    id: "tradezenith",
    name: "TradeZenith",
    company: "Zenith Trading Group",
    description: "The peak of trading education.",
    brand: {
      first: "Trade",
      second: "Zenith",
      primaryColor: "#10b981", // Emerald Green
      secondaryColor: "#064e3b" // Dark Green
    },
    pricing: [
      { name: "Starter", price: "$29", features: ["Intro Course"] },
      { name: "Elite", price: "$99", features: ["Masterclass"] }
    ]
  }
};

export function getTenant(hostOrSubdomain: string): TenantConfig {
  // 1. Check if it's a known custom domain
  const tenantByDomain = Object.values(MOCK_TENANTS).find(
    (t) => t.customDomain === hostOrSubdomain
  );
  if (tenantByDomain) return tenantByDomain;

  // 2. Otherwise assume it's a subdomain ID
  return MOCK_TENANTS[hostOrSubdomain] || MOCK_TENANTS["wealthloom"];
}
