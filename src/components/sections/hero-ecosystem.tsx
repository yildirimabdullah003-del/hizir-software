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
import { Check, TrendingUp, Bike } from "lucide-react";

/**
 * Hero Ekosistemi — "Sipariş Yolculuğu".
 *
 * Laptop/cihaz çerçevesi YOK. Üç çerçevesiz ürün yüzeyi bir takımyıldız gibi
 * dizilir ve İÇLERİ yaşar:
 *   1) QR Menü (müşteri tarafı, açık cam yüzey)
 *   2) Canlı Sipariş Akışı (işletme tarafı, koyu ürün ekranı — kontrast/derinlik)
 *   3) Ciro (analitik, açık istatistik kartı)
 * Yüzeyler SABİT durur (masterplan: "objeler oynamaz"). Onları bağlayan ince
 * hatlar üzerinde ~5.5sn'de bir bir IŞIK DARBESİ müşterinin siparişini taşır:
 * QR'da "sepete eklendi" → sipariş akışına yeni satır düşer → ciro sayacı artar.
 * Bu akış dili, Süreç bölümündeki workflow hattıyla akrabadır (tek hikâye).
 * İmleç yalnızca zemin/derinlik katmanlarını kaydırır; yüzeyler eğilmez.
 * Azaltılmış harekette her şey durağan ve tam dolu görünür.
 */

// Sipariş akışına dönüşümlü düşen kayıtlar.
const ORDERS = [
  { table: "Masa 7", items: "Karışık Izgara ×1, Ayran ×2", amount: 480 },
  { table: "Paket #214", items: "Kaşarlı Pide ×2", amount: 360 },
  { table: "Masa 3", items: "Izgara Köfte, Salata", amount: 330 },
  { table: "Masa 12", items: "Tavuk Şiş ×3, Kola ×2", amount: 720 },
  { table: "Paket #215", items: "San Sebastian ×1, Latte ×2", amount: 330 },
];

const CYCLE_MS = 5500;
const REACH_FEED_MS = 1250; // darbe sipariş ekranına ulaşır
const REACH_REVENUE_MS = 2950; // darbe ciro kartına ulaşır

function formatTL(v: number): string {
  return `₺${Math.round(v).toLocaleString("tr-TR")}`;
}

export function HeroEcosystem() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-80px" });
  const reduced = useReducedMotion();
  const live = inView && !reduced;

  // Sipariş akışı — en yeni üstte.
  const [feed, setFeed] = useState(() => [
    { ...ORDERS[2], id: -3, status: "Mutfakta" },
    { ...ORDERS[1], id: -2, status: "Yolda" },
    { ...ORDERS[0], id: -1, status: "Servis" },
  ]);
  const [revenue, setRevenue] = useState(18450);
  const [cycle, setCycle] = useState(0);
  const [tap, setTap] = useState(false);
  const [spark, setSpark] = useState(7); // sparkline uzunluğu
  const nextRef = useRef(0);

  // Ciro sayacı — hedef değiştikçe akar.
  const revMV = useMotionValue(18450);
  const [revShown, setRevShown] = useState(18450);
  useEffect(() => {
    const controls = animate(revMV, revenue, {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setRevShown(v),
    });
    return () => controls.stop();
  }, [revenue, revMV]);

  // --- Merkezî koreografi: darbenin yolculuğu ile tepkiler senkron -----------
  useEffect(() => {
    if (!live) return;
    let mounted = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    function run() {
      if (!mounted) return;
      setCycle((c) => c + 1);
      setTap(true);
      timers.push(setTimeout(() => mounted && setTap(false), 1500));
      // Darbe sipariş ekranına ulaşınca yeni sipariş düşer.
      timers.push(
        setTimeout(() => {
          if (!mounted) return;
          const o = ORDERS[nextRef.current % ORDERS.length];
          nextRef.current += 1;
          setFeed((prev) => [{ ...o, id: nextRef.current, status: "Yeni" }, ...prev.slice(0, 2)]);
        }, REACH_FEED_MS)
      );
      // Darbe ciro kartına ulaşınca sayaç ve sparkline artar.
      timers.push(
        setTimeout(() => {
          if (!mounted) return;
          const o = ORDERS[(nextRef.current - 1 + ORDERS.length) % ORDERS.length];
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
    <div
      ref={rootRef}
      className="relative mx-auto aspect-[5/5.4] w-full max-w-[34rem] sm:aspect-[5/4.6]"
      aria-hidden="true"
    >
      {/* --- Bağlantı hatları + akan darbe (SVG overlay, sahne koordinatı) --- */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* QR → Sipariş akışı */}
        <path
          d="M26 46 C 36 46, 40 42, 50 42"
          stroke="var(--color-accent)"
          strokeOpacity="0.22"
          strokeWidth="0.5"
          strokeDasharray="1.5 1.5"
        />
        {/* Sipariş akışı → Ciro */}
        <path
          d="M60 64 C 62 72, 60 76, 64 78"
          stroke="var(--color-accent)"
          strokeOpacity="0.22"
          strokeWidth="0.5"
          strokeDasharray="1.5 1.5"
        />
      </svg>

      {/* Akan sipariş darbesi — her döngüde yolu tek seferde kat eder */}
      {live ? (
        <motion.span
          key={cycle}
          className="absolute z-30 h-2.5 w-2.5 rounded-full bg-accent"
          style={{ boxShadow: "0 0 14px 2px color-mix(in srgb, var(--color-accent) 75%, transparent)" }}
          initial={{ left: "24%", top: "45%", opacity: 0, scale: 0.6 }}
          animate={{
            left: ["24%", "24%", "50%", "50%", "63%", "63%"],
            top: ["45%", "45%", "42%", "42%", "78%", "78%"],
            opacity: [0, 1, 1, 1, 1, 0],
            scale: [0.6, 1, 1, 1, 1, 0.6],
          }}
          transition={{
            duration: CYCLE_MS / 1000,
            times: [0, 0.06, 0.24, 0.5, 0.56, 0.7],
            ease: "easeInOut",
          }}
        />
      ) : null}

      {/* ============ Yüzey 1 — QR Menü (müşteri, açık cam) ============ */}
      <SurfaceCard className="absolute left-0 top-[26%] w-[46%] sm:w-[42%]" delay={0.15}>
        <div className="border-b border-black/5 px-3 py-2">
          <p className="text-[9px] font-semibold tracking-tight">Fincan Kahve</p>
          <p className="text-[7px] uppercase tracking-widest text-muted-foreground">
            QR Menü
          </p>
        </div>
        <div className="space-y-1.5 p-2.5">
          {[
            ["Karamel Latte", "₺95"],
            ["San Sebastian", "₺140"],
          ].map(([name, price], i) => (
            <div
              key={name}
              className="relative flex items-center gap-2 rounded-lg border border-black/[0.06] bg-white p-1.5"
            >
              <span
                className="h-6 w-6 shrink-0 rounded-md"
                style={{
                  background:
                    i === 0
                      ? "radial-gradient(circle at 40% 30%, #e8d5bf, #b08a5f 60%, #6f4f33)"
                      : "radial-gradient(circle at 55% 35%, #f5e8cf, #e0bf8a 60%, #a8743f)",
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[8px] font-semibold">{name}</p>
                <div className="mt-0.5 h-1 w-8 rounded bg-black/10" />
              </div>
              <span className="text-[8px] font-bold text-accent">{price}</span>
              {/* İlk üründe dokunuş dalgası — döngü başında */}
              {i === 0 && live ? (
                <motion.span
                  key={cycle}
                  className="pointer-events-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-accent"
                  initial={{ scale: 0, opacity: 0.7 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                />
              ) : null}
            </div>
          ))}
          {/* "Sepete eklendi" onayı */}
          <div className="h-5">
            <AnimatePresence>
              {tap ? (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[7.5px] font-medium text-emerald-700"
                >
                  <Check className="h-2.5 w-2.5" /> Sepete eklendi
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </SurfaceCard>

      {/* ============ Yüzey 2 — Canlı Sipariş Akışı (koyu ürün ekranı) ============ */}
      <SurfaceCard
        className="absolute right-0 top-0 w-[64%] sm:w-[60%]"
        dark
        delay={0.05}
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded bg-accent text-[8px] font-bold text-white">
              H
            </span>
            <p className="text-[9px] font-semibold text-white/90">Canlı Sipariş</p>
          </div>
          <span className="flex items-center gap-1 text-[7px] font-semibold text-emerald-400">
            <motion.span
              className="h-1 w-1 rounded-full bg-emerald-400"
              animate={live ? { opacity: [1, 0.3, 1] } : undefined}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            CANLI
          </span>
        </div>
        <ul className="space-y-1.5 p-2.5">
          <AnimatePresence initial={false}>
            {feed.map((o) => (
              <motion.li
                key={o.id}
                layout
                initial={{ opacity: 0, y: -12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 340, damping: 28 }}
                className="rounded-lg bg-white/[0.05] px-2 py-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[8.5px] font-semibold text-white/90">
                    {o.table}
                  </span>
                  <span
                    className="rounded-full px-1.5 py-[1px] text-[6.5px] font-medium"
                    style={statusStyle(o.status)}
                  >
                    {o.status}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="truncate text-[7px] text-white/40">{o.items}</span>
                  <span className="shrink-0 text-[8px] font-bold text-white/80">
                    {formatTL(o.amount)}
                  </span>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </SurfaceCard>

      {/* ============ Yüzey 3 — Ciro (analitik, açık kart) ============ */}
      <SurfaceCard
        className="absolute bottom-0 right-[6%] w-[52%] sm:w-[46%]"
        delay={0.25}
      >
        <div className="p-3">
          <p className="flex items-center gap-1 text-[7.5px] font-medium text-muted-foreground">
            <TrendingUp className="h-2.5 w-2.5 text-emerald-500" /> Bugünkü ciro
          </p>
          <p className="mt-0.5 text-lg font-bold tracking-tight tabular-nums">
            {formatTL(revShown)}
          </p>
          {/* Mini sparkline — sipariş geldikçe uzar */}
          <svg viewBox="0 0 100 24" className="mt-1 h-6 w-full" preserveAspectRatio="none">
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
          <p className="mt-0.5 flex items-center gap-1 text-[7px] text-emerald-600">
            <Bike className="h-2.5 w-2.5" /> canlı sipariş akışı
          </p>
        </div>
      </SurfaceCard>
    </div>
  );
}

/* --- Çerçevesiz cam yüzey kabuğu — açık veya koyu --- */
function SurfaceCard({
  children,
  className,
  dark = false,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <div
        className={
          dark
            ? "overflow-hidden rounded-2xl border border-white/10 bg-[#12141b]/95 shadow-[0_24px_60px_-20px_rgba(10,10,20,0.55)] backdrop-blur-xl"
            : "overflow-hidden rounded-2xl border border-black/[0.06] bg-white/85 shadow-[0_20px_50px_-20px_rgba(10,10,20,0.25)] backdrop-blur-xl"
        }
      >
        {children}
      </div>
    </motion.div>
  );
}

function statusStyle(status: string): React.CSSProperties {
  switch (status) {
    case "Yeni":
      return { color: "#7ea2ff", background: "rgba(126,162,255,0.14)" };
    case "Mutfakta":
      return { color: "#e0a95f", background: "rgba(224,169,95,0.14)" };
    case "Yolda":
      return { color: "#7fbf8f", background: "rgba(127,191,143,0.14)" };
    default:
      return { color: "#8f9fb5", background: "rgba(143,159,181,0.14)" };
  }
}

/** N noktalı, deterministik yükselen sparkline yolu üretir. */
function sparkPath(points: number): string {
  const ys = [16, 13, 15, 10, 12, 7, 9, 6, 8, 4, 6, 3];
  const n = Math.max(2, Math.min(points, ys.length));
  const step = 100 / (n - 1);
  return ys
    .slice(0, n)
    .map((y, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${y}`)
    .join(" ");
}
