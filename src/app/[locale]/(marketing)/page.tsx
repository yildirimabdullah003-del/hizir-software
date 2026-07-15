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
import { FinalScene } from "@/components/sections/final-scene";
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
  // Final sahnesi client bileşeni — çeviri metinlerini prop olarak geçiriyoruz.
  const cta = home.cta as {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
  };
  const {
    eyebrow: ctaEyebrow,
    title: ctaTitle,
    subtitle: ctaSubtitle,
    primaryCta: ctaPrimary,
  } = cta;

  return (
    <>
      {/* Hikaye-önde akış (V3): önce ürünü yaşat, sonra fiyat. Atmosfer yayı:
          Hero (açık şafak) → Çalışmalar (koyu zirve) → Hizmetler/Süreç (açık
          atölye) → Fiyat (en parlak, güven) → SSS (nefes) → Final (koyu doruk).
          Bölümler uzun gradyanlarla birbirine erir; sert çizgi yok. */}
      <Hero />
      <Works items={showcaseItems} />
      <ServicesPreview />
      <Process />
      <Pricing content={pricing} whatsappNumber={contact.whatsappNumber} />
      <HomeFaq />
      <FinalScene
        eyebrow={ctaEyebrow}
        title={ctaTitle}
        subtitle={ctaSubtitle}
        primaryCta={ctaPrimary}
      />
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
    // En parlak/en sade bölüm (V3: güven = netlik). Süreç'in surface'inden
    // aydınlığa erir; altta SSS'e devreder.
    <section
      id="fiyatlandirma"
      className="bg-gradient-to-b from-surface via-background to-background"
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

  // Sinematik koyu zirve (V3 Sahne 2): sayfanın "vay be" tepesi. Açık
  // Hero'dan uzun gradyanla koyuya süzülür, altta yine açığa döner — blok
  // değil erime. Arkada ölçülü bir accent ışıması sahneyi "kontrol odası"
  // atmosferine sokar.
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--color-background) 0%, #0a0c14 20%, #0a0c14 80%, var(--color-background) 100%)",
      }}
    >
      {/* Ambient accent ışıması + ince yıldız dokusu */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 18%, transparent) 0%, transparent 60%)",
          filter: "blur(70px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 75% 55% at 50% 50%, black 5%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 55% at 50% 50%, black 5%, transparent 72%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6 py-36">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          tone="inverted"
          className="mb-12"
        />
        <ShowcaseGallery items={items} demoBadge={t("demoBadge")} tone="inverted" />
        <div className="mt-12 text-center">
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
    <section className="bg-gradient-to-b from-background to-surface">
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

