import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/sections/section-heading";
import { ValuesGrid, type ValueItem } from "@/components/sections/values-grid";
import { MissionVisionGrid } from "@/components/sections/mission-vision";
import { CtaSection } from "@/components/sections/cta-section";
import { Reveal } from "@/components/motion/reveal";
import { absoluteUrl, localeAlternates } from "@/lib/seo";

const PATH = "/hakkimizda";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.hero" });

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: absoluteUrl(locale, PATH),
      languages: localeAlternates(PATH),
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16 sm:pt-32">
        <AboutHero />
      </section>
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <Story />
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <MissionVision />
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Values />
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <AboutCta />
      </section>
    </>
  );
}

function AboutHero() {
  const t = useTranslations("about.hero");
  return (
    <SectionHeading
      eyebrow={t("eyebrow")}
      title={t("title")}
      subtitle={t("subtitle")}
    />
  );
}

function Story() {
  const t = useTranslations("about.story");
  return (
    <Reveal className="text-center">
      <p className="mb-4 text-sm font-medium tracking-widest text-accent uppercase">
        {t("eyebrow")}
      </p>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {t("title")}
      </h2>
      <p className="mt-4 text-balance text-lg leading-relaxed text-muted-foreground">
        {t("body")}
      </p>
    </Reveal>
  );
}

function MissionVision() {
  const mission = useTranslations("about.mission");
  const vision = useTranslations("about.vision");

  return (
    <MissionVisionGrid
      items={[
        { id: "mission", title: mission("title"), body: mission("body") },
        { id: "vision", title: vision("title"), body: vision("body") },
      ]}
    />
  );
}

function Values() {
  const t = useTranslations("about.values");
  const items = t.raw("items") as ValueItem[];
  return (
    <>
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} className="mb-12" />
      <ValuesGrid items={items} />
    </>
  );
}

function AboutCta() {
  const t = useTranslations("about.cta");
  return (
    <CtaSection
      title={t("title")}
      subtitle={t("subtitle")}
      primaryCta={t("primaryCta")}
      primaryHref="/iletisim"
    />
  );
}
