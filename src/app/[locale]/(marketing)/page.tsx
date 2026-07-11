import { useTranslations } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button-link";
import { Hero } from "@/components/sections/hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServicesGrid, type ServiceItem } from "@/components/sections/services-grid";
import { PricingGrid } from "@/components/sections/pricing-grid";
import { ShowcaseGallery, type ShowcaseItem } from "@/components/sections/showcase-gallery";
import { Faq, type FaqItem } from "@/components/sections/faq";
import { ProcessSteps, type ProcessStep } from "@/components/sections/process-steps";
import { CtaSection } from "@/components/sections/cta-section";
import { siteConfig } from "@/config/site";
import { getStoredPricing } from "@/features/admin/pricing/data";
import type { PricingContent } from "@/features/admin/pricing/schema";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Statik üretim için dili bildir (setRequestLocale, hook'lardan önce çağrılmalı).
  setRequestLocale(locale);

  // Fiyatlandırma: panelde kaydedilmişse DB'den, yoksa koddaki (messages) içerik.
  const stored = await getStoredPricing(locale);
  const messages = await getMessages({ locale });
  const pricing =
    stored ?? ((messages.home as Record<string, unknown>).pricing as PricingContent);

  return (
    <>
      {/* "Hakkımızda" ön izlemesi bilinçli olarak kaldırıldı (rafa kaldırma
          kararı) — kurumsal bilgi isteyen ziyaretçi WhatsApp hattını kullanır. */}
      <Hero />
      <Pricing content={pricing} />
      <Works />
      <ServicesPreview />
      <Process />
      <HomeFaq />
      <FinalCta />
    </>
  );
}

function Pricing({ content }: { content: PricingContent }) {
  return (
    <section id="fiyatlandirma" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          subtitle={content.subtitle}
          className="mb-6"
        />
        {/* Kampanya bandı — kampanya metni boşsa gösterilmez. Panelden
            (Admin > Fiyatlandırma) düzenlenir. */}
        {content.campaign ? (
          <p className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
              🎉 {content.campaign}
            </span>
          </p>
        ) : (
          <div className="mb-12" />
        )}
        <PricingGrid
          products={content.products}
          whatsappNumber={siteConfig.whatsappNumber}
          whatsappCtaLabel={content.whatsappCta}
          whatsappMessage={content.whatsappMessage}
          popularLabel={content.popularBadge}
          setupNote={content.setupNote}
          discountBadge={content.discountBadge}
          annualLabel={content.annualLabel}
          setupLabel={content.setupLabel}
          setupSuffix={content.setupSuffix}
        />
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {content.note}
        </p>
      </div>
    </section>
  );
}

function Works() {
  const t = useTranslations("home.works");
  const items = t.raw("items") as ShowcaseItem[];

  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-12"
        />
        <ShowcaseGallery items={items} demoBadge={t("demoBadge")} />
        <div className="mt-10 text-center">
          <ButtonLink href="/calismalar" variant="outline">
            {t("cta")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function HomeFaq() {
  const t = useTranslations("home.faq");
  const items = t.raw("items") as FaqItem[];

  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-12"
        />
        <Faq items={items} />
      </div>
    </section>
  );
}

function ServicesPreview() {
  const t = useTranslations("home.services");
  const servicesT = useTranslations("services");
  const items = servicesT.raw("items") as ServiceItem[];

  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-12"
        />
        <ServicesGrid
          items={items.slice(0, 3)}
          showBullets={false}
          viewDetailsLabel={servicesT("viewDetails")}
        />
        <div className="mt-10 text-center">
          <ButtonLink href="/hizmetler" variant="outline">
            {t("cta")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as ProcessStep[];

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-16"
        />
        <ProcessSteps steps={steps} />
      </div>
    </section>
  );
}

function FinalCta() {
  const t = useTranslations("home.cta");

  // Fiyat vitrini asıl odak olduğundan bu bölüm bilinçli olarak kompakt.
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <CtaSection
          compact
          title={t("title")}
          subtitle={t("subtitle")}
          primaryCta={t("primaryCta")}
          primaryHref="/iletisim"
        />
      </div>
    </section>
  );
}
