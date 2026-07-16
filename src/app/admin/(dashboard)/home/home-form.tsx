"use client";

import { useState, useActionState } from "react";
import { cn } from "@/lib/utils";
import { saveHome, type SaveHomeState } from "@/features/admin/home/actions";
import type { HomeContent } from "@/features/admin/home/schema";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-fast focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/15";

type Locale = "tr" | "en";

/**
 * Ana sayfa içerik formu. TR/EN sekmeleri; her sekmede Hero, Süreç, SSS ve
 * Final CTA blokları. Kaydet iki dilin içeriğini tek seferde gönderir.
 */
export function HomeForm({
  initialTr,
  initialEn,
}: {
  initialTr: HomeContent;
  initialEn: HomeContent;
}) {
  const [tr, setTr] = useState(initialTr);
  const [en, setEn] = useState(initialEn);
  const [tab, setTab] = useState<Locale>("tr");
  const [state, formAction, pending] = useActionState<SaveHomeState, FormData>(
    saveHome,
    {}
  );

  const data = tab === "tr" ? tr : en;
  const setData = tab === "tr" ? setTr : setEn;

  // Genel amaçlı, tip-güvenli iç güncelleyiciler.
  function setHero(field: keyof HomeContent["hero"], val: string) {
    setData((p) => ({ ...p, hero: { ...p.hero, [field]: val } }));
  }
  function setCta(field: keyof HomeContent["cta"], val: string) {
    setData((p) => ({ ...p, cta: { ...p.cta, [field]: val } }));
  }
  function setProcessMeta(field: "eyebrow" | "title" | "subtitle", val: string) {
    setData((p) => ({ ...p, process: { ...p.process, [field]: val } }));
  }
  function setStep(i: number, field: "title" | "description", val: string) {
    setData((p) => ({
      ...p,
      process: {
        ...p.process,
        steps: p.process.steps.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)),
      },
    }));
  }
  function setFaqMeta(field: "eyebrow" | "title" | "subtitle", val: string) {
    setData((p) => ({ ...p, faq: { ...p.faq, [field]: val } }));
  }
  function setFaqItem(i: number, field: "question" | "answer", val: string) {
    setData((p) => ({
      ...p,
      faq: {
        ...p.faq,
        items: p.faq.items.map((it, idx) => (idx === i ? { ...it, [field]: val } : it)),
      },
    }));
  }

  return (
    <form action={formAction} className="mt-6 space-y-5">
      <input type="hidden" name="content-tr" value={JSON.stringify(tr)} />
      <input type="hidden" name="content-en" value={JSON.stringify(en)} />

      {/* Dil sekmeleri */}
      <div className="flex gap-2">
        {(["tr", "en"] as const).map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setTab(loc)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              tab === loc
                ? "border-accent bg-accent/10 font-medium text-accent"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {loc === "tr" ? "Türkçe" : "English"}
          </button>
        ))}
      </div>

      {/* --- Hero --- */}
      <Section title="Hero (giriş bölümü)">
        <Field label="Üst etiket">
          <input className={inputClass} value={data.hero.eyebrow} onChange={(e) => setHero("eyebrow", e.target.value)} />
        </Field>
        <Field label="Başlık">
          <textarea rows={2} className={inputClass} value={data.hero.title} onChange={(e) => setHero("title", e.target.value)} />
        </Field>
        <Field label="Alt başlık">
          <textarea rows={2} className={inputClass} value={data.hero.subtitle} onChange={(e) => setHero("subtitle", e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Birincil buton">
            <input className={inputClass} value={data.hero.primaryCta} onChange={(e) => setHero("primaryCta", e.target.value)} />
          </Field>
          <Field label="İkincil buton">
            <input className={inputClass} value={data.hero.secondaryCta} onChange={(e) => setHero("secondaryCta", e.target.value)} />
          </Field>
        </div>
        <Field label="Alt not (panel önizlemesinin altındaki küçük yazı)">
          <input className={inputClass} value={data.hero.caption} onChange={(e) => setHero("caption", e.target.value)} />
        </Field>
      </Section>

      {/* --- Süreç --- */}
      <Section title="Süreç (Nasıl çalışıyoruz)">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Üst etiket">
            <input className={inputClass} value={data.process.eyebrow} onChange={(e) => setProcessMeta("eyebrow", e.target.value)} />
          </Field>
          <Field label="Başlık" className="sm:col-span-2">
            <input className={inputClass} value={data.process.title} onChange={(e) => setProcessMeta("title", e.target.value)} />
          </Field>
        </div>
        <Field label="Alt başlık">
          <input className={inputClass} value={data.process.subtitle} onChange={(e) => setProcessMeta("subtitle", e.target.value)} />
        </Field>
        <div className="space-y-3">
          {data.process.steps.map((step, i) => (
            <div key={step.id} className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                Adım {i + 1}
              </p>
              <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
                <input
                  className={inputClass}
                  placeholder="Başlık"
                  value={step.title}
                  onChange={(e) => setStep(i, "title", e.target.value)}
                />
                <textarea
                  rows={2}
                  className={inputClass}
                  placeholder="Açıklama"
                  value={step.description}
                  onChange={(e) => setStep(i, "description", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* --- SSS --- */}
      <Section title="SSS (Sıkça sorulan sorular)">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Üst etiket">
            <input className={inputClass} value={data.faq.eyebrow} onChange={(e) => setFaqMeta("eyebrow", e.target.value)} />
          </Field>
          <Field label="Başlık" className="sm:col-span-2">
            <input className={inputClass} value={data.faq.title} onChange={(e) => setFaqMeta("title", e.target.value)} />
          </Field>
        </div>
        <Field label="Alt başlık">
          <input className={inputClass} value={data.faq.subtitle} onChange={(e) => setFaqMeta("subtitle", e.target.value)} />
        </Field>
        <div className="space-y-3">
          {data.faq.items.map((item, i) => (
            <div key={item.id} className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                Soru {i + 1}
              </p>
              <input
                className={cn(inputClass, "mb-2")}
                placeholder="Soru"
                value={item.question}
                onChange={(e) => setFaqItem(i, "question", e.target.value)}
              />
              <textarea
                rows={3}
                className={inputClass}
                placeholder="Cevap"
                value={item.answer}
                onChange={(e) => setFaqItem(i, "answer", e.target.value)}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* --- Final CTA --- */}
      <Section title="Kapanış çağrısı (sayfa sonu)">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Üst etiket">
            <input className={inputClass} value={data.cta.eyebrow} onChange={(e) => setCta("eyebrow", e.target.value)} />
          </Field>
          <Field label="Başlık" className="sm:col-span-2">
            <input className={inputClass} value={data.cta.title} onChange={(e) => setCta("title", e.target.value)} />
          </Field>
        </div>
        <Field label="Alt başlık">
          <input className={inputClass} value={data.cta.subtitle} onChange={(e) => setCta("subtitle", e.target.value)} />
        </Field>
        <Field label="Buton">
          <input className={inputClass} value={data.cta.primaryCta} onChange={(e) => setCta("primaryCta", e.target.value)} />
        </Field>
      </Section>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Kaydediliyor..." : "Kaydet ve yayınla"}
        </Button>
        {state.error ? (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className="text-sm text-emerald-700">Kaydedildi — sitede yayında ✓</p>
        ) : null}
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4 rounded-xl border border-border bg-background p-5 shadow-soft">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium">{label}</label>
      {children}
    </div>
  );
}
