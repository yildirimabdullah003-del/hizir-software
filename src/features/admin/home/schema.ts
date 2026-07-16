import { z } from "zod";

/**
 * Ana sayfa editoryal içeriği — panelden düzenlenebilir (V3). Hero, Süreç,
 * SSS ve Final CTA metinlerini kapsar. Kaydedilmemişse public sayfa
 * messages/*.json'a düşer (regresyon yok). Fiyat/vitrin ile aynı desen.
 */

const nonEmpty = (label: string) => z.string().trim().min(1, `${label} boş olamaz`);

export const heroContentSchema = z.object({
  eyebrow: nonEmpty("Üst etiket"),
  title: nonEmpty("Başlık"),
  subtitle: nonEmpty("Alt başlık"),
  primaryCta: nonEmpty("Birincil buton"),
  secondaryCta: nonEmpty("İkincil buton"),
  caption: nonEmpty("Alt not"),
});

export const stepSchema = z.object({
  id: z.string().min(1),
  title: nonEmpty("Adım başlığı"),
  description: nonEmpty("Adım açıklaması"),
});

export const processContentSchema = z.object({
  eyebrow: nonEmpty("Üst etiket"),
  title: nonEmpty("Başlık"),
  subtitle: nonEmpty("Alt başlık"),
  steps: z.array(stepSchema).min(1).max(6),
});

export const faqItemSchema = z.object({
  id: z.string().min(1),
  question: nonEmpty("Soru"),
  answer: nonEmpty("Cevap"),
});

export const faqContentSchema = z.object({
  eyebrow: nonEmpty("Üst etiket"),
  title: nonEmpty("Başlık"),
  subtitle: nonEmpty("Alt başlık"),
  items: z.array(faqItemSchema).min(1).max(12),
});

export const ctaContentSchema = z.object({
  eyebrow: nonEmpty("Üst etiket"),
  title: nonEmpty("Başlık"),
  subtitle: nonEmpty("Alt başlık"),
  primaryCta: nonEmpty("Buton"),
});

export const homeContentSchema = z.object({
  hero: heroContentSchema,
  process: processContentSchema,
  faq: faqContentSchema,
  cta: ctaContentSchema,
});

export type HeroContent = z.infer<typeof heroContentSchema>;
export type ProcessContent = z.infer<typeof processContentSchema>;
export type FaqContent = z.infer<typeof faqContentSchema>;
export type CtaContent = z.infer<typeof ctaContentSchema>;
export type HomeContent = z.infer<typeof homeContentSchema>;
