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
import { Bell, TrendingUp, Users, UtensilsCrossed } from "lucide-react";

/**
 * HIZIR işletme paneli — hero'daki laptop ekranında GERÇEKTEN çalışıyormuş
 * gibi yaşayan panel: ciro sayacı artar, grafik kendini çizer, barlar
 * hover'da tooltip verir, birkaç saniyede bir yeni sipariş düşer ve
 * bildirim çıkar. Tüm veriler kurgu; amaç ürün hissini göstermek.
 * Animasyonlar yalnızca görünürken çalışır; azaltılmış harekette durağan.
 */

// Gelen siparişler döngüsü — masa/paket karışık, gerçekçi akış.
const INCOMING_ORDERS: { table: string; items: string; amount: number }[] = [
  { table: "Masa 7", items: "Karışık Izgara, Ayran ×2", amount: 480 },
  { table: "Paket #214", items: "Kaşarlı Pide ×2", amount: 360 },
  { table: "Masa 3", items: "Izgara Köfte, Salata", amount: 330 },
  { table: "Masa 12", items: "Tavuk Şiş ×3, Kola ×2", amount: 720 },
  { table: "Paket #215", items: "San Sebastian, Latte ×2", amount: 330 },
  { table: "Masa 5", items: "Lahmacun ×4, Şalgam ×2", amount: 440 },
];

// Haftalık bar grafiği verisi (Pzt–Paz) — hover tooltip gösterir.
const WEEK_BARS = [
  { day: "Pzt", value: 12400 },
  { day: "Sal", value: 14100 },
  { day: "Çar", value: 13200 },
  { day: "Per", value: 16800 },
  { day: "Cum", value: 21500 },
  { day: "Cmt", value: 26400 },
  { day: "Paz", value: 24100 },
];
const MAX_BAR = Math.max(...WEEK_BARS.map((b) => b.value));

// Günlük ciro eğrisi (area chart) — kendini çizer.
const CURVE = "M0,34 C10,30 18,26 28,24 C38,22 44,18 54,16 C64,14 72,10 84,7 L100,4";

function formatTL(value: number): string {
  return `₺${Math.round(value).toLocaleString("tr-TR")}`;
}

/** Yumuşak sayan ciro sayacı — hedef değiştikçe mevcut değerden akar. */
function useCountingValue(target: number, enabled: boolean) {
  const mv = useMotionValue(target);
  const [display, setDisplay] = useState(target);
  useEffect(() => {
    if (!enabled) {
      setDisplay(target);
      return;
    }
    const controls = animate(mv, target, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [target, enabled, mv]);
  return display;
}

export function BusinessDashboard() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-60px" });
  const reduced = useReducedMotion();
  const live = inView && !reduced;

  // --- Canlı sipariş akışı ---------------------------------------------------
  const [orders, setOrders] = useState(() => [
    { ...INCOMING_ORDERS[0], id: 0, status: "Mutfakta" },
    { ...INCOMING_ORDERS[1], id: 1, status: "Yolda" },
    { ...INCOMING_ORDERS[2], id: 2, status: "Servis edildi" },
  ]);
  const [revenue, setRevenue] = useState(18450);
  const [orderCount, setOrderCount] = useState(46);
  const [toast, setToast] = useState<{ id: number; table: string; amount: number } | null>(null);
  const nextRef = useRef(3);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      const idx = nextRef.current;
      const incoming = INCOMING_ORDERS[idx % INCOMING_ORDERS.length];
      nextRef.current = idx + 1;
      setOrders((prev) => [
        { ...incoming, id: idx, status: "Yeni" },
        ...prev.slice(0, 2),
      ]);
      setRevenue((r) => r + incoming.amount);
      setOrderCount((c) => c + 1);
      setToast({ id: idx, table: incoming.table, amount: incoming.amount });
    }, 4200);
    return () => clearInterval(id);
  }, [live]);

  // Toast birkaç saniye sonra kendini kapatır.
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  const shownRevenue = useCountingValue(revenue, live);

  // --- Bar tooltip -----------------------------------------------------------
  const [hoverBar, setHoverBar] = useState<number | null>(null);

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden rounded-[10px] bg-[#12141b] text-white"
      aria-hidden="true"
    >
      {/* Üst bar */}
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-accent text-[9px] font-bold">
            H
          </span>
          <p className="text-[11px] font-semibold text-white/90">
            HIZIR Panel <span className="font-normal text-white/40">· Lezzet Durağı</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* CANLI rozeti */}
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[8px] font-semibold text-emerald-400">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
              animate={live ? { opacity: [1, 0.3, 1] } : undefined}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            CANLI
          </span>
          <span className="relative text-white/50">
            <Bell className="h-3 w-3" />
            <AnimatePresence>
              {toast ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-accent text-[6px] font-bold"
                />
              ) : null}
            </AnimatePresence>
          </span>
        </div>
      </div>

      {/* Bildirim toast'ı */}
      <div className="pointer-events-none absolute right-3 top-10 z-10">
        <AnimatePresence>
          {toast ? (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#1c1f29]/95 px-2.5 py-1.5 shadow-lifted backdrop-blur"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 text-[8px]">
                🛎️
              </span>
              <div>
                <p className="text-[8.5px] font-semibold leading-tight">
                  Yeni sipariş — {toast.table}
                </p>
                <p className="text-[8px] leading-tight text-white/50">
                  {formatTL(toast.amount)} · şimdi
                </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="grid gap-2.5 p-3 sm:grid-cols-[1.35fr_1fr]">
        {/* Sol: statlar + grafikler */}
        <div className="space-y-2.5">
          {/* Stat kartları */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-white/[0.05] px-2.5 py-2">
              <p className="flex items-center gap-1 text-[7px] text-white/40">
                <TrendingUp className="h-2 w-2" /> Bugünkü ciro
              </p>
              <p className="mt-0.5 text-[13px] font-bold tabular-nums text-[#7ea2ff]">
                {formatTL(shownRevenue)}
              </p>
              <p className="text-[6.5px] text-emerald-400">▲ %12 düne göre</p>
            </div>
            <div className="rounded-lg bg-white/[0.05] px-2.5 py-2">
              <p className="flex items-center gap-1 text-[7px] text-white/40">
                <UtensilsCrossed className="h-2 w-2" /> Sipariş
              </p>
              <p className="mt-0.5 text-[13px] font-bold tabular-nums text-white/90">
                {orderCount}
              </p>
              <p className="text-[6.5px] text-white/35">bugün</p>
            </div>
            <div className="rounded-lg bg-white/[0.05] px-2.5 py-2">
              <p className="flex items-center gap-1 text-[7px] text-white/40">
                <Users className="h-2 w-2" /> Aktif masa
              </p>
              <p className="mt-0.5 text-[13px] font-bold tabular-nums text-white/90">
                14<span className="text-[9px] font-medium text-white/35">/24</span>
              </p>
              <p className="text-[6.5px] text-white/35">şu an</p>
            </div>
          </div>

          {/* Günlük ciro eğrisi — kendini çizer, ucunda nabız atan nokta */}
          <div className="rounded-lg bg-white/[0.05] p-2.5">
            <p className="text-[7.5px] font-medium text-white/50">Bugünkü satış akışı</p>
            <svg viewBox="0 0 100 38" className="mt-1 h-14 w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="hzr-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Dolgu alanı */}
              <motion.path
                d={`${CURVE} L100,38 L0,38 Z`}
                fill="url(#hzr-area)"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.9 }}
              />
              {/* Çizgi — pathLength ile kendini çizer */}
              <motion.path
                d={CURVE}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              />
              {/* Uçtaki canlı nokta */}
              <motion.circle
                cx="100"
                cy="4"
                r="2"
                fill="var(--color-accent)"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: [1, 0.4, 1], scale: [1, 1.5, 1] } : {}}
                transition={{ duration: 1.8, repeat: Infinity, delay: 1.9 }}
              />
            </svg>
          </div>

          {/* Haftalık barlar — hover'da tooltip */}
          <div className="rounded-lg bg-white/[0.05] p-2.5">
            <p className="text-[7.5px] font-medium text-white/50">Haftalık ciro</p>
            <div className="mt-1.5 flex h-16 items-end gap-1.5">
              {WEEK_BARS.map((bar, i) => (
                <div
                  key={bar.day}
                  className="relative flex flex-1 flex-col items-center gap-1"
                  onMouseEnter={() => setHoverBar(i)}
                  onMouseLeave={() => setHoverBar(null)}
                >
                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoverBar === i ? (
                      <motion.span
                        initial={{ opacity: 0, y: 4, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="absolute -top-5 z-10 whitespace-nowrap rounded-md bg-white px-1.5 py-0.5 text-[7px] font-semibold text-[#12141b] shadow-lifted"
                      >
                        {formatTL(bar.value)}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                  <motion.div
                    className="w-full cursor-pointer rounded-t-[3px]"
                    style={{
                      background:
                        hoverBar === i
                          ? "var(--color-accent)"
                          : "color-mix(in srgb, var(--color-accent) 45%, transparent)",
                    }}
                    initial={{ height: 0 }}
                    animate={inView ? { height: `${(bar.value / MAX_BAR) * 52}px` } : { height: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <span className="text-[6px] text-white/35">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sağ: canlı sipariş akışı */}
        <div className="flex flex-col rounded-lg bg-white/[0.05] p-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[7.5px] font-medium text-white/50">Sipariş akışı</p>
            <span className="text-[6.5px] text-white/30">şimdi</span>
          </div>
          <ul className="mt-1.5 space-y-1.5">
            <AnimatePresence initial={false}>
              {orders.map((order) => (
                <motion.li
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: -14, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  className="rounded-md bg-white/[0.05] px-2 py-1.5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[8px] font-semibold text-white/85">{order.table}</p>
                    <span
                      className="rounded-full px-1.5 py-[1px] text-[6px] font-medium"
                      style={
                        order.status === "Yeni"
                          ? { color: "#7ea2ff", background: "rgba(126,162,255,0.12)" }
                          : order.status === "Mutfakta"
                            ? { color: "#e0a95f", background: "rgba(224,169,95,0.12)" }
                            : order.status === "Yolda"
                              ? { color: "#7fbf8f", background: "rgba(127,191,143,0.12)" }
                              : { color: "#8f9fb5", background: "rgba(143,159,181,0.12)" }
                      }
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between">
                    <p className="truncate text-[7px] text-white/40">{order.items}</p>
                    <span className="ml-1.5 shrink-0 text-[7.5px] font-bold text-white/80">
                      {formatTL(order.amount)}
                    </span>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          {/* Mutfak durumu mini satırı */}
          <div className="mt-auto pt-1.5">
            <div className="flex items-center justify-between rounded-md bg-white/[0.04] px-2 py-1.5">
              <span className="text-[7px] text-white/40">Mutfak yoğunluğu</span>
              <div className="ml-2 h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  animate={live ? { width: ["46%", "72%", "58%", "66%", "46%"] } : { width: "58%" }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
