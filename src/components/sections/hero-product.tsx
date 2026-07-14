"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { QrCode, TrendingUp, Check } from "lucide-react";

/**
 * Hero Ürün Yüzeyi — TEK bir bağlı ürün.
 *
 * Üç ayrı yüzen kart değil: tek bir "işletme komuta yüzeyi". Sipariş
 * yolculuğu bu tek arayüzün İÇİNDE yaşar:
 *   müşteri QR'dan seçer (sol) → adisyon canlı sipariş rayına düşer (sağ)
 *   → ciro şeridi yükselir (alt).
 * Bir iç ışık, döngü başına bu yolu bir kez kat eder (görünmez omurganın
 * yüzey-içi karşılığı). Yüzey SABİT; hareket içeriktedir. Doğal aralıklarla
 * yaşar; azaltılmış harekette durağan ve tam dolu.
 */

const ORDERS = [
  { table: "Masa 7", items: "Karışık Izgara, Ayran ×2", amount: 480, item: "Karışık Izgara" },
  { table: "Paket #214", items: "Kaşarlı Pide ×2", amount: 360, item: "Kaşarlı Pide" },
  { table: "Masa 3", items: "Izgara Köfte, Salata", amount: 330, item: "Izgara Köfte" },
  { table: "Masa 12", items: "Tavuk Şiş ×3, Kola ×2", amount: 720, item: "Tavuk Şiş" },
];

const CYCLE_MS = 5200;
const REACH_RAIL_MS = 1150;
const REACH_REVENUE_MS = 2650;

function formatTL(v: number): string {
  return `₺${Math.round(v).toLocaleString("tr-TR")}`;
}

export function HeroProduct() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-80px" });
  const reduced = useReducedMotion();
  const live = inView && !reduced;

  const [rail, setRail] = useState(() => [
    { ...ORDERS[2], id: -3, status: "Mutfakta" },
    { ...ORDERS[1], id: -2, status: "Yolda" },
    { ...ORDERS[0], id: -1, status: "Servis" },
  ]);
  const [revenue, setRevenue] = useState(18450);
  const [orderCount, setOrderCount] = useState(46);
  const [spark, setSpark] = useState(8);
  const [cycle, setCycle] = useState(0);
  const [pickedItem, setPickedItem] = useState(0); // QR'da vurgulanan ürün
  const [added, setAdded] = useState(false);
  const nextRef = useRef(0);

  // Ciro sayacı akışı.
  const revMV = useMotionValue(18450);
  const [revShown, setRevShown] = useState(18450);
  useEffect(() => {
    const c = animate(revMV, revenue, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setRevShown(v),
    });
    return () => c.stop();
  }, [revenue, revMV]);

  // --- Tek merkezî koreografi: yolculuk tek yüzeyin içinde --------------------
  useEffect(() => {
    if (!live) return;
    let mounted = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    function run() {
      if (!mounted) return;
      const o = ORDERS[nextRef.current % ORDERS.length];
      // 1) Müşteri QR'da ürünü seçer.
      setPickedItem(nextRef.current % 2);
      setAdded(true);
      setCycle((c) => c + 1);
      timers.push(setTimeout(() => mounted && setAdded(false), 1400));
      // 2) Adisyon sipariş rayına düşer.
      timers.push(
        setTimeout(() => {
          if (!mounted) return;
          nextRef.current += 1;
          setRail((prev) => [{ ...o, id: nextRef.current, status: "Yeni" }, ...prev.slice(0, 2)]);
          setOrderCount((c) => c + 1);
        }, REACH_RAIL_MS)
      );
      // 3) Ciro şeridi yükselir.
      timers.push(
        setTimeout(() => {
          if (!mounted) return;
          setRevenue((r) => r + o.amount);
          setSpark((s) => (s >= 12 ? 8 : s + 1));
        }, REACH_REVENUE_MS)
      );
    }
    run();
    const iv = setInterval(run, CYCLE_MS);
    return () => {
      mounted = false;
      clearInterval(iv);
      timers.forEach(clearTimeout);
    };
  }, [live]);

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-[34rem]" aria-hidden="true">
      {/* Yüzeyi saran yumuşak accent halesi (ortak ışık dili) */}
      <div
        className="pointer-events-none absolute -inset-6 rounded-[2rem]"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 40%, color-mix(in srgb, var(--color-accent) 14%, transparent) 0%, transparent 70%)",
          filter: "blur(28px)",
        }}
      />

      {/* ======================= TEK ÜRÜN YÜZEYİ ======================= */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 22, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[1.4rem] border border-black/[0.07] bg-white/80 shadow-[0_40px_80px_-30px_rgba(10,10,30,0.35)] backdrop-blur-xl"
      >
        {/* Üst bar */}
        <div className="flex items-center justify-between border-b border-black/[0.06] bg-white/60 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent text-[11px] font-bold text-white">
              H
            </span>
            <div className="leading-tight">
              <p className="text-[11px] font-semibold tracking-tight">Lezzet Durağı</p>
              <p className="text-[8px] uppercase tracking-widest text-muted-foreground">
                HIZIR Panel
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              animate={live ? { opacity: [1, 0.3, 1] } : undefined}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            CANLI
          </span>
        </div>

        {/* Gövde: sol QR menü · sağ canlı sipariş rayı */}
        <div className="grid grid-cols-[0.82fr_1fr]">
          {/* --- SOL: QR Menü (müşteri) --- */}
          <div className="relative border-r border-black/[0.06] p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <QrCode className="h-3 w-3 text-accent" />
              <p className="text-[9px] font-semibold">QR Menü</p>
            </div>
            <div className="space-y-1.5">
              {[
                ["Karışık Izgara", "₺240", "#8a3f24"],
                ["Kaşarlı Pide", "₺180", "#c07f3f"],
              ].map(([name, price, color], i) => {
                const active = live && pickedItem === i;
                return (
                  <div
                    key={name}
                    className="relative flex items-center gap-2 rounded-lg border p-1.5 transition-colors"
                    style={{
                      borderColor: active
                        ? "color-mix(in srgb, var(--color-accent) 55%, transparent)"
                        : "rgba(0,0,0,0.06)",
                      background: active
                        ? "color-mix(in srgb, var(--color-accent) 6%, white)"
                        : "white",
                    }}
                  >
                    <span
                      className="h-6 w-6 shrink-0 rounded-md"
                      style={{ background: `radial-gradient(circle at 40% 30%, ${color}bb, ${color})` }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[8px] font-semibold">{name}</p>
                      <div className="mt-0.5 h-1 w-8 rounded bg-black/10" />
                    </div>
                    <span className="text-[8px] font-bold text-accent">{price}</span>
                    {active ? (
                      <motion.span
                        key={cycle}
                        className="pointer-events-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-accent"
                        initial={{ scale: 0, opacity: 0.8 }}
                        animate={{ scale: 2.4, opacity: 0 }}
                        transition={{ duration: 0.85, ease: "easeOut" }}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
            {/* Sepete eklendi onayı */}
            <div className="mt-2 h-5">
              <AnimatePresence>
                {added ? (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[8px] font-medium text-emerald-700"
                  >
                    <Check className="h-2.5 w-2.5" /> Sipariş verildi
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          {/* --- SAĞ: Canlı Sipariş Rayı --- */}
          <div className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[9px] font-semibold">Canlı Sipariş</p>
              <span className="text-[8px] text-muted-foreground">bugün {orderCount}</span>
            </div>
            <ul className="space-y-1.5">
              <AnimatePresence initial={false}>
                {rail.map((o) => (
                  <motion.li
                    key={o.id}
                    layout
                    initial={{ opacity: 0, y: -12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 340, damping: 28 }}
                    className="rounded-lg border border-black/[0.05] bg-white px-2 py-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[8.5px] font-semibold">{o.table}</span>
                      <span
                        className="rounded-full px-1.5 py-[1px] text-[6.5px] font-medium"
                        style={statusStyle(o.status)}
                      >
                        {o.status}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="truncate text-[7px] text-muted-foreground">{o.items}</span>
                      <span className="shrink-0 text-[8px] font-bold">{formatTL(o.amount)}</span>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>

        {/* Alt şerit: ciro + sparkline (yolculuğun sonu) */}
        <div className="flex items-center gap-3 border-t border-black/[0.06] bg-white/60 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            <div className="leading-tight">
              <p className="text-[7.5px] text-muted-foreground">Bugünkü ciro</p>
              <p className="text-[13px] font-bold tabular-nums tracking-tight">
                {formatTL(revShown)}
              </p>
            </div>
          </div>
          <svg viewBox="0 0 100 24" className="h-7 flex-1" preserveAspectRatio="none">
            <defs>
              <linearGradient id="hzr-hero-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={`${sparkPath(spark)} L100,24 L0,24 Z`}
              fill="url(#hzr-hero-area)"
              initial={false}
              animate={{ d: `${sparkPath(spark)} L100,24 L0,24 Z` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d={sparkPath(spark)}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ d: sparkPath(spark) }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-600">
            ▲ %12
          </span>
        </div>

        {/* İç ışık: döngü başına QR → ray → ciro yolunu bir kez kat eder */}
        {live ? (
          <motion.span
            key={cycle}
            className="pointer-events-none absolute z-20 h-2 w-2 rounded-full bg-accent"
            style={{
              boxShadow: "0 0 12px 2px color-mix(in srgb, var(--color-accent) 70%, transparent)",
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ left: "20%", top: "42%", opacity: 0 }}
            animate={{
              left: ["20%", "20%", "62%", "62%", "50%", "50%"],
              top: ["42%", "42%", "42%", "42%", "88%", "88%"],
              opacity: [0, 1, 1, 0.9, 0.9, 0],
            }}
            transition={{
              duration: CYCLE_MS / 1000,
              times: [0, 0.05, 0.22, 0.3, 0.51, 0.6],
              ease: "easeInOut",
            }}
          />
        ) : null}
      </motion.div>
    </div>
  );
}

function statusStyle(status: string): React.CSSProperties {
  switch (status) {
    case "Yeni":
      return { color: "#2b59ff", background: "rgba(43,89,255,0.12)" };
    case "Mutfakta":
      return { color: "#b5751f", background: "rgba(224,169,95,0.16)" };
    case "Yolda":
      return { color: "#2f8f4f", background: "rgba(127,191,143,0.18)" };
    default:
      return { color: "#5f6b80", background: "rgba(143,159,181,0.16)" };
  }
}

function sparkPath(points: number): string {
  const ys = [17, 14, 16, 11, 13, 8, 10, 7, 9, 5, 7, 4];
  const n = Math.max(2, Math.min(points, ys.length));
  const step = 100 / (n - 1);
  return ys
    .slice(0, n)
    .map((y, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${y}`)
    .join(" ");
}
