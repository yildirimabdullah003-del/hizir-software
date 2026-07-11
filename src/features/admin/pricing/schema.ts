import { z } from "zod";

/**
 * Ana sayfa fiyatlandırma bölümünün içerik şeması. Panelde düzenlenip
 * SiteSetting("pricing:tr" / "pricing:en") altında saklanır; ana sayfa
 * buradan okur, yoksa messages/*.json'daki koddaki içeriğe düşer.
 * Yapı, PricingProduct (pricing-grid.tsx) ile uyumludur.
 */
const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.string().min(1),
  listPrice: z.string().optional(),
  period: z.string().min(1),
  annualPrice: z.string().optional(),
  annualListPrice: z.string().optional(),
  setupPrice: z.string().optional(),
  description: z.string().min(1),
  features: z.array(z.string().min(1)).min(1),
  highlighted: z.boolean().optional(),
});

export const pricingContentSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  whatsappCta: z.string().min(1),
  whatsappMessage: z.string().min(1),
  popularBadge: z.string().min(1),
  setupNote: z.string().min(1),
  note: z.string().min(1),
  campaign: z.string().min(1),
  discountBadge: z.string().min(1),
  annualLabel: z.string().min(1),
  setupLabel: z.string().min(1),
  setupSuffix: z.string().min(1),
  products: z.array(productSchema).min(1),
});

export type PricingContent = z.infer<typeof pricingContentSchema>;
