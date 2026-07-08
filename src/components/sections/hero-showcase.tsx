"use client";

import { motion } from "framer-motion";
import { Wifi, BatteryFull, Star } from "lucide-react";

/**
 * Hero'daki ürün vitrini — stok fotoğraf yerine tamamen tasarım
 * token'larıyla (globals.css @theme) çizilmiş cihaz mockup'ları:
 * tarayıcıda örnek restoran sitesi + telefonda QR menü. Gerçek işlerin
 * ekran görüntüleri hazır olduğunda içerik değişir, çerçeveler kalır.
 */
export function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-lg" aria-hidden="true">
      {/* Tarayıcı: örnek restoran web sitesi */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        className="overflow-hidden rounded-xl border border-border bg-background shadow-lifted"
      >
        {/* Sekme çubuğu */}
        <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 flex-1 rounded-md bg-muted px-3 py-1 text-[10px] text-muted-foreground">
            lezzetduragi.com.tr
          </span>
        </div>
        {/* Site içeriği */}
        <div className="p-5">
          <div
            className="flex h-24 flex-col items-center justify-center rounded-lg text-center"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 14%, transparent), color-mix(in srgb, var(--color-accent) 4%, transparent))",
            }}
          >
            <p className="text-sm font-semibold tracking-tight">Lezzet Durağı</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              1998&apos;den beri aynı ocak, aynı lezzet
            </p>
            <span className="mt-2 rounded-full bg-accent px-3 py-1 text-[9px] font-medium text-[var(--color-accent-foreground)]">
              Rezervasyon
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {["Kahvaltı", "Izgara", "Tatlı"].map((label) => (
              <div key={label} className="rounded-lg border border-border p-2.5">
                <div className="h-10 rounded-md bg-accent/10" />
                <p className="mt-1.5 text-[10px] font-medium">{label}</p>
                <div className="mt-1 h-1.5 w-3/4 rounded bg-muted" />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-surface px-3 py-2">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-2.5 w-2.5 fill-current" />
              ))}
            </div>
            <div className="h-1.5 w-24 rounded bg-muted" />
          </div>
        </div>
      </motion.div>

      {/* Telefon: QR menü — tarayıcının üstüne biner */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
        className="absolute -bottom-10 -right-3 w-40 overflow-hidden rounded-[1.6rem] border border-border bg-background shadow-lifted sm:-right-8 sm:w-44"
      >
        {/* Durum çubuğu */}
        <div className="flex items-center justify-between px-4 pt-2.5 text-foreground/70">
          <span className="text-[8px] font-medium">9:41</span>
          <span className="flex items-center gap-1">
            <Wifi className="h-2.5 w-2.5" />
            <BatteryFull className="h-3 w-3" />
          </span>
        </div>
        <div className="px-3.5 pb-4 pt-2">
          <p className="text-[11px] font-semibold tracking-tight">Menü</p>
          {/* Kategori çipleri */}
          <div className="mt-2 flex gap-1.5">
            <span className="rounded-full bg-accent px-2 py-0.5 text-[8px] font-medium text-[var(--color-accent-foreground)]">
              Izgara
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[8px] text-muted-foreground">
              Salata
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[8px] text-muted-foreground">
              İçecek
            </span>
          </div>
          {/* Ürün satırları */}
          <div className="mt-2.5 space-y-1.5">
            {[
              ["Izgara Köfte", "₺240"],
              ["Tavuk Şiş", "₺210"],
              ["Karışık Izgara", "₺390"],
            ].map(([name, price]) => (
              <div
                key={name}
                className="flex items-center gap-2 rounded-lg border border-border p-2"
              >
                <div className="h-7 w-7 shrink-0 rounded-md bg-accent/10" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[9px] font-medium">{name}</p>
                  <div className="mt-0.5 h-1 w-10 rounded bg-muted" />
                </div>
                <span className="text-[9px] font-semibold text-accent">
                  {price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
