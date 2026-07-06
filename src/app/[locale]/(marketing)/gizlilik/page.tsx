import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { absoluteUrl, localeAlternates } from "@/lib/seo";

const PATH = "/gizlilik";

type PrivacySection = { id: string; heading: string; body: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      canonical: absoluteUrl(locale, PATH),
      languages: localeAlternates(PATH),
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "privacy" });
  const sections = t.raw("sections") as PrivacySection[];

  return (
    <section className="mx-auto max-w-3xl px-6 pt-24 pb-24 sm:pt-32">
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("lastUpdated")}</p>
      <p className="mt-6 text-base leading-relaxed text-muted-foreground">
        {t("intro")}
      </p>
      <div className="mt-10 flex flex-col gap-8">
        {sections.map((section) => (
          <div key={section.id}>
            <h2 className="text-lg font-semibold tracking-tight">
              {section.heading}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {section.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
