/**
 * "Bakım, Performans & SEO" hizmet sayfasına özgü ikon eşlemeleri.
 * Metinler messages/*.json içindeki serviceDetails["bakim-performans-seo"]
 * altında tutulur; burada yalnızca item id -> FeatureGrid'in ICON_REGISTRY
 * anahtarı (string) eşlenir (bkz. kurumsal-web-siteleri.ts'teki not).
 */
export const audienceIcons: Record<string, string> = {
  "live-sites": "Globe",
  visibility: "TrendingUp",
  "slow-sites": "Gauge",
  "security-first": "ShieldCheck",
};

export const offeringIcons: Record<string, string> = {
  "performance-monitoring": "Activity",
  "seo-improvement": "Search",
  "security-updates": "ShieldCheck",
  "content-updates": "FileText",
  reporting: "BarChart3",
  "infrastructure-care": "Server",
};
