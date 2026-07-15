"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/**
 * Fiyat sayacı — kart görünüre girince fiyat ₺0'dan hedefe sayarak dolar
 * (V3 Faz C: "yaşayan teklif"). Para birimi simgesi ve binlik ayracı (tr-TR)
 * korunur. Sayı ayrıştırılamazsa metin olduğu gibi gösterilir (regresyon yok).
 * Yalnızca bir kez, görünürken çalışır; azaltılmış harekette anında hedef.
 */
export function AnimatedPrice({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  // "₺1.225" → prefix "₺", sayı 1225. Binlik ayracı "." temizlenir.
  const match = value.match(/^(\D*)([\d.]+)(\D*)$/);
  const prefix = match?.[1] ?? "";
  const suffix = match?.[3] ?? "";
  const target = match ? parseInt(match[2].replace(/\./g, ""), 10) : NaN;
  const parseable = match !== null && Number.isFinite(target);

  const [shown, setShown] = useState(parseable ? 0 : 0);

  useEffect(() => {
    if (!parseable) return;
    if (reduced || !inView) {
      if (inView) setShown(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, target, parseable]);

  if (!parseable) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {shown.toLocaleString("tr-TR")}
      {suffix}
    </span>
  );
}
