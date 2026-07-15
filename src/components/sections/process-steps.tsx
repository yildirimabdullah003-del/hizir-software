"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export type ProcessStep = {
  id: string;
  title: string;
  description: string;
};

/**
 * Süreç adımları — Süreç bölümünün kendine özgü görsel dili: WORKFLOW HATTI
 * (masterplan Sahne 4). Görünür olduğunda adımları bağlayan hat soldan sağa
 * çizilir, üzerinde küçük bir veri noktası TEK TUR akar ve her adım nokta
 * kendisine ulaştığında "aktifleşir" (numara accent'e döner). Döngü yok.
 *
 * Hat konumu DİNAMİK ölçülür: dairelerin gerçek merkezleri (offset) okunur;
 * böylece grid gap'i ne olursa olsun hat ilk ve son daireye TAM değer.
 */

const DRAW_DURATION = 1.1;
const FLOW_DURATION = 2.6;
const FLOW_DELAY = 0.5;

export function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  const rootRef = useRef<HTMLOListElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const inView = useInView(rootRef, { margin: "-100px", once: true });
  const reduced = useReducedMotion();
  const count = steps.length;

  // Ölçülen daire merkezleri (ol'e göre px). Hat ve akış noktası bunları kullanır.
  const [centers, setCenters] = useState<number[] | null>(null);
  const [lineTop, setLineTop] = useState(20);

  useLayoutEffect(() => {
    function measure() {
      const root = rootRef.current;
      if (!root) return;
      const xs: number[] = [];
      let top = 20;
      dotRefs.current.forEach((el, i) => {
        if (!el) return;
        // el.offsetLeft kendi li'sine göredir; li.offsetLeft ise ol'e göre
        // (ol position:relative). Transform'dan bağımsız, ol'e göre gerçek merkez:
        const li = el.offsetParent as HTMLElement | null;
        const liLeft = li ? li.offsetLeft : 0;
        const liTop = li ? li.offsetTop : 0;
        xs[i] = liLeft + el.offsetLeft + el.offsetWidth / 2;
        if (i === 0) top = liTop + el.offsetTop + el.offsetHeight / 2;
      });
      setCenters(xs);
      setLineTop(top);
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (rootRef.current) ro.observe(rootRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [count]);

  const first = centers?.[0];
  const last = centers?.[count - 1];
  const hasLine = centers != null && first != null && last != null && last > first;

  return (
    <motion.ol
      ref={rootRef}
      className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
    >
      {/* --- Workflow hattı (yalnızca lg, ölçülen merkezlere göre) --- */}
      {hasLine ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute hidden lg:block"
          style={{ left: first, width: last - first, top: lineTop }}
        >
          {/* Zemin hattı */}
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
          {/* Çizilen accent hat */}
          <motion.div
            className="absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2 bg-accent/60"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: DRAW_DURATION, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Akış noktası — tek tur */}
          {!reduced ? (
            <motion.div
              className="absolute top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
              style={{ boxShadow: "0 0 12px color-mix(in srgb, var(--color-accent) 70%, transparent)" }}
              initial={{ left: 0, opacity: 0 }}
              animate={inView ? { left: [0, last - first], opacity: [0, 1, 1, 0] } : {}}
              transition={{
                duration: FLOW_DURATION,
                delay: FLOW_DELAY,
                ease: "easeInOut",
                times: [0, 0.1, 0.9, 1],
              }}
            />
          ) : null}
        </div>
      ) : null}

      {steps.map((step, index) => {
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
            <motion.span
              ref={(el) => {
                dotRefs.current[index] = el;
              }}
              className="relative z-10 mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
              initial={{
                backgroundColor: "var(--color-foreground)",
                color: "var(--color-background)",
              }}
              animate={
                inView
                  ? {
                      backgroundColor: "var(--color-accent)",
                      color: "#ffffff",
                      boxShadow: [
                        "0 0 0 0 color-mix(in srgb, var(--color-accent) 0%, transparent)",
                        "0 0 0 8px color-mix(in srgb, var(--color-accent) 18%, transparent)",
                        "0 0 0 0 color-mix(in srgb, var(--color-accent) 0%, transparent)",
                      ],
                    }
                  : {}
              }
              transition={{
                delay: reduced ? 0 : reachDelay,
                duration: 0.55,
                ease: "easeOut",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </motion.span>
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
