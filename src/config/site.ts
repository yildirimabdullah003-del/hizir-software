/**
 * Site geneli yapılandırma — tek doğruluk kaynağı.
 * Navigasyon, meta bilgiler ve sabit değerler buradan yönetilir.
 * Metinler i18n'den (messages/*.json) gelir; burada yalnızca yapı/rota tutulur.
 */

export const siteConfig = {
  // Görünen ad ve marka bilgisi çevirilerde (site.name) tutulur.
  url: "https://hizirsoftware.com", // ileride gerçek alan adıyla güncellenecek
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
  // Gerçek hesaplar açıldığında doldurulacak (bkz. footer sosyal ikonları).
  // Var olmayan/doğrulanamayan hesaplara link vermemek için şimdilik boş.
  socialLinks: [] as { name: string; href: string; icon: "linkedin" | "github" | "x" }[],
} as const;

export type NavItem = (typeof siteConfig.navItems)[number];
