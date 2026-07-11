import { getMessages } from "next-intl/server";
import { requireRole } from "@/features/admin/auth/session";
import { getStoredPricing } from "@/features/admin/pricing/data";
import type { PricingContent } from "@/features/admin/pricing/schema";
import { PricingForm } from "./pricing-form";

export const dynamic = "force-dynamic";

async function effective(locale: "tr" | "en"): Promise<PricingContent> {
  const stored = await getStoredPricing(locale);
  if (stored) return stored;
  const messages = await getMessages({ locale });
  return (messages.home as Record<string, unknown>).pricing as PricingContent;
}

export default async function AdminPricingPage() {
  await requireRole("ADMIN");
  const [tr, en] = await Promise.all([effective("tr"), effective("en")]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Fiyatlandırma</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Ana sayfadaki fiyat kartlarını buradan düzenleyin. Kaydettiğinizde
        sitede anında yansır. Türkçe ve İngilizce ayrı ayrı düzenlenir.
      </p>
      <PricingForm initialTr={tr} initialEn={en} />
    </div>
  );
}
