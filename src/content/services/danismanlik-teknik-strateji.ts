/**
 * "Danışmanlık & Teknik Strateji" hizmet sayfasına özgü ikon eşlemeleri.
 * Metinler messages/*.json içindeki serviceDetails["danismanlik-teknik-strateji"]
 * altında tutulur; burada yalnızca item id -> FeatureGrid'in ICON_REGISTRY
 * anahtarı (string) eşlenir (bkz. kurumsal-web-siteleri.ts'teki not).
 */
export const audienceIcons: Record<string, string> = {
  "pre-build": "Lightbulb",
  "tech-teams": "Users",
  "legacy-systems": "Building2",
  scaling: "TrendingUp",
};

export const offeringIcons: Record<string, string> = {
  "architecture-review": "Layers",
  "tech-selection": "Compass",
  roadmap: "Map",
  "team-process": "Users",
  "code-audit": "Code2",
  transformation: "Zap",
};
