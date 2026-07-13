"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  animate,
  AnimatePresence,
} from "framer-motion";
import { Wifi, BatteryFull, Star, Bell, TrendingUp } from "lucide-react";
import { HeroDrone } from "@/components/sections/hero-drone";

/**
 * Hero'daki ürün vitrini — tasarım token'larıyla çizilmiş cihaz mockup'ları,
 * artık YAŞAYAN bir ürün gibi: imleçle 3D eğilir (katmanlar farklı derinlikte),
 * ziyaretçi sayacı artar, bildirimler düşer, yıldızlar sırayla dolar ve
 * HIZIR dronu etrafında süzülür. Tüm animasyonlar transform/opacity tabanlı
 * (GPU dostu); "azaltılmış hareket" tercihinde durağanlaşır.
 */

// Dönüşümlü canlı bildirimler — gerçek bir panel akışı hissi.
const NOTIFICATIONS = [
  { icon: "🔔", text: "Yeni rezervasyon — Masa 4" },
  { icon: "🛵", text: "Yeni sipariş — ₺390" },
  { icon: "⭐", text: "Yeni yorum: “Harika lezzet!”" },
  { icon: "📈", text: "QR menü 28 kez tarandı" },
];

/** Görünür olunca hedefe doğru sayan küçük sayaç (ör. ziyaretçi). */
function CountUp({ to, start }: { to: number; start: boolean }) {
  const value = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setDisplay(to);
      return;
    }
    const controls = animate(value, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [start, to, value, reduced]);

  return <>{display}</>;
}

export function HeroShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "-80px", once: false });
  const reduced = useReducedMotion();

  // --- İmleçle 3D eğilme: katmanlar farklı derinlikte hareket eder --------
  const pointerX = useMotionValue(0); // -0.5 .. 0.5
  const pointerY = useMotionValue(0);
  const springCfg = { stiffness: 140, damping: 18, mass: 0.5 };
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), springCfg);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-9, 9]), springCfg);
  // Telefon üst katmanda: daha güçlü kayar (derinlik farkı → parallax).
  const phoneX = useSpring(useTransform(pointerX, [-0.5, 0.5], [14, -14]), springCfg);
  const phoneY = useSpring(useTransform(pointerY, [-0.5, 0.5], [10, -10]), springCfg);
  // Drone en üst katman: en geniş gezinme.
  const droneX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-22, 22]), springCfg);
  const droneY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-14, 14]), springCfg);

  function handlePointerMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  // --- Dönüşümlü bildirim toast'ı ------------------------------------------
  const [notifIndex, setNotifIndex] = useState(0);
  useEffect(() => {
    if (!inView || reduced) return;
    const id = setInterval(
      () => setNotifIndex((i) => (i + 1) % NOTIFICATIONS.length),
      3600
    );
    return () => clearInterval(id);
  }, [inView, reduced]);
  const notif = NOTIFICATIONS[notifIndex];

  return (
    <div
      ref={containerRef}
      onMouseMove={reduced ? undefined : handlePointerMove}
      onMouseLeave={reduced ? undefined : handlePointerLeave}
      className="relative mx-auto w-full max-w-lg"
      style={{ perspective: 1400 }}
      aria-hidden="true"
    >
      {/* 3D eğilen sahne */}
      <motion.div
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {/* Tarayıcı: örnek restoran sitesi — canlı panel öğeleriyle */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="relative overflow-hidden rounded-xl border border-border bg-background shadow-lifted"
        >
          {/* Sekme çubuğu */}
          <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span className="ml-3 flex-1 rounded-md bg-muted px-3 py-1 text-[10px] text-muted-foreground">
              lezzetduragi.com.tr
            </span>
            <span className="relative flex h-4 w-4 items-center justify-center text-muted-foreground">
              <Bell className="h-3 w-3" />
              {/* Nabız atan bildirim noktası */}
              <motion.span
                className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-accent"
                animate={reduced ? undefined : { scale: [1, 1.6, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </div>

          {/* Canlı bildirim toast'ı — panelin içine düşer */}
          <div className="pointer-events-none absolute right-3 top-11 z-10 h-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={notifIndex}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-background/95 px-2.5 py-1.5 shadow-soft backdrop-blur"
              >
                <span className="text-[10px]">{notif.icon}</span>
                <span className="text-[9px] font-medium">{notif.text}</span>
              </motion.div>
            </AnimatePresence>
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
              {/* Nazikçe nefes alan CTA */}
              <motion.span
                className="mt-2 rounded-full bg-accent px-3 py-1 text-[9px] font-medium text-[var(--color-accent-foreground)]"
                animate={
                  reduced
                    ? undefined
                    : {
                        boxShadow: [
                          "0 0 0 0 color-mix(in srgb, var(--color-accent) 45%, transparent)",
                          "0 0 0 6px color-mix(in srgb, var(--color-accent) 0%, transparent)",
                        ],
                      }
                }
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              >
                Rezervasyon
              </motion.span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {["Kahvaltı", "Izgara", "Tatlı"].map((label, i) => (
                <motion.div
                  key={label}
                  className="rounded-lg border border-border p-2.5"
                  whileHover={reduced ? undefined : { y: -3, borderColor: "var(--color-accent)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <motion.div
                    className="h-10 rounded-md bg-accent/10"
                    animate={reduced ? undefined : { opacity: [0.7, 1, 0.7] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.7,
                      ease: "easeInOut",
                    }}
                  />
                  <p className="mt-1.5 text-[10px] font-medium">{label}</p>
                  <div className="mt-1 h-1.5 w-3/4 rounded bg-muted" />
                </motion.div>
              ))}
            </div>
            {/* Alt bar: sırayla dolan yıldızlar + canlı ziyaretçi sayacı */}
            <div className="mt-4 flex items-center justify-between rounded-lg bg-surface px-3 py-2">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0.25, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.5 + i * 0.18, type: "spring", stiffness: 300, damping: 16 }}
                  >
                    <Star className="h-2.5 w-2.5 fill-current" />
                  </motion.span>
                ))}
              </div>
              <span className="flex items-center gap-1 text-[9px] font-medium text-muted-foreground">
                <TrendingUp className="h-2.5 w-2.5 text-emerald-500" />
                Bugün <CountUp to={124} start={inView} /> ziyaretçi
              </span>
            </div>
          </div>
        </motion.div>

        {/* Telefon: QR menü — üst katman, imleçle daha güçlü kayar */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
          style={reduced ? undefined : { x: phoneX, y: phoneY, translateZ: 60 }}
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
            <div className="mt-2.5 space-y-1.5">
              {[
                ["Izgara Köfte", "₺240"],
                ["Tavuk Şiş", "₺210"],
                ["Karışık Izgara", "₺390"],
              ].map(([name, price], i) => (
                <motion.div
                  key={name}
                  className="relative flex items-center gap-2 rounded-lg border border-border p-2"
                  // Satırlar sırayla "seçiliyor" — panelde gezinen bir müşteri hissi.
                  animate={
                    reduced || !inView
                      ? undefined
                      : {
                          borderColor: [
                            "var(--color-border)",
                            "var(--color-accent)",
                            "var(--color-border)",
                          ],
                        }
                  }
                  transition={{
                    duration: 3.6,
                    repeat: Infinity,
                    delay: i * 1.2,
                    ease: "easeInOut",
                  }}
                >
                  <div className="h-7 w-7 shrink-0 rounded-md bg-accent/10" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[9px] font-medium">{name}</p>
                    <div className="mt-0.5 h-1 w-10 rounded bg-muted" />
                  </div>
                  <span className="text-[9px] font-semibold text-accent">{price}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* HIZIR dronu — sahnenin üstünde süzülür, imleçle en geniş gezinir */}
      <motion.div
        className="absolute -left-6 -top-14 z-10 sm:-left-12 sm:-top-16"
        style={reduced ? undefined : { x: droneX, y: droneY }}
      >
        <HeroDrone />
      </motion.div>
    </div>
  );
}
