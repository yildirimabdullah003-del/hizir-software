"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Search, PenTool, Code2, Rocket, type LucideIcon } from "lucide-react";

export type ProcessStep = {
  id: string;
  title: string;
  description: string;
};

// Her adımın kendine özgü motifi — "4 aynı daire"nin sıradanlığını kırar.
// Nokta adıma ulaşınca ikon tek seferlik bir mikro jest yapar.
const STEP_ICONS: LucideIcon[] = [Search, PenTool, Code2, Rocket];
const STEP_GESTURE: Record<number, { rotate?: number[]; y?: number[]; scale?: number[] }> = {
  0: { rotate: [0, -12, 8, 0], scale: [1, 1.12, 1] }, // Keşif: tarama
  1: { rotate: [0, 14, -6, 0] }, // Tasarım: kalem
  2: { scale: [1, 0.85, 1.1, 1] }, // Geliştirme: sıkıştır-genişlet
  3: { y: [0, -5, 0], rotate: [0, 6, 0] }, // Yayın: kalkış
};

/**
 * Süreç adımları — Süreç bölümünün kendine özgü görsel dili: WORKFLOW HATTI
 * (masterplan Sahne 4). Görünür olduğunda adımları bağlayan hat soldan sağa
 * çizilir, üzerinde küçük bir veri noktası TEK TUR akar ve her adım nokta
 * kendisine ulaştığında "aktifleşir" (numara accent'e döner). Döngü yok;
 * hareket bir kez yaşanan bir keşif anıdır. Mobilde hat gizlenir, adımlar
 * sıralı reveal ile gelir.
 */

// Zamanlama sabitleri — nokta akışı ile adım aktivasyonu senkron.
const DRAW_DURATION = 1.1; // hattın çizilmesi
const FLOW_DURATION = 2.6; // noktanın soldan sağa yolculuğu
const FLOW_DELAY = 0.5; // çizim başladıktan sonra noktanın yola çıkışı

export function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  const rootRef = useRef<HTMLOListElement>(null);
  const inView = useInView(rootRef, { margin: "-100px", once: true });
  const reduced = useReducedMotion();
  const count = steps.length;

  // Kolon merkezleri (%): 4 adım için 12.5, 37.5, 62.5, 87.5.
  const centers = steps.map((_, i) => ((i + 0.5) / count) * 100);

  return (
    <motion.ol
      ref={rootRef}
      className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
    >
      {/* --- Workflow hattı (yalnızca lg) --- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-5 hidden lg:block"
      >
        {/* Zemin hattı */}
        <div
          className="absolute h-px bg-border"
          style={{ left: `${centers[0]}%`, right: `${100 - centers[count - 1]}%` }}
        />
        {/* Çizilen accent hat */}
        <motion.div
          className="absolute h-px origin-left bg-accent/60"
          style={{ left: `${centers[0]}%`, right: `${100 - centers[count - 1]}%` }}
          initial={{ scaleX: 0 }}
          animate={inView && !reduced ? { scaleX: 1 } : reduced ? { scaleX: 1 } : {}}
          transition={{ duration: DRAW_DURATION, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Akış noktası — tek tur, sonda ışıyıp söner */}
        {!reduced ? (
          <motion.div
            className="absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-accent"
            style={{ boxShadow: "0 0 12px color-mix(in srgb, var(--color-accent) 70%, transparent)" }}
            initial={{ left: `${centers[0]}%`, opacity: 0 }}
            animate={
              inView
                ? {
                    left: [`${centers[0]}%`, `${centers[count - 1]}%`],
                    opacity: [0, 1, 1, 0],
                  }
                : {}
            }
            transition={{
              duration: FLOW_DURATION,
              delay: FLOW_DELAY,
              ease: "easeInOut",
              times: [0, 0.1, 0.9, 1],
            }}
          />
        ) : null}
      </div>

      {steps.map((step, index) => {
        // Nokta bu adıma ~şu anda ulaşır (aktivasyon senkronu).
        const reachDelay =
          FLOW_DELAY + (index / Math.max(count - 1, 1)) * FLOW_DURATION;
        return (
          <motion.li
            key={step.id}
            className="relative"
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: reduced ? 0 : index * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* İkon tile + adım numarası — her adım kendi motifiyle */}
            <div className="mb-4 flex items-center gap-3">
              <motion.span
                className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                initial={{
                  backgroundColor: "color-mix(in srgb, var(--color-foreground) 6%, transparent)",
                  color: "var(--color-muted-foreground)",
                }}
                animate={
                  inView
                    ? {
                        backgroundColor: "color-mix(in srgb, var(--color-accent) 12%, transparent)",
                        color: "var(--color-accent)",
                        boxShadow: [
                          "0 0 0 0 color-mix(in srgb, var(--color-accent) 0%, transparent)",
                          "0 0 0 8px color-mix(in srgb, var(--color-accent) 16%, transparent)",
                          "0 0 0 0 color-mix(in srgb, var(--color-accent) 0%, transparent)",
                        ],
                      }
                    : {}
                }
                transition={{ delay: reduced ? 0 : reachDelay, duration: 0.55, ease: "easeOut" }}
              >
                <motion.span
                  animate={inView && !reduced ? STEP_GESTURE[index] : undefined}
                  transition={{ delay: reachDelay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="flex"
                >
                  <StepIcon index={index} />
                </motion.span>
              </motion.span>
              <span className="text-xs font-semibold tabular-nums text-muted-foreground/60">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="text-base font-semibold tracking-tight">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {step.description}
            </p>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}

function StepIcon({ index }: { index: number }) {
  const Icon = STEP_ICONS[index % STEP_ICONS.length];
  return <Icon className="h-5 w-5" aria-hidden="true" />;
}
