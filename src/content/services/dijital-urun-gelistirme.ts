/**
 * "Dijital Ürün Geliştirme" hizmet sayfasına özgü ikon eşlemeleri.
 * Metinler messages/*.json içindeki serviceDetails["dijital-urun-gelistirme"]
 * altında tutulur; burada yalnızca item id -> FeatureGrid'in ICON_REGISTRY
 * anahtarı (string) eşlenir (bkz. kurumsal-web-siteleri.ts'teki not).
 */
export const audienceIcons: Record<string, string> = {
  startup: "Rocket",
  "internal-tools": "Wrench",
  "saas-idea": "Lightbulb",
  "enterprise-digital": "Building2",
};

export const offeringIcons: Record<string, string> = {
  mvp: "Rocket",
  architecture: "Layers",
  "product-ux": "Palette",
  integrations: "Server",
  "data-foundation": "Database",
  iteration: "RefreshCw",
};
