import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/sections/section-heading";
import { ContactForm } from "@/components/sections/contact-form";
import { ContactInfo } from "@/components/sections/contact-info";
import { siteConfig } from "@/config/site";
import { absoluteUrl, localeAlternates } from "@/lib/seo";

// Katlanan alanın altında, dekoratif bir blok — ana JS paketinden ayrı bir
// chunk'a alınır ki form/CTA'nın ilk yüklemesi bundan etkilenmesin.
const MapPanel = dynamic(() =>
  import("@/components/sections/map-panel").then((mod) => mod.MapPanel)
);

const PATH = "/iletisim";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.hero" });

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: absoluteUrl(locale, PATH),
      languages: localeAlternates(PATH),
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="mx-auto max-w-6xl px-6 pt-24 pb-24 sm:pt-32">
      <ContactHero />
      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_22rem]">
        <ContactForm />
        <ContactInfoSection />
      </div>
      <div className="mt-16">
        <MapSection />
      </div>
    </section>
  );
}

function ContactHero() {
  const t = useTranslations("contact.hero");
  return (
    <SectionHeading
      eyebrow={t("eyebrow")}
      title={t("title")}
      subtitle={t("subtitle")}
    />
  );
}

function ContactInfoSection() {
  const t = useTranslations("contact.info");
  return (
    <ContactInfo
      title={t("title")}
      email={siteConfig.contactEmail}
      note={t("note")}
      processTitle={t("processTitle")}
      processBody={t("processBody")}
    />
  );
}

function MapSection() {
  const t = useTranslations("contact.map");
  return <MapPanel title={t("title")} body={t("body")} />;
}
