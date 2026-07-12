"use client";

import { useActionState } from "react";
import {
  saveSiteMeta,
  saveSocialLinks,
  type SaveSettingState,
} from "@/features/admin/settings/actions";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-fast focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/15";

type SocialLink = {
  name: string;
  href: string;
  icon: "linkedin" | "github" | "x" | "instagram";
};

const PLATFORM_LABELS: Record<SocialLink["icon"], string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  github: "GitHub",
  x: "X",
};

const PLATFORM_PLACEHOLDERS: Record<SocialLink["icon"], string> = {
  instagram: "https://instagram.com/...",
  linkedin: "https://linkedin.com/company/...",
  github: "https://github.com/...",
  x: "https://x.com/...",
};

function FormStatus({ state }: { state: SaveSettingState }) {
  if (state.error)
    return (
      <p role="alert" className="text-sm text-red-600">
        {state.error}
      </p>
    );
  if (state.success)
    return <p className="text-sm text-emerald-700">Kaydedildi ✓</p>;
  return null;
}

export function SettingsForms({
  siteMeta,
  socialLinks,
}: {
  siteMeta: {
    url: string;
    contactEmail: string;
    phone: string;
    whatsappNumber: string;
  };
  socialLinks: SocialLink[];
}) {
  const [metaState, metaAction, metaPending] = useActionState<
    SaveSettingState,
    FormData
  >(saveSiteMeta, {});
  const [socialState, socialAction, socialPending] = useActionState<
    SaveSettingState,
    FormData
  >(saveSocialLinks, {});

  const hrefFor = (icon: SocialLink["icon"]) =>
    socialLinks.find((l) => l.icon === icon)?.href ?? "";

  return (
    <div className="mt-6 space-y-6">
      <form
        action={metaAction}
        className="space-y-4 rounded-xl border border-border bg-background p-6 shadow-soft"
      >
        <h2 className="text-sm font-semibold">Site ve İletişim Bilgileri</h2>
        <p className="text-xs text-muted-foreground">
          Bu değerler footer&apos;da, iletişim sayfasında ve sitedeki tüm
          WhatsApp butonlarında kullanılır.
        </p>
        <div>
          <label htmlFor="url" className="mb-1 block text-xs font-medium">
            Site adresi (canonical URL ve e-postalarda kullanılır)
          </label>
          <input
            id="url"
            name="url"
            type="url"
            defaultValue={siteMeta.url}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="contactEmail"
            className="mb-1 block text-xs font-medium"
          >
            İletişim e-postası (footer&apos;da görünür)
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            defaultValue={siteMeta.contactEmail}
            required
            className={inputClass}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-1 block text-xs font-medium">
              Telefon (sitede görünen biçim)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={siteMeta.phone}
              placeholder="0545 936 33 47"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="whatsappNumber"
              className="mb-1 block text-xs font-medium"
            >
              WhatsApp numarası (tüm butonların hedefi)
            </label>
            <input
              id="whatsappNumber"
              name="whatsappNumber"
              type="tel"
              defaultValue={siteMeta.whatsappNumber}
              placeholder="905459363347"
              required
              className={inputClass}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              0 veya +90 ile yazsanız da otomatik düzeltilir.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button type="submit" size="sm" disabled={metaPending}>
            {metaPending ? "Kaydediliyor..." : "Kaydet"}
          </Button>
          <FormStatus state={metaState} />
        </div>
      </form>

      <form
        action={socialAction}
        className="space-y-4 rounded-xl border border-border bg-background p-6 shadow-soft"
      >
        <h2 className="text-sm font-semibold">Sosyal Bağlantılar</h2>
        <p className="text-xs text-muted-foreground">
          Boş bırakılan platform footer&apos;da gösterilmez.
        </p>
        {(["instagram", "linkedin", "github", "x"] as const).map((icon) => (
          <div key={icon}>
            <label htmlFor={icon} className="mb-1 block text-xs font-medium">
              {PLATFORM_LABELS[icon]}
            </label>
            <input
              id={icon}
              name={icon}
              type="url"
              placeholder={PLATFORM_PLACEHOLDERS[icon]}
              defaultValue={hrefFor(icon)}
              className={inputClass}
            />
          </div>
        ))}
        <div className="flex items-center gap-4">
          <Button type="submit" size="sm" disabled={socialPending}>
            {socialPending ? "Kaydediliyor..." : "Kaydet"}
          </Button>
          <FormStatus state={socialState} />
        </div>
      </form>
    </div>
  );
}
