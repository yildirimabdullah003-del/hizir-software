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
import { CodeEditor } from "@/components/sections/code-editor";
import { getSiteContact } from "@/lib/site-contact";
import { getStoredPricing } from "@/features/admin/pricing/data";
import type { PricingContent } from "@/features/admin/pricing/schema";
import { getStoredShowcase } from "@/features/admin/showcase/data";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Statik üretim için dili bildir (setRequestLocale, hook'lardan önce çağrılmalı).
  setRequestLocale(locale);

  // Fiyatlandırma + vitrin: panelde kaydedilmişse DB'den, yoksa koddaki
  // (messages) içerik.
  const [storedPricing, storedShowcase, messages, contact] = await Promise.all([
    getStoredPricing(locale),
    getStoredShowcase(locale),
    getMessages({ locale }),
    getSiteContact(),
  ]);
  const home = messages.home as Record<string, unknown>;
  const pricing = storedPricing ?? (home.pricing as PricingContent);
  const showcaseItems =
    storedShowcase?.items ??
    ((home.works as Record<string, unknown>).items as ShowcaseItem[]);

  return (
    <>
      {/* "Hakkımızda" ön izlemesi bilinçli olarak kaldırıldı (rafa kaldırma
          kararı) — kurumsal bilgi isteyen ziyaretçi WhatsApp hattını kullanır. */}
      <Hero />
      <Pricing content={pricing} whatsappNumber={contact.whatsappNumber} />
      <Works items={showcaseItems} />
      <ServicesPreview />
      <Process />
      <HomeFaq />
      <FinalCta />
    </>
  );
}

function Pricing({
  content,
  whatsappNumber,
}: {
  content: PricingContent;
  whatsappNumber: string;
}) {
  return (
    // Bölümler sert çizgiyle değil, eriyen gradyanlarla birbirine akar —
    // sayfa tek bir hikâye gibi ilerler (bkz. motion güncellemesi).
    <section
      id="fiyatlandirma"
      className="bg-gradient-to-b from-background via-background to-surface"
    >
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
          whatsappNumber={whatsappNumber}
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

function Works({ items }: { items: ShowcaseItem[] }) {
  const t = useTranslations("home.works");

  // Koyu atmosfer, blok DEĞİL: üstte surface'ten koyuya, altta koyudan
  // background'a UZUN gradyanlarla erir — kullanıcı "farklı dünyaya
  // süzüldüğünü" hisseder, renk duvarına çarpmaz (masterplan Sahne 2).
  return (
    <section
      style={{
        background:
          "linear-gradient(180deg, var(--color-surface) 0%, #10131c 22%, #10131c 78%, var(--color-background) 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-32">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          tone="inverted"
          className="mb-12"
        />
        <ShowcaseGallery items={items} demoBadge={t("demoBadge")} tone="inverted" />
        <div className="mt-10 text-center">
          <ButtonLink
            href="/calismalar"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
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
    <section className="bg-gradient-to-b from-background via-surface to-surface">
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

  // Kendi görsel dili: mini kod editörü — "böyle inşa ediyoruz" hissi
  // (masterplan Sahne 3). Editör görünürken satırlar bir kez yazılır.
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
            align="left"
            className="mx-0"
          />
          <CodeEditor />
        </div>
        <div className="mt-14">
          <ServicesGrid
            items={items.slice(0, 3)}
            showBullets={false}
            viewDetailsLabel={servicesT("viewDetails")}
          />
        </div>
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
    <section className="bg-background">
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
    <section className="bg-gradient-to-b from-surface to-background">
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
