"use client";

import { useActionState, useState } from "react";
import {
  savePageTranslation,
  type SavePageState,
} from "@/features/admin/pages/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Jenerik içerik editörü: JSON içerik ağacını gezer, string yapraklarını
 * form alanı olarak sunar. Yapı (bölümler, madde sayıları, id'ler) sabittir
 * — iş sahibi metinleri değiştirir, geliştirici yapıyı kodda değiştirir.
 * Bu sınır bilinçlidir: yapı değişikliği tasarım/SEO kararıdır.
 */

type TranslationDraft = {
  content: Record<string, unknown>;
  seoTitle: string;
  seoDescription: string;
};

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-fast focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/15";

// Uzun metin beklenen alan adları — textarea ile gösterilir.
const LONG_TEXT_KEYS = new Set([
  "description",
  "subtitle",
  "answer",
  "body",
]);

// Teknik alanlar — formda gösterilmez, değerleri aynen korunur.
const HIDDEN_KEYS = new Set(["id", "highlighted"]);

const SECTION_LABELS: Record<string, string> = {
  hero: "Giriş (Hero)",
  audience: "Kimler İçin",
  offerings: "Kapsam",
  packages: "Paketler",
  cta: "Alt Çağrı (CTA)",
  websiteBuilder: "Website Builder Tanıtımı",
  faq: "Sık Sorulan Sorular",
  eyebrow: "Üst etiket",
  title: "Başlık",
  subtitle: "Alt başlık",
  description: "Açıklama",
  primaryCta: "Ana buton",
  secondaryCta: "İkincil buton",
  items: "Maddeler",
  tiers: "Paketler",
  features: "Özellikler",
  priceLabel: "Fiyat etiketi",
  ctaLabel: "Buton etiketi",
  name: "Ad",
  question: "Soru",
  answer: "Yanıt",
  badge: "Rozet",
};

function labelFor(key: string): string {
  return SECTION_LABELS[key] ?? key;
}

function setAtPath(
  obj: unknown,
  path: (string | number)[],
  value: unknown
): unknown {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(obj)) {
    const copy = [...obj];
    copy[head as number] = setAtPath(copy[head as number], rest, value);
    return copy;
  }
  const record = { ...(obj as Record<string, unknown>) };
  record[head as string] = setAtPath(record[head as string], rest, value);
  return record;
}

function Field({
  value,
  path,
  fieldKey,
  onChange,
}: {
  value: unknown;
  path: (string | number)[];
  fieldKey: string;
  onChange: (path: (string | number)[], value: unknown) => void;
}) {
  if (HIDDEN_KEYS.has(fieldKey)) return null;

  if (typeof value === "string") {
    const long = LONG_TEXT_KEYS.has(fieldKey) || value.length > 90;
    return (
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          {labelFor(fieldKey)}
        </label>
        {long ? (
          <textarea
            value={value}
            rows={Math.min(6, Math.max(2, Math.ceil(value.length / 90)))}
            onChange={(e) => onChange(path, e.target.value)}
            className={inputClass}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(path, e.target.value)}
            className={inputClass}
          />
        )}
      </div>
    );
  }

  if (Array.isArray(value)) {
    // String dizisi (özellik listeleri): satır satır düzenlenir.
    if (value.every((v) => typeof v === "string")) {
      return (
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            {labelFor(fieldKey)}
          </label>
          <div className="space-y-2">
            {value.map((item, i) => (
              <input
                key={i}
                type="text"
                value={item as string}
                onChange={(e) => onChange([...path, i], e.target.value)}
                className={inputClass}
              />
            ))}
          </div>
        </div>
      );
    }
    // Nesne dizisi (maddeler, paketler, SSS).
    return (
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {labelFor(fieldKey)}
        </p>
        <div className="space-y-3">
          {value.map((item, i) => (
            <div
              key={i}
              className="space-y-3 rounded-lg border border-border bg-surface p-4"
            >
              {Object.entries(item as Record<string, unknown>).map(
                ([k, v]) => (
                  <Field
                    key={k}
                    fieldKey={k}
                    value={v}
                    path={[...path, i, k]}
                    onChange={onChange}
                  />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (value !== null && typeof value === "object") {
    return (
      <div className="space-y-3">
        {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
          <Field
            key={k}
            fieldKey={k}
            value={v}
            path={[...path, k]}
            onChange={onChange}
          />
        ))}
      </div>
    );
  }

  return null;
}

function LocaleForm({
  pageId,
  locale,
  draft,
  onDraftChange,
}: {
  pageId: string;
  locale: "tr" | "en";
  draft: TranslationDraft;
  onDraftChange: (draft: TranslationDraft) => void;
}) {
  const [state, formAction, pending] = useActionState<SavePageState, FormData>(
    savePageTranslation,
    {}
  );

  const handleChange = (path: (string | number)[], value: unknown) => {
    onDraftChange({
      ...draft,
      content: setAtPath(draft.content, path, value) as Record<string, unknown>,
    });
  };

  return (
    <form action={formAction} className="mt-6 space-y-8">
      <input type="hidden" name="pageId" value={pageId} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="content" value={JSON.stringify(draft.content)} />

      <fieldset className="space-y-3 rounded-xl border border-border bg-background p-5">
        <legend className="px-1 text-sm font-semibold">SEO</legend>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            SEO Başlığı (boşsa sayfa başlığı kullanılır)
          </label>
          <input
            type="text"
            name="seoTitle"
            value={draft.seoTitle}
            onChange={(e) =>
              onDraftChange({ ...draft, seoTitle: e.target.value })
            }
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            SEO Açıklaması
          </label>
          <textarea
            name="seoDescription"
            rows={2}
            value={draft.seoDescription}
            onChange={(e) =>
              onDraftChange({ ...draft, seoDescription: e.target.value })
            }
            className={inputClass}
          />
        </div>
      </fieldset>

      {Object.entries(draft.content).map(([sectionKey, sectionValue]) => (
        <fieldset
          key={sectionKey}
          className="space-y-3 rounded-xl border border-border bg-background p-5"
        >
          <legend className="px-1 text-sm font-semibold">
            {labelFor(sectionKey)}
          </legend>
          <Field
            fieldKey={sectionKey}
            value={sectionValue}
            path={[sectionKey]}
            onChange={handleChange}
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
          <p className="text-sm text-emerald-700">Kaydedildi ✓</p>
        ) : null}
      </div>
    </form>
  );
}

export function PageEditor({
  pageId,
  translations,
}: {
  pageId: string;
  translations: Record<string, TranslationDraft>;
}) {
  const [activeLocale, setActiveLocale] = useState<"tr" | "en">("tr");
  const [drafts, setDrafts] = useState<Record<string, TranslationDraft>>(
    translations
  );

  const locales: ("tr" | "en")[] = ["tr", "en"];
  const draft = drafts[activeLocale];

  return (
    <div className="mt-6">
      <div className="flex gap-1 border-b border-border" role="tablist">
        {locales.map((loc) => (
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
            {!drafts[loc] ? " (içerik yok)" : ""}
          </button>
        ))}
      </div>

      {draft ? (
        <LocaleForm
          key={activeLocale}
          pageId={pageId}
          locale={activeLocale}
          draft={draft}
          onDraftChange={(d) =>
            setDrafts((prev) => ({ ...prev, [activeLocale]: d }))
          }
        />
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Bu dil için içerik henüz oluşturulmamış. Seed komutu mevcut site
          içeriğini panele aktarır: <code>npm run db:seed</code>
        </p>
      )}
    </div>
  );
}
