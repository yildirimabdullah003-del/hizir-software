"use client";

import { useActionState } from "react";
import { uploadMedia, type UploadState } from "@/features/admin/media/actions";
import { Button } from "@/components/ui/button";

export function UploadForm() {
  const [state, formAction, pending] = useActionState<UploadState, FormData>(
    uploadMedia,
    {}
  );

  return (
    <form
      action={formAction}
      className="mt-6 flex flex-wrap items-end gap-4 rounded-xl border border-border bg-background p-5 shadow-soft"
    >
      <div>
        <label htmlFor="file" className="mb-1 block text-xs font-medium">
          Dosya (görsel veya PDF, en fazla 10 MB)
        </label>
        <input
          id="file"
          name="file"
          type="file"
          required
          accept="image/jpeg,image/png,image/webp,image/svg+xml,image/avif,application/pdf"
          className="text-sm"
        />
      </div>
      <div className="min-w-56 flex-1">
        <label htmlFor="altText" className="mb-1 block text-xs font-medium">
          Alternatif metin (görseller için, erişilebilirlik/SEO)
        </label>
        <input
          id="altText"
          name="altText"
          type="text"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Yükleniyor..." : "Yükle"}
      </Button>
      {state.error ? (
        <p role="alert" className="w-full text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="w-full text-sm text-emerald-700">Dosya yüklendi ✓</p>
      ) : null}
    </form>
  );
}
