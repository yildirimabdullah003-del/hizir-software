"use client";

import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";

/**
 * "Harita alanı" — sabit bir ofis adresimiz olmadığı için gerçek bir
 * koordinat/pin göstermek yanıltıcı olurdu. Bunun yerine, uzaktan çalışma
 * modelini dürüstçe anlatan dekoratif bir nokta-grid + nabız animasyonlu
 * pin görseli kullanılır.
 */
export function MapPanel({ title, body }: { title: string; body: string }) {
  return (
    <Reveal className="relative overflow-hidden rounded-2xl border border-border">
      <div
        className="absolute inset-0 bg-surface"
        style={{
          backgroundImage: "radial-gradient(var(--color-border) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden="true"
      />
      <div className="relative flex flex-col items-center gap-6 px-6 py-16 text-center sm:py-20">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <motion.span
            className="absolute inset-0 rounded-full bg-accent/20"
            animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            aria-hidden="true"
          />
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lifted">
            <MapPin className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
        <div className="max-w-md">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{body}</p>
        </div>
      </div>
    </Reveal>
  );
}
