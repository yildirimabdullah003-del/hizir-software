import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/sections/section-heading";
import {
  ShowcaseGallery,
  type ShowcaseItem,
} from "@/components/sections/showcase-gallery";
import { CtaSection } from "@/components/sections/cta-section";
import { absoluteUrl, localeAlternates } from "@/lib/seo";
import { getStoredShowcase } from "@/features/admin/showcase/data";

const PATH = "/calismalar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.works" });

  return {
    title: t("pageTitle"),
    description: t("pageSubtitle"),
    alternates: {
      canonical: absoluteUrl(locale, PATH),
      languages: localeAlternates(PATH),
    },
  };
}

export default async function WorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Vitrin: panelde kaydedilmişse DB'den, yoksa koddaki (messages) içerik.
  const stored = await getStoredShowcase(locale);

  return (
    <section className="mx-auto max-w-6xl px-6 pt-24 pb-24 sm:pt-32">
      <Gallery storedItems={stored?.items ?? null} />
      <div className="mt-20">
        <FinalCta />
      </div>
    </section>
  );
}

function Gallery({ storedItems }: { storedItems: ShowcaseItem[] | null }) {
  const t = useTranslations("home.works");
  const items = storedItems ?? (t.raw("items") as ShowcaseItem[]);
  return (
    <>
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
        className="mb-12"
      />
      <ShowcaseGallery items={items} demoBadge={t("demoBadge")} />
    </>
  );
}

function FinalCta() {
  const t = useTranslations("home.cta");
  return (
    <CtaSection
      compact
      title={t("title")}
      subtitle={t("subtitle")}
      primaryCta={t("primaryCta")}
      primaryHref="/iletisim"
    />
  );
}
