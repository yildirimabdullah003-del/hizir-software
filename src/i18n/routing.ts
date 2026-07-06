import { defineRouting } from "next-intl/routing";

/**
 * Uygulamanın dil yapılandırması (ADR 0004).
 *
 * - Şu an içerik yalnızca Türkçe hazırlanıyor.
 * - Altyapı en baştan İngilizceyi de destekliyor.
 * - İngilizceyi açmak için: 'en' zaten burada tanımlı; sadece
 *   messages/en.json doldurulacak. Kod değişikliği gerekmez.
 */
export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  // "tr" için URL /tr/... yerine sade /... olsun istersek 'as-needed' kullanılır.
  // Şimdilik her dil kendi öneki ile net kalsın (SEO için daha öngörülebilir).
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
