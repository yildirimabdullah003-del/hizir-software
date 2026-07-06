import type { FeatureItem } from "@/components/sections/feature-grid";
import type { ProcessStep } from "@/components/sections/process-steps";
import type { PackageTier } from "@/components/sections/packages-grid";

/**
 * Bir hizmet detay sayfasının tam içerik sözleşmesi.
 * Bugün bu veri next-intl mesaj dosyalarından (`serviceDetails.<slug>`)
 * okunuyor; ileride bir Design Library / Website Builder bu şemayı
 * doğrudan CMS'ten veya kullanıcı girdisinden üretebilir — sayfa/bileşen
 * tarafında değişiklik gerekmeden.
 */
export type ServiceDetailContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta?: string;
  };
  audience: {
    eyebrow: string;
    title: string;
    subtitle?: string;
    items: FeatureItem[];
  };
  offerings: {
    eyebrow: string;
    title: string;
    subtitle?: string;
    items: FeatureItem[];
  };
  packages: {
    eyebrow: string;
    title: string;
    subtitle?: string;
    priceLabel: string;
    ctaLabel: string;
    tiers: PackageTier[];
  };
  cta: {
    title: string;
    subtitle: string;
    primaryCta: string;
  };
  websiteBuilder: {
    badge: string;
    title: string;
    description: string;
    cta: string;
  };
};

export type { FeatureItem, ProcessStep, PackageTier };
