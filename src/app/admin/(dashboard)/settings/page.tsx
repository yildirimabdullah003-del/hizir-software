import { requireRole } from "@/features/admin/auth/session";
import { getSetting } from "@/features/admin/settings/data";
import { siteConfig } from "@/config/site";
import { SettingsForms } from "./settings-forms";

export const dynamic = "force-dynamic";

type SiteMeta = { url: string; contactEmail: string };
type SocialLink = { name: string; href: string; icon: "linkedin" | "github" | "x" };

export default async function AdminSettingsPage() {
  await requireRole("ADMIN");

  const [siteMetaRow, socialRow] = await Promise.all([
    getSetting("siteMeta"),
    getSetting("socialLinks"),
  ]);

  // DB'de kayıt yoksa koddaki mevcut değerler başlangıç olarak gösterilir.
  const siteMeta: SiteMeta = (siteMetaRow?.value as SiteMeta) ?? {
    url: siteConfig.url,
    contactEmail: siteConfig.contactEmail,
  };
  const socialLinks: SocialLink[] =
    (socialRow?.value as SocialLink[]) ?? [...siteConfig.socialLinks];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Ayarlar</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Site geneli yapılandırma. Bu değerler yalnızca OWNER/ADMIN
        tarafından değiştirilebilir.
      </p>
      <SettingsForms siteMeta={siteMeta} socialLinks={socialLinks} />
    </div>
  );
}
