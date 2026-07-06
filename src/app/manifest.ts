import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

// bkz. src/app/icon.tsx — manifest.json ham bir veri dosyasıdır, CSS token
// sistemine erişemez; theme_color burada globals.css'teki --color-accent
// ile senkron tutulmalıdır.
const ACCENT = "#2b59ff";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations({
    locale: routing.defaultLocale,
    namespace: "site",
  });

  return {
    name: t("name"),
    short_name: t("name"),
    description: t("tagline"),
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: ACCENT,
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
