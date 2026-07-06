import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SERVICE_DETAIL_SLUGS } from "@/config/services";
import { absoluteUrl, localeAlternates } from "@/lib/seo";

const PATHS = [
  "",
  "/hizmetler",
  "/hakkimizda",
  "/iletisim",
  "/gizlilik",
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
