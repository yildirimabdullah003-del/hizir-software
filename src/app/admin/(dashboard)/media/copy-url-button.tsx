"use client";

import { useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";

/**
 * Görselin URL'ini panoya kopyalar. Kopyalanan adres, sayfa/içerik
 * düzenlerken görseli kullanmak için yapıştırılır.
 */
export function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Pano erişimi engellendiyse (eski tarayıcı/izin) sessizce geç.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Görsel adresini kopyala"
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
          Kopyalandı
        </>
      ) : (
        <>
          <LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
          URL kopyala
        </>
      )}
    </button>
  );
}
