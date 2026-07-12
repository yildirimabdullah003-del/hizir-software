import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";

/**
 * Site geneli iletişim/sosyal bilgileri — TEK okuma noktası.
 * Panelden (Admin > Ayarlar) kaydedilen değerler DB'den okunur; kayıt yoksa
 * veya DB'ye ulaşılamazsa koddaki `siteConfig` değerlerine düşülür. Böylece
 * Ayarlar sekmesi siteyi GERÇEKTEN değiştirir ama public sayfa asla çökmez.
 */

export type SocialLink = {
  name: string;
  href: string;
  icon: "linkedin" | "github" | "x" | "instagram";
};

export type SiteContact = {
  url: string;
  contactEmail: string;
  phone: string;
  /** wa.me biçimi: uluslararası, başında + veya 0 olmadan (örn. 90545...). */
  whatsappNumber: string;
  socialLinks: SocialLink[];
};

const FALLBACK: SiteContact = {
  url: siteConfig.url,
  contactEmail: siteConfig.contactEmail,
  phone: siteConfig.phone,
  whatsappNumber: siteConfig.whatsappNumber,
  socialLinks: [...siteConfig.socialLinks],
};

export async function getSiteContact(): Promise<SiteContact> {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: ["siteMeta", "socialLinks"] } },
    });
    const meta = rows.find((r) => r.key === "siteMeta")?.value as
      | Partial<SiteContact>
      | undefined;
    const social = rows.find((r) => r.key === "socialLinks")?.value as
      | SocialLink[]
      | undefined;

    return {
      // Eski kayıtlarda phone/whatsappNumber olmayabilir — alan alan düş.
      url: meta?.url || FALLBACK.url,
      contactEmail: meta?.contactEmail || FALLBACK.contactEmail,
      phone: meta?.phone || FALLBACK.phone,
      whatsappNumber: meta?.whatsappNumber || FALLBACK.whatsappNumber,
      socialLinks: social ?? FALLBACK.socialLinks,
    };
  } catch {
    return FALLBACK;
  }
}
