import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";

/**
 * Bir locale + yol için mutlak (canonical) URL üretir.
 * path "" ise ana sayfa, aksi halde "/hizmetler" gibi baştan "/" ile verilir.
 */
export function absoluteUrl(locale: string, path = "") {
  return `${siteConfig.url}/${locale}${path}`;
}

/**
 * hreflang alternates map'i: her locale için aynı sayfanın URL'si.
 * next-intl localePrefix "always" olduğundan her dil kendi önekiyle listelenir.
 */
export function localeAlternates(path = "") {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, absoluteUrl(locale, path)])
  );
}
