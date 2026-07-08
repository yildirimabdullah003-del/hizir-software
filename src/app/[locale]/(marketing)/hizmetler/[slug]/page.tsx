import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { Locale } from "@prisma/client";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServiceHero } from "@/components/sections/service-hero";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { ProcessSteps, type ProcessStep } from "@/components/sections/process-steps";
import { PackagesGrid } from "@/components/sections/packages-grid";
import { Faq } from "@/components/sections/faq";
import { CtaSection } from "@/components/sections/cta-section";
import { WebsiteBuilderTeaser } from "@/components/sections/website-builder-teaser";
import { WebsiteDemo, QrMenuDemo } from "@/components/sections/showcase-gallery";
import { SERVICE_DETAIL_SLUGS, isServiceDetailSlug, type ServiceDetailSlug } from "@/config/services";
import type { ServiceDetailContent } from "@/types/service-detail";
import { getPublishedPageContent } from "@/features/admin/pages/data";
import { serviceDetailContentSchema } from "@/features/admin/pages/schema";
import { absoluteUrl, localeAlternates } from "@/lib/seo";
import * as kurumsalWebSiteleri from "@/content/services/kurumsal-web-siteleri";
import * as dijitalUrunGelistirme from "@/content/services/dijital-urun-gelistirme";
import * as eTicaretCozumleri from "@/content/services/e-ticaret-cozumleri";
import * as markaTasarimSistemi from "@/content/services/marka-tasarim-sistemi";
import * as bakimPerformansSeo from "@/content/services/bakim-performans-seo";
import * as danismanlikTeknikStrateji from "@/content/services/danismanlik-teknik-strateji";

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
 * metinler i18n mesajlarından veya (admin panelde düzenlendiyse) DB'den gelir.
 */
function getServiceIcons(slug: ServiceDetailSlug): {
  audienceIcons: Record<string, string>;
  offeringIcons: Record<string, string>;
} {
  switch (slug) {
    case "kurumsal-web-siteleri":
      return kurumsalWebSiteleri;
    case "dijital-urun-gelistirme":
      return dijitalUrunGelistirme;
    case "e-ticaret-cozumleri":
      return eTicaretCozumleri;
    case "marka-tasarim-sistemi":
      return markaTasarimSistemi;
    case "bakim-performans-seo":
      return bakimPerformansSeo;
    case "danismanlik-teknik-strateji":
      return danismanlikTeknikStrateji;
  }
}

type LoadedContent = {
  content: ServiceDetailContent;
  seoTitle: string | null;
  seoDescription: string | null;
};

/**
 * İçerik stratejisi (hibrit, bkz. plan): admin panelde kaydedilmiş ve
 * yayında bir çeviri varsa DB kazanır; yoksa (veya DB'ye ulaşılamazsa)
 * messages/*.json'daki koddaki içerik kullanılır. Böylece site DB olmadan
 * da tamamen çalışır — panel, üzerine yazma katmanıdır.
 */
async function loadContent(
  locale: string,
  slug: ServiceDetailSlug
): Promise<LoadedContent> {
  try {
    const row = await getPublishedPageContent(
      "service-detail",
      slug,
      locale as Locale
    );
    if (row) {
      const parsed = serviceDetailContentSchema.safeParse(row.content);
      if (parsed.success) {
        return {
          content: parsed.data as ServiceDetailContent,
          seoTitle: row.seoTitle,
          seoDescription: row.seoDescription,
        };
      }
      console.error(
        `[service-detail] DB içeriği şemaya uymuyor (${slug}/${locale}); mesaj dosyasına düşülüyor.`
      );
    }
  } catch {
    // DB yok/ulaşılamaz — beklenen kurulum-öncesi durum, sessizce düş.
  }

  const messages = await getMessages({ locale });
  const node = (messages.serviceDetails as Record<string, unknown>)[slug];
  return { content: node as ServiceDetailContent, seoTitle: null, seoDescription: null };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isServiceDetailSlug(slug)) return {};

  const { content, seoTitle, seoDescription } = await loadContent(locale, slug);
  const path = `/hizmetler/${slug}`;

  return {
    title: seoTitle ?? content.hero.title,
    description: seoDescription ?? content.hero.subtitle,
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
  const { content } = await loadContent(locale, slug);

  return (
    <>
      <ServiceHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        primaryCta={content.hero.primaryCta}
        secondaryCta={content.hero.secondaryCta}
      />
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <SectionHeading
          eyebrow={content.audience.eyebrow}
          title={content.audience.title}
          subtitle={content.audience.subtitle}
          className="mb-12"
        />
        <FeatureGrid
          items={content.audience.items}
          icons={icons.audienceIcons}
          columns={4}
        />
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <SectionHeading
          eyebrow={content.offerings.eyebrow}
          title={content.offerings.title}
          subtitle={content.offerings.subtitle}
          className="mb-12"
        />
        <FeatureGrid
          items={content.offerings.items}
          icons={icons.offeringIcons}
          columns={3}
        />
      </section>
      {/* Örnek görünüm — şimdilik yalnızca web sitesi hizmetinde; diğer
          hizmetlere kendi demoları hazırlandıkça açılır. */}
      {slug === "kurumsal-web-siteleri" ? <DemoPreview /> : null}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Process />
        </div>
      </section>
      <section id="paketler" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
        <SectionHeading
          eyebrow={content.packages.eyebrow}
          title={content.packages.title}
          subtitle={content.packages.subtitle}
          className="mb-12"
        />
        <PackagesGrid
          tiers={content.packages.tiers}
          priceLabel={content.packages.priceLabel}
          ctaLabel={content.packages.ctaLabel}
        />
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <SectionHeading
          eyebrow={content.faq.eyebrow}
          title={content.faq.title}
          className="mb-12"
        />
        <Faq items={content.faq.items} />
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <CtaSection
          title={content.cta.title}
          subtitle={content.cta.subtitle}
          primaryCta={content.cta.primaryCta}
          primaryHref="/iletisim"
        />
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        {/* CTA bilinçli olarak geçirilmiyor — bekleme listesi kurulunca
            eklenecek (bkz. WebsiteBuilderTeaser içindeki kurul kararı notu). */}
        <WebsiteBuilderTeaser
          badge={content.websiteBuilder.badge}
          title={content.websiteBuilder.title}
          description={content.websiteBuilder.description}
        />
      </section>
    </>
  );
}

function DemoPreview() {
  const t = useTranslations("serviceDemo");
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        className="mb-12"
      />
      <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
        <WebsiteDemo />
        <div className="flex justify-center">
          <QrMenuDemo />
        </div>
      </div>
    </section>
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
