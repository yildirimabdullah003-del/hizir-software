/**
 * "Kurumsal Web Siteleri" hizmet sayfasına özgü ikon eşlemeleri.
 * Metinler messages/*.json içindeki serviceDetails["kurumsal-web-siteleri"]
 * altında tutulur; burada yalnızca item id -> FeatureGrid'in ICON_REGISTRY
 * anahtarı (string) eşlenir — gerçek ikon bileşeni Client Component olan
 * FeatureGrid içinde çözülür (bkz. o dosyadaki RSC serileştirme notu).
 *
 * Yeni bir hizmet sayfası eklerken bu dosyanın bir benzerini
 * (ör. dijital-urun-gelistirme.ts) oluşturup [slug]/page.tsx içindeki
 * switch'e ekle.
 */
export const audienceIcons: Record<string, string> = {
  "new-business": "Rocket",
  "growing-business": "TrendingUp",
  "corporate-brand": "Building2",
  "global-reach": "Languages",
};

export const offeringIcons: Record<string, string> = {
  "custom-design": "Palette",
  "seo-foundation": "Search",
  performance: "Gauge",
  "multilingual-infra": "Globe",
  "mobile-first": "Smartphone",
  "content-guidance": "FileText",
};
