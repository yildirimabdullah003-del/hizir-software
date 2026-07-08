/**
 * "E-Ticaret Çözümleri" hizmet sayfasına özgü ikon eşlemeleri.
 * Metinler messages/*.json içindeki serviceDetails["e-ticaret-cozumleri"]
 * altında tutulur; burada yalnızca item id -> FeatureGrid'in ICON_REGISTRY
 * anahtarı (string) eşlenir (bkz. kurumsal-web-siteleri.ts'teki not).
 */
export const audienceIcons: Record<string, string> = {
  "retail-to-online": "Store",
  "d2c-brands": "TrendingUp",
  "b2b-wholesale": "Briefcase",
  replatform: "RefreshCw",
};

export const offeringIcons: Record<string, string> = {
  storefront: "Palette",
  payments: "CreditCard",
  inventory: "Package",
  shipping: "Truck",
  "mobile-commerce": "Smartphone",
  analytics: "BarChart3",
};
