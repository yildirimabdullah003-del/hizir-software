"use client";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import { savePricing, type SavePricingState } from "@/features/admin/pricing/actions";
import type { PricingContent } from "@/features/admin/pricing/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const input =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-fast focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/15";

type Locale = "tr" | "en";

export function PricingForm({
  initialTr,
  initialEn,
}: {
  initialTr: PricingContent;
  initialEn: PricingContent;
}) {
  const [activeLocale, setActiveLocale] = useState<Locale>("tr");
  const [drafts, setDrafts] = useState<Record<Locale, PricingContent>>({
    tr: initialTr,
    en: initialEn,
  });

  const draft = drafts[activeLocale];
  const setDraft = (updater: (c: PricingContent) => PricingContent) =>
    setDrafts((prev) => ({ ...prev, [activeLocale]: updater(prev[activeLocale]) }));

  return (
    <div className="mt-6">
      <div className="flex gap-1 border-b border-border" role="tablist">
        {(["tr", "en"] as Locale[]).map((loc) => (
          <button
            key={loc}
            role="tab"
            aria-selected={activeLocale === loc}
            onClick={() => setActiveLocale(loc)}
            className={cn(
              "rounded-t-md px-5 py-2.5 text-sm font-medium transition-colors",
              activeLocale === loc
                ? "border border-b-0 border-border bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {loc === "tr" ? "Türkçe" : "English"}
          </button>
        ))}
      </div>

      <LocaleForm
        key={activeLocale}
        locale={activeLocale}
        draft={draft}
        setDraft={setDraft}
      />
    </div>
  );
}

function LocaleForm({
  locale,
  draft,
  setDraft,
}: {
  locale: Locale;
  draft: PricingContent;
  setDraft: (updater: (c: PricingContent) => PricingContent) => void;
}) {
  const [state, formAction, pending] = useActionState<SavePricingState, FormData>(
    savePricing,
    {}
  );

  const setProduct = (i: number, patch: Partial<PricingContent["products"][number]>) =>
    setDraft((c) => {
      const products = c.products.map((p, idx) => (idx === i ? { ...p, ...patch } : p));
      return { ...c, products };
    });

  const setHighlighted = (i: number) =>
    setDraft((c) => ({
      ...c,
      products: c.products.map((p, idx) => ({ ...p, highlighted: idx === i })),
    }));

  return (
    <form action={formAction} className="mt-6 space-y-8">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="content" value={JSON.stringify(draft)} />

      {/* Genel alanlar */}
      <fieldset className="space-y-3 rounded-xl border border-border bg-background p-5">
        <legend className="px-1 text-sm font-semibold">Bölüm başlığı & kampanya</legend>
        <Labeled label="Başlık">
          <input
            className={input}
            value={draft.title}
            onChange={(e) => setDraft((c) => ({ ...c, title: e.target.value }))}
          />
        </Labeled>
        <Labeled label="Alt başlık">
          <input
            className={input}
            value={draft.subtitle}
            onChange={(e) => setDraft((c) => ({ ...c, subtitle: e.target.value }))}
          />
        </Labeled>
        <Labeled label="Kampanya bandı (boş bırakılırsa gösterilmez)">
          <input
            className={input}
            value={draft.campaign}
            onChange={(e) => setDraft((c) => ({ ...c, campaign: e.target.value }))}
            placeholder="Örn. İlk 15 müşteriye özel %30 indirim"
          />
        </Labeled>
        <Labeled label="İndirim rozeti (fiyatın yanında)">
          <input
            className={input}
            value={draft.discountBadge}
            onChange={(e) => setDraft((c) => ({ ...c, discountBadge: e.target.value }))}
          />
        </Labeled>
        <Labeled label="Alt not">
          <textarea
            className={input}
            rows={2}
            value={draft.note}
            onChange={(e) => setDraft((c) => ({ ...c, note: e.target.value }))}
          />
        </Labeled>
      </fieldset>

      {/* Ürünler */}
      {draft.products.map((p, i) => (
        <fieldset
          key={p.id}
          className={cn(
            "space-y-3 rounded-xl border p-5",
            p.highlighted ? "border-accent/50 bg-surface" : "border-border bg-background"
          )}
        >
          <legend className="px-1 text-sm font-semibold">{p.name || p.id}</legend>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="highlighted-radio"
              checked={!!p.highlighted}
              onChange={() => setHighlighted(i)}
            />
            &quot;En çok tercih edilen&quot; rozeti bu pakette
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <Labeled label="Paket adı">
              <input
                className={input}
                value={p.name}
                onChange={(e) => setProduct(i, { name: e.target.value })}
              />
            </Labeled>
            <Labeled label="Dönem (ör. /ay)">
              <input
                className={input}
                value={p.period}
                onChange={(e) => setProduct(i, { period: e.target.value })}
              />
            </Labeled>
            <Labeled label="Liste fiyatı (çizili, opsiyonel)">
              <input
                className={input}
                value={p.listPrice ?? ""}
                onChange={(e) => setProduct(i, { listPrice: e.target.value || undefined })}
                placeholder="₺500"
              />
            </Labeled>
            <Labeled label="Aylık fiyat (büyük gösterilen)">
              <input
                className={input}
                value={p.price}
                onChange={(e) => setProduct(i, { price: e.target.value })}
                placeholder="₺350"
              />
            </Labeled>
            <Labeled label="Yıllık liste (çizili, opsiyonel)">
              <input
                className={input}
                value={p.annualListPrice ?? ""}
                onChange={(e) =>
                  setProduct(i, { annualListPrice: e.target.value || undefined })
                }
              />
            </Labeled>
            <Labeled label="Yıllık fiyat (opsiyonel)">
              <input
                className={input}
                value={p.annualPrice ?? ""}
                onChange={(e) => setProduct(i, { annualPrice: e.target.value || undefined })}
              />
            </Labeled>
            <Labeled label="Kurulum ücreti (opsiyonel)">
              <input
                className={input}
                value={p.setupPrice ?? ""}
                onChange={(e) => setProduct(i, { setupPrice: e.target.value || undefined })}
              />
            </Labeled>
          </div>

          <Labeled label="Kısa açıklama">
            <input
              className={input}
              value={p.description}
              onChange={(e) => setProduct(i, { description: e.target.value })}
            />
          </Labeled>

          <FeatureList
            features={p.features}
            onChange={(features) => setProduct(i, { features })}
          />
        </fieldset>
      ))}

      <div className="sticky bottom-0 flex items-center gap-4 border-t border-border bg-surface/95 py-4 backdrop-blur">
        <Button type="submit" disabled={pending}>
          {pending ? "Kaydediliyor..." : "Kaydet"}
        </Button>
        {state.error ? (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className="text-sm text-emerald-700">Kaydedildi ✓ Sitede yansıdı.</p>
        ) : null}
      </div>
    </form>
  );
}

function FeatureList({
  features,
  onChange,
}: {
  features: string[];
  onChange: (f: string[]) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">Özellikler</p>
      <div className="space-y-2">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className={input}
              value={f}
              onChange={(e) => {
                const next = [...features];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              aria-label="Özelliği kaldır"
              onClick={() => onChange(features.filter((_, idx) => idx !== i))}
              className="shrink-0 rounded-md border border-border p-2 text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...features, ""])}
        className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
      >
        <Plus className="h-3.5 w-3.5" /> Özellik ekle
      </button>
    </div>
  );
}

function Labeled({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
