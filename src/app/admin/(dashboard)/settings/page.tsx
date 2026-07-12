import { requireRole } from "@/features/admin/auth/session";
import { getSetting } from "@/features/admin/settings/data";
import { siteConfig } from "@/config/site";
import { SettingsForms } from "./settings-forms";

export const dynamic = "force-dynamic";

type SiteMeta = {
  url: string;
  contactEmail: string;
  phone: string;
  whatsappNumber: string;
};
type SocialLink = {
  name: string;
  href: string;
  icon: "linkedin" | "github" | "x" | "instagram";
};

export default async function AdminSettingsPage() {
  await requireRole("ADMIN");

  const [siteMetaRow, socialRow] = await Promise.all([
    getSetting("siteMeta"),
    getSetting("socialLinks"),
  ]);

  // DB'de kayıt yoksa (veya eski kayıtta alan eksikse) koddaki mevcut
  // değerler başlangıç olarak gösterilir.
  const storedMeta = (siteMetaRow?.value as Partial<SiteMeta>) ?? {};
  const siteMeta: SiteMeta = {
    url: storedMeta.url || siteConfig.url,
    contactEmail: storedMeta.contactEmail || siteConfig.contactEmail,
    phone: storedMeta.phone || siteConfig.phone,
    whatsappNumber: storedMeta.whatsappNumber || siteConfig.whatsappNumber,
  };
  const socialLinks: SocialLink[] =
    (socialRow?.value as SocialLink[]) ?? [...siteConfig.socialLinks];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Ayarlar</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Site geneli yapılandırma — kaydettiğinizde sitede anında yansır
        (footer, iletişim sayfası ve tüm WhatsApp butonları). Yalnızca
        OWNER/ADMIN değiştirebilir.
      </p>
      <SettingsForms siteMeta={siteMeta} socialLinks={socialLinks} />
    </div>
  );
}
