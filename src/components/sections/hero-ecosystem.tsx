"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
 * dizilir ve İÇLERİ yaşar. Yüzeyleri bağlayan hatlar DİNAMİK ölçülür: her
 * yüzeyin gerçek DOM kutusu (offset) okunur, çizgiler kenarlara TAM değecek
 * şekilde çizilir ve ışık darbesi bu ölçülen yol üzerinde akar. Böylece içerik
 * yüksekliği değişse bile hatlar kopmaz. Yüzeyler sabittir; hareket içerikte.
 * Azaltılmış harekette her şey durağan ve tam dolu görünür.
 */

const ORDERS = [
  { table: "Masa 7", items: "Karışık Izgara ×1, Ayran ×2", amount: 480 },
  { table: "Paket #214", items: "Kaşarlı Pide ×2", amount: 360 },
  { table: "Masa 3", items: "Izgara Köfte, Salata", amount: 330 },
  { table: "Masa 12", items: "Tavuk Şiş ×3, Kola ×2", amount: 720 },
  { table: "Paket #215", items: "San Sebastian ×1, Latte ×2", amount: 330 },
];

const CYCLE_MS = 5500;
const REACH_FEED_MS = 1250;
const REACH_REVENUE_MS = 2950;

function formatTL(v: number): string {
  return `₺${Math.round(v).toLocaleString("tr-TR")}`;
}

type Pt = { x: number; y: number };
type Geo = {
  w: number;
  h: number;
  aQR: Pt; // QR yüzeyi sağ-orta (hat 1 başlangıcı)
  aFeedIn: Pt; // sipariş akışı sol-orta (hat 1 bitişi)
  aFeedOut: Pt; // sipariş akışı alt (hat 2 başlangıcı)
  aRev: Pt; // ciro yüzeyi üst-orta (hat 2 bitişi)
};

function curve(a: Pt, b: Pt): string {
  // Yumuşak yatay/dikey ağırlıklı bezier — kenarlardan çıkıp kenara değer.
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const horiz = Math.abs(dx) > Math.abs(dy);
  const c1 = horiz ? { x: a.x + dx * 0.5, y: a.y } : { x: a.x, y: a.y + dy * 0.5 };
  const c2 = horiz ? { x: a.x + dx * 0.5, y: b.y } : { x: b.x, y: a.y + dy * 0.5 };
  return `M${a.x},${a.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${b.x},${b.y}`;
}

export function HeroEcosystem() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const revRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sceneRef, { margin: "-80px" });
  const reduced = useReducedMotion();
  const live = inView && !reduced;

  const [feed, setFeed] = useState(() => [
    { ...ORDERS[2], id: -3, status: "Mutfakta" },
    { ...ORDERS[1], id: -2, status: "Yolda" },
    { ...ORDERS[0], id: -1, status: "Servis" },
  ]);
  const [revenue, setRevenue] = useState(18450);
  const [cycle, setCycle] = useState(0);
  const [tap, setTap] = useState(false);
  const [spark, setSpark] = useState(7);
  const [geo, setGeo] = useState<Geo | null>(null);
  const nextRef = useRef(0);

  // Ciro sayacı akışı.
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

  // --- Yüzey kutularını ölç: çizgiler kenarlara tam değsin -------------------
  useLayoutEffect(() => {
    function measure() {
      const scene = sceneRef.current;
      const qr = qrRef.current;
      const fd = feedRef.current;
      const rv = revRef.current;
      if (!scene || !qr || !fd || !rv) return;
      // offset* transform'dan etkilenmez → yüzeyler animasyonda bile son
      // yerleşim kutusunu verir (sahne position:relative, yüzeyler absolute).
      const box = (el: HTMLElement) => ({
        L: el.offsetLeft,
        T: el.offsetTop,
        W: el.offsetWidth,
        H: el.offsetHeight,
      });
      const q = box(qr);
      const f = box(fd);
      const r = box(rv);
      setGeo({
        w: scene.offsetWidth,
        h: scene.offsetHeight,
        aQR: { x: q.L + q.W, y: q.T + q.H * 0.5 },
        aFeedIn: { x: f.L, y: f.T + f.H * 0.62 },
        aFeedOut: { x: f.L + f.W * 0.4, y: f.T + f.H },
        aRev: { x: r.L + r.W * 0.5, y: r.T },
      });
    }
    measure();
    const ro = new ResizeObserver(measure);
    [sceneRef, qrRef, feedRef, revRef].forEach(
      (r) => r.current && ro.observe(r.current)
    );
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // --- Merkezî koreografi ---------------------------------------------------
  useEffect(() => {
    if (!live) return;
    let mounted = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    function run() {
      if (!mounted) return;
      setCycle((c) => c + 1);
      setTap(true);
      timers.push(setTimeout(() => mounted && setTap(false), 1500));
      timers.push(
        setTimeout(() => {
          if (!mounted) return;
          const o = ORDERS[nextRef.current % ORDERS.length];
          nextRef.current += 1;
          setFeed((prev) => [{ ...o, id: nextRef.current, status: "Yeni" }, ...prev.slice(0, 2)]);
        }, REACH_FEED_MS)
      );
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
      ref={sceneRef}
      className="relative mx-auto aspect-[5/5.6] w-full max-w-[36rem] sm:aspect-[5/5]"
      aria-hidden="true"
    >
      {/* Yüzeyleri birbirine bağlayan yumuşak accent halesi (bütünlük) */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 12%, transparent) 0%, transparent 68%)",
          filter: "blur(24px)",
        }}
      />

      {/* --- Bağlantı hatları + akan darbe (ölçülen px koordinatları) --- */}
      {geo ? (
        <svg
          className="pointer-events-none absolute inset-0"
          width={geo.w}
          height={geo.h}
          fill="none"
        >
          <defs>
            <linearGradient id="hzr-wire" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.05" />
              <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {[curve(geo.aQR, geo.aFeedIn), curve(geo.aFeedOut, geo.aRev)].map((d, i) => (
            <g key={i}>
              {/* Zemin hattı */}
              <path d={d} stroke="url(#hzr-wire)" strokeWidth="1.5" />
              {/* Akan kesikli üst katman (hafif canlılık) */}
              {live ? (
                <motion.path
                  d={d}
                  stroke="var(--color-accent)"
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                  strokeDasharray="3 10"
                  initial={{ strokeDashoffset: 26 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                />
              ) : null}
              {/* Uç düğümleri — kenara değdiğini vurgular */}
              <circle
                cx={i === 0 ? geo.aQR.x : geo.aFeedOut.x}
                cy={i === 0 ? geo.aQR.y : geo.aFeedOut.y}
                r="2.5"
                fill="var(--color-accent)"
              />
              <circle
                cx={i === 0 ? geo.aFeedIn.x : geo.aRev.x}
                cy={i === 0 ? geo.aFeedIn.y : geo.aRev.y}
                r="2.5"
                fill="var(--color-accent)"
              />
            </g>
          ))}
        </svg>
      ) : null}

      {/* Akan sipariş darbesi — ölçülen yol üzerinde */}
      {live && geo ? (
        <motion.span
          key={cycle}
          className="absolute z-30 h-3 w-3 rounded-full bg-accent"
          style={{
            boxShadow: "0 0 16px 3px color-mix(in srgb, var(--color-accent) 75%, transparent)",
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ left: geo.aQR.x, top: geo.aQR.y, opacity: 0, scale: 0.5 }}
          animate={{
            left: [
              geo.aQR.x,
              geo.aQR.x,
              geo.aFeedIn.x,
              geo.aFeedIn.x,
              geo.aFeedOut.x,
              geo.aFeedOut.x,
              geo.aRev.x,
              geo.aRev.x,
            ],
            top: [
              geo.aQR.y,
              geo.aQR.y,
              geo.aFeedIn.y,
              geo.aFeedIn.y,
              geo.aFeedOut.y,
              geo.aFeedOut.y,
              geo.aRev.y,
              geo.aRev.y,
            ],
            opacity: [0, 1, 1, 0, 0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.6, 0.6, 1, 1, 0.5],
          }}
          transition={{
            duration: CYCLE_MS / 1000,
            times: [0, 0.05, 0.22, 0.3, 0.34, 0.4, 0.54, 0.62],
            ease: "easeInOut",
          }}
        />
      ) : null}

      {/* ============ Yüzey 1 — QR Menü ============ */}
      <div ref={qrRef} className="absolute left-0 top-[18%] z-10 w-[40%] sm:w-[38%]">
        <SurfaceCard delay={0.15}>
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
      </div>

      {/* ============ Yüzey 2 — Canlı Sipariş Akışı (koyu) ============ */}
      <div ref={feedRef} className="absolute right-0 top-0 z-0 w-[58%] sm:w-[56%]">
        <SurfaceCard dark delay={0.05}>
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
      </div>

      {/* ============ Yüzey 3 — Ciro ============ */}
      <div ref={revRef} className="absolute bottom-0 left-[8%] z-10 w-[50%] sm:w-[46%]">
        <SurfaceCard delay={0.25}>
          <div className="p-3">
            <p className="flex items-center gap-1 text-[7.5px] font-medium text-muted-foreground">
              <TrendingUp className="h-2.5 w-2.5 text-emerald-500" /> Bugünkü ciro
            </p>
            <p className="mt-0.5 text-lg font-bold tracking-tight tabular-nums">
              {formatTL(revShown)}
            </p>
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
    </div>
  );
}

function SurfaceCard({
  children,
  dark = false,
  delay = 0,
}: {
  children: React.ReactNode;
  dark?: boolean;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={
        dark
          ? "overflow-hidden rounded-2xl border border-white/10 bg-[#12141b]/95 shadow-[0_24px_60px_-20px_rgba(10,10,20,0.55)] backdrop-blur-xl"
          : "overflow-hidden rounded-2xl border border-black/[0.06] bg-white/85 shadow-[0_20px_50px_-20px_rgba(10,10,20,0.25)] backdrop-blur-xl"
      }
    >
      {children}
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

function sparkPath(points: number): string {
  const ys = [16, 13, 15, 10, 12, 7, 9, 6, 8, 4, 6, 3];
  const n = Math.max(2, Math.min(points, ys.length));
  const step = 100 / (n - 1);
  return ys
    .slice(0, n)
    .map((y, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${y}`)
    .join(" ");
}
