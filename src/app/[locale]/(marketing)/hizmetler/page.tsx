import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServicesGrid, type ServiceItem } from "@/components/sections/services-grid";
import { CtaSection } from "@/components/sections/cta-section";
import { absoluteUrl, localeAlternates } from "@/lib/seo";

const PATH = "/hizmetler";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.hero" });

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: absoluteUrl(locale, PATH),
      languages: localeAlternates(PATH),
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16 sm:pt-32">
        <ServicesHero />
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <ServicesList />
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <ServicesCta />
      </section>
    </>
  );
}

function ServicesHero() {
  const t = useTranslations("services.hero");
  return (
    <SectionHeading
      eyebrow={t("eyebrow")}
      title={t("title")}
      subtitle={t("subtitle")}
    />
  );
}

function ServicesList() {
  const t = useTranslations("services");
  const items = t.raw("items") as ServiceItem[];
  return <ServicesGrid items={items} viewDetailsLabel={t("viewDetails")} />;
}

function ServicesCta() {
  const t = useTranslations("services.cta");
  return (
    <CtaSection
      title={t("title")}
      subtitle={t("subtitle")}
      primaryCta={t("primaryCta")}
      primaryHref="/iletisim"
    />
  );
}
