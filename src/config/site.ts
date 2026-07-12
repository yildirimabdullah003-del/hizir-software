/**
 * Site geneli yapılandırma — tek doğruluk kaynağı.
 * Navigasyon, meta bilgiler ve sabit değerler buradan yönetilir.
 * Metinler i18n'den (messages/*.json) gelir; burada yalnızca yapı/rota tutulur.
 */

/** Üretimdeki kalıcı, kanonik alan adı (www'siz). */
const PRODUCTION_URL = "https://hizirsoftware.com";

/**
 * Canonical/OG/sitemap/robots için site adresini çözer.
 *
 * `NEXT_PUBLIC_SITE_URL` env'i YALNIZCA geçerli bir özel alan adıysa kullanılır.
 * Vercel'in otomatik `*.vercel.app` önizleme/üretim adresleri BİLİNÇLİ olarak
 * reddedilir — aksi halde canonical/sitemap yanlışlıkla `vercel.app` domainini
 * yayar (SEO'da yinelenen içerik). Yerel geliştirmede localhost'a izin verilir.
 * Böylece Vercel env'i yanlış ayarlı olsa bile üretim daima gerçek domaini kullanır.
 */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (!raw) return PRODUCTION_URL;
  if (raw.includes("localhost") || raw.includes("127.0.0.1")) return raw;
  if (raw.includes("vercel.app")) return PRODUCTION_URL;
  return raw;
}

export const siteConfig = {
  // Görünen ad ve marka bilgisi çevirilerde (site.name) tutulur.
  // Canonical/OG/sitemap için tek doğruluk kaynağı olan site adresi.
  url: resolveSiteUrl(),
  contactEmail: "iletisim@hizirsoftware.com", // ileride gerçek adresle güncellenecek
  phone: "0545 936 33 47",
  // wa.me uluslararası biçim ister (başında + veya 0 olmadan).
  whatsappNumber: "905459363347",
  // "Hakkımızda" bilinçli olarak rafa kaldırıldı (sayfa URL'den erişilebilir
  // kalır, menüde gösterilmez) — bilgi almak isteyen WhatsApp hattını kullanır.
  navItems: [
    { key: "home", href: "/" },
    { key: "services", href: "/hizmetler" },
    { key: "pricing", href: "/#fiyatlandirma" },
    { key: "contact", href: "/iletisim" },
  ],
  // Footer'daki sosyal ikonlar. Yalnızca gerçekten var olan hesaplar eklenir.
  socialLinks: [
    {
      name: "Instagram",
      href: "https://instagram.com/hizirsoftware",
      icon: "instagram",
    },
  ] as { name: string; href: string; icon: "linkedin" | "github" | "x" | "instagram" }[],
} as const;

export type NavItem = (typeof siteConfig.navItems)[number];
