import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SERVICE_DETAIL_SLUGS } from "@/config/services";
import { absoluteUrl, localeAlternates } from "@/lib/seo";

// "/hakkimizda" bilinçli olarak listede değil: sayfa erişilebilir kalsa da
// menüden rafa kaldırıldı, arama motorlarına öncelikli içerik olarak sunulmaz.
const PATHS = [
  "",
  "/hizmetler",
  "/iletisim",
  "/gizlilik",
  "/kullanim-kosullari",
  ...SERVICE_DETAIL_SLUGS.map((slug) => `/hizmetler/${slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    PATHS.map((path) => ({
      url: absoluteUrl(locale, path),
      lastModified: new Date(),
      alternates: { languages: localeAlternates(path) },
    }))
  );
}
