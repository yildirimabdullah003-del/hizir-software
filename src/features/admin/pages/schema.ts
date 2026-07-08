import { z } from "zod";

/**
 * PageTranslation.content için yazım-anı doğrulama şemaları.
 * src/types/service-detail.ts içindeki ServiceDetailContent sözleşmesinin
 * Zod karşılığı — render katmanı değişmeden içerik DB'den okunabilsin diye
 * şekil birebir korunur.
 */

const featureItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const packageTierSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  features: z.array(z.string().min(1)).min(1),
  highlighted: z.boolean().optional(),
});

const faqItemSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const serviceDetailContentSchema = z.object({
  hero: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    subtitle: z.string().min(1),
    primaryCta: z.string().min(1),
    secondaryCta: z.string().optional(),
  }),
  audience: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    subtitle: z.string().optional(),
    items: z.array(featureItemSchema).min(1),
  }),
  offerings: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    subtitle: z.string().optional(),
    items: z.array(featureItemSchema).min(1),
  }),
  packages: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    subtitle: z.string().optional(),
    priceLabel: z.string().min(1),
    ctaLabel: z.string().min(1),
    tiers: z.array(packageTierSchema).min(1),
  }),
  cta: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    primaryCta: z.string().min(1),
  }),
  websiteBuilder: z.object({
    badge: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    cta: z.string().min(1),
  }),
  faq: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    items: z.array(faqItemSchema).min(1),
  }),
});

export type ServiceDetailContentInput = z.infer<typeof serviceDetailContentSchema>;

/**
 * Sayfa tipi -> içerik şeması eşlemesi. Yeni yönetilebilir içerik türü
 * (blog-post, portfolio-item...) eklendiğinde buraya şeması eklenir;
 * editor ve data katmanı jenerik kalır.
 */
export const CONTENT_SCHEMAS: Record<string, z.ZodTypeAny> = {
  "service-detail": serviceDetailContentSchema,
};

export function validatePageContent(type: string, content: unknown) {
  const schema = CONTENT_SCHEMAS[type];
  if (!schema) {
    // Şeması tanımlanmamış tipler için yapı doğrulaması yapılmaz;
    // yine de en azından bir nesne olması beklenir.
    return z.record(z.string(), z.unknown()).safeParse(content);
  }
  return schema.safeParse(content);
}
