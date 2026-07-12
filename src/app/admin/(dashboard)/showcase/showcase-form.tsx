"use client";

import { useState, useActionState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  saveShowcase,
  type SaveShowcaseState,
} from "@/features/admin/showcase/actions";
import type { ShowcaseContent } from "@/features/admin/showcase/schema";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-fast focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/15";

type MediaImage = { url: string; filename: string };

/**
 * Vitrin düzenleme formu. Metinler TR/EN sekmeleriyle ayrı ayrı; görsel
 * seçimi iki dil için ortaktır (aynı ekran görüntüsü). Kaydet, iki dilin
 * içeriğini tek seferde gönderir.
 */
export function ShowcaseForm({
  initialTr,
  initialEn,
  images,
}: {
  initialTr: ShowcaseContent;
  initialEn: ShowcaseContent;
  images: MediaImage[];
}) {
  const [tr, setTr] = useState(initialTr);
  const [en, setEn] = useState(initialEn);
  const [tab, setTab] = useState<"tr" | "en">("tr");
  const [state, formAction, pending] = useActionState<SaveShowcaseState, FormData>(
    saveShowcase,
    {}
  );

  const active = tab === "tr" ? tr : en;
  const setActive = tab === "tr" ? setTr : setEn;

  function updateItem(
    index: number,
    field: "tag" | "title" | "description",
    value: string
  ) {
    setActive((prev) => ({
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  /** Görsel iki dilde ortak — ikisini birden günceller. */
  function updateImage(index: number, url: string) {
    for (const set of [setTr, setEn]) {
      set((prev) => ({
        items: prev.items.map((item, i) =>
          i === index ? { ...item, imageUrl: url } : item
        ),
      }));
    }
  }

  return (
    <form action={formAction} className="mt-6 space-y-5">
      <input type="hidden" name="content-tr" value={JSON.stringify(tr)} />
      <input type="hidden" name="content-en" value={JSON.stringify(en)} />

      {/* Dil sekmeleri */}
      <div className="flex gap-2">
        {(["tr", "en"] as const).map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => setTab(locale)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              tab === locale
                ? "border-accent bg-accent/10 font-medium text-accent"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {locale === "tr" ? "Türkçe" : "English"}
          </button>
        ))}
      </div>

      {active.items.map((item, index) => (
        <fieldset
          key={item.id}
          className="rounded-xl border border-border bg-background p-5 shadow-soft"
        >
          <legend className="px-1 text-sm font-semibold">
            Kart {index + 1} — {item.tag || item.id}
          </legend>

          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`tag-${index}`}
                className="mb-1 block text-xs font-medium"
              >
                Etiket (ürün türü)
              </label>
              <input
                id={`tag-${index}`}
                type="text"
                value={item.tag}
                onChange={(e) => updateItem(index, "tag", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor={`title-${index}`}
                className="mb-1 block text-xs font-medium"
              >
                Başlık (işletme adı)
              </label>
              <input
                id={`title-${index}`}
                type="text"
                value={item.title}
                onChange={(e) => updateItem(index, "title", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor={`description-${index}`}
                className="mb-1 block text-xs font-medium"
              >
                Açıklama
              </label>
              <textarea
                id={`description-${index}`}
                rows={2}
                value={item.description}
                onChange={(e) => updateItem(index, "description", e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Görsel seçimi — iki dilde ortak */}
            <div className="sm:col-span-2">
              <label
                htmlFor={`image-${index}`}
                className="mb-1 block text-xs font-medium"
              >
                Kart görseli{" "}
                <span className="font-normal text-muted-foreground">
                  (Medya kütüphanesinden; iki dilde ortak)
                </span>
              </label>
              <div className="flex items-center gap-3">
                <select
                  id={`image-${index}`}
                  value={item.imageUrl ?? ""}
                  onChange={(e) => updateImage(index, e.target.value)}
                  className={cn(inputClass, "flex-1")}
                >
                  <option value="">Kodla çizilmiş demo (varsayılan)</option>
                  {images.map((img) => (
                    <option key={img.url} value={img.url}>
                      {img.filename}
                    </option>
                  ))}
                </select>
                {item.imageUrl ? (
                  // Seçilen görselin küçük önizlemesi. Blob URL'leri harici
                  // olduğundan bilinçli olarak düz img kullanıldı.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-12 w-20 shrink-0 rounded-md border border-border object-cover"
                  />
                ) : (
                  <span className="flex h-12 w-20 shrink-0 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">
                    <ImageOff className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
              </div>
              {images.length === 0 ? (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Henüz görsel yüklenmemiş — önce Medya sekmesinden bir ekran
                  görüntüsü yükleyin.
                </p>
              ) : null}
            </div>
          </div>
        </fieldset>
      ))}

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
          <p className="text-sm text-emerald-700">
            Kaydedildi — sitede yayında ✓
          </p>
        ) : null}
      </div>
    </form>
  );
}
