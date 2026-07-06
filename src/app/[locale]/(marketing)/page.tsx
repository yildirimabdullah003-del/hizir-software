import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button-link";
import { Hero } from "@/components/sections/hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServicesGrid, type ServiceItem } from "@/components/sections/services-grid";
import { ProcessSteps, type ProcessStep } from "@/components/sections/process-steps";
import { CtaSection } from "@/components/sections/cta-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Statik üretim için dili bildir (setRequestLocale, hook'lardan önce çağrılmalı).
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ServicesPreview />
      <Process />
      <AboutPreview />
      <FinalCta />
    </>
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

function AboutPreview() {
  const t = useTranslations("home.about");

  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="mb-4 text-sm font-medium tracking-widest text-accent uppercase">
          {t("eyebrow")}
        </p>
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-4 text-balance text-lg text-muted-foreground">
          {t("body")}
        </p>
        <div className="mt-8">
          <ButtonLink href="/hakkimizda" variant="outline">
            {t("cta")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  const t = useTranslations("home.cta");

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <CtaSection
          title={t("title")}
          subtitle={t("subtitle")}
          primaryCta={t("primaryCta")}
          primaryHref="/iletisim"
          secondaryCta={t("secondaryCta")}
          secondaryHref="/hizmetler"
        />
      </div>
    </section>
  );
}
