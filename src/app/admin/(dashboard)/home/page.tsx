import { getMessages } from "next-intl/server";
import { requireRole } from "@/features/admin/auth/session";
import { getStoredHome } from "@/features/admin/home/data";
import type { HomeContent } from "@/features/admin/home/schema";
import { HomeForm } from "./home-form";

export const dynamic = "force-dynamic";

/** Kaydedilmiş içerik yoksa messages/*.json'dan varsayılanı kurar. */
async function effective(locale: "tr" | "en"): Promise<HomeContent> {
  const stored = await getStoredHome(locale);
  if (stored) return stored;

  const messages = await getMessages({ locale });
  const home = messages.home as Record<string, unknown>;
  const process = messages.process as Record<string, unknown>;
  const hero = home.hero as Record<string, string>;
  const faq = home.faq as Record<string, unknown>;
  const cta = home.cta as Record<string, string>;

  return {
    hero: {
      eyebrow: hero.eyebrow,
      title: hero.title,
      subtitle: hero.subtitle,
      primaryCta: hero.primaryCta,
      secondaryCta: hero.secondaryCta,
      caption: hero.caption,
    },
    process: {
      eyebrow: process.eyebrow as string,
      title: process.title as string,
      subtitle: process.subtitle as string,
      steps: process.steps as HomeContent["process"]["steps"],
    },
    faq: {
      eyebrow: faq.eyebrow as string,
      title: faq.title as string,
      subtitle: faq.subtitle as string,
      items: faq.items as HomeContent["faq"]["items"],
    },
    cta: {
      eyebrow: cta.eyebrow,
      title: cta.title,
      subtitle: cta.subtitle,
      primaryCta: cta.primaryCta,
    },
  };
}

export default async function AdminHomePage() {
  await requireRole("ADMIN");
  const [tr, en] = await Promise.all([effective("tr"), effective("en")]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Ana Sayfa</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Ana sayfadaki metinleri buradan düzenleyin — Hero, Süreç adımları, SSS
        ve kapanış çağrısı. Kaydettiğinizde sitede anında yansır. Türkçe ve
        İngilizce ayrı ayrı düzenlenir.
      </p>
      <HomeForm initialTr={tr} initialEn={en} />
    </div>
  );
}
