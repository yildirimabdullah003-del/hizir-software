/**
 * "Marka & Tasarım Sistemi" hizmet sayfasına özgü ikon eşlemeleri.
 * Metinler messages/*.json içindeki serviceDetails["marka-tasarim-sistemi"]
 * altında tutulur; burada yalnızca item id -> FeatureGrid'in ICON_REGISTRY
 * anahtarı (string) eşlenir (bkz. kurumsal-web-siteleri.ts'teki not).
 */
export const audienceIcons: Record<string, string> = {
  "new-brand": "Sparkles",
  rebrand: "RefreshCw",
  "product-teams": "Users",
  "multi-product": "Layers",
};

export const offeringIcons: Record<string, string> = {
  "design-tokens": "Palette",
  "component-library": "Component",
  "typography-color": "Type",
  accessibility: "Accessibility",
  guidelines: "BookOpen",
  "design-to-code": "Code2",
};
