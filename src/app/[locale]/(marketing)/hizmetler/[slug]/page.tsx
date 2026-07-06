import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServiceHero } from "@/components/sections/service-hero";
import { FeatureGrid, type FeatureItem } from "@/components/sections/feature-grid";
import { ProcessSteps, type ProcessStep } from "@/components/sections/process-steps";
import { PackagesGrid, type PackageTier } from "@/components/sections/packages-grid";
import { Faq, type FaqItem } from "@/components/sections/faq";
import { CtaSection } from "@/components/sections/cta-section";
import { WebsiteBuilderTeaser } from "@/components/sections/website-builder-teaser";
import { SERVICE_DETAIL_SLUGS, isServiceDetailSlug, type ServiceDetailSlug } from "@/config/services";
import { absoluteUrl, localeAlternates } from "@/lib/seo";
import * as kurumsalWebSiteleri from "@/content/services/kurumsal-web-siteleri";

// Yalnızca burada üretilen slug'lar geçerlidir; listede olmayan bir slug
// istendiğinde Next.js otomatik olarak 404 döner (bkz. dynamicParams).
export function generateStaticParams() {
  return SERVICE_DETAIL_SLUGS.map((slug) => ({ slug }));
}

// generateStaticParams dışındaki slug'lar için (ör. henüz sayfası olmayan
// bir hizmet) sayfayı hiç render etmeden 404 üretir.
export const dynamicParams = false;

/**
 * slug -> ikon eşlemesi. Yeni bir hizmet sayfası eklendiğinde
 * (bkz. src/config/services.ts'teki SERVICE_DETAIL_SLUGS) buraya bir
 * `case` eklenir; her hizmetin kendi content modülü yalnızca ikonları taşır,
 * metinler her zaman messages/*.json'dan gelir.
 */
function getServiceIcons(slug: ServiceDetailSlug): {
  audienceIcons: Record<string, string>;
  offeringIcons: Record<string, string>;
} {
  switch (slug) {
    case "kurumsal-web-siteleri":
      return kurumsalWebSiteleri;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isServiceDetailSlug(slug)) return {};

  const t = await getTranslations({
    locale,
    namespace: `serviceDetails.${slug}.hero`,
  });
  const path = `/hizmetler/${slug}`;

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: absoluteUrl(locale, path),
      languages: localeAlternates(path),
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isServiceDetailSlug(slug)) {
    notFound();
  }

  setRequestLocale(locale);
  const icons = getServiceIcons(slug);

  return (
    <>
      <Hero slug={slug} />
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Audience slug={slug} icons={icons.audienceIcons} />
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Offerings slug={slug} icons={icons.offeringIcons} />
      </section>
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Process />
        </div>
      </section>
      <section id="paketler" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
        <Packages slug={slug} />
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <FaqSection slug={slug} />
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <FinalCta slug={slug} />
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <WebsiteBuilder slug={slug} />
      </section>
    </>
  );
}

function Hero({ slug }: { slug: ServiceDetailSlug }) {
  const t = useTranslations(`serviceDetails.${slug}.hero`);
  return (
    <ServiceHero
      eyebrow={t("eyebrow")}
      title={t("title")}
      subtitle={t("subtitle")}
      primaryCta={t("primaryCta")}
      secondaryCta={t("secondaryCta")}
    />
  );
}

function Audience({
  slug,
  icons,
}: {
  slug: ServiceDetailSlug;
  icons: Record<string, string>;
}) {
  const t = useTranslations(`serviceDetails.${slug}.audience`);
  const items = t.raw("items") as FeatureItem[];
  return (
    <>
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        className="mb-12"
      />
      <FeatureGrid items={items} icons={icons} columns={4} />
    </>
  );
}

function Offerings({
  slug,
  icons,
}: {
  slug: ServiceDetailSlug;
  icons: Record<string, string>;
}) {
  const t = useTranslations(`serviceDetails.${slug}.offerings`);
  const items = t.raw("items") as FeatureItem[];
  return (
    <>
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        className="mb-12"
      />
      <FeatureGrid items={items} icons={icons} columns={3} />
    </>
  );
}

function Process() {
  // Süreç, hizmete özgü değil şirket genelidir — home sayfasındaki aynı
  // çeviriler yeniden kullanılır (bkz. messages/*.json "process").
  const t = useTranslations("process");
  const steps = t.raw("steps") as ProcessStep[];
  return (
    <>
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        className="mb-16"
      />
      <ProcessSteps steps={steps} />
    </>
  );
}

function Packages({ slug }: { slug: ServiceDetailSlug }) {
  const t = useTranslations(`serviceDetails.${slug}.packages`);
  const tiers = t.raw("tiers") as PackageTier[];
  return (
    <>
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        className="mb-12"
      />
      <PackagesGrid
        tiers={tiers}
        priceLabel={t("priceLabel")}
        ctaLabel={t("ctaLabel")}
      />
    </>
  );
}

function FaqSection({ slug }: { slug: ServiceDetailSlug }) {
  const t = useTranslations(`serviceDetails.${slug}.faq`);
  const items = t.raw("items") as FaqItem[];
  return (
    <>
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} className="mb-12" />
      <Faq items={items} />
    </>
  );
}

function FinalCta({ slug }: { slug: ServiceDetailSlug }) {
  const t = useTranslations(`serviceDetails.${slug}.cta`);
  return (
    <CtaSection
      title={t("title")}
      subtitle={t("subtitle")}
      primaryCta={t("primaryCta")}
      primaryHref="/iletisim"
    />
  );
}

function WebsiteBuilder({ slug }: { slug: ServiceDetailSlug }) {
  const t = useTranslations(`serviceDetails.${slug}.websiteBuilder`);
  // CTA bilinçli olarak geçirilmiyor — bekleme listesi kurulunca eklenecek
  // (bkz. WebsiteBuilderTeaser içindeki kurul kararı notu).
  return (
    <WebsiteBuilderTeaser
      badge={t("badge")}
      title={t("title")}
      description={t("description")}
    />
  );
}
