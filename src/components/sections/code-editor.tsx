"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * Mini kod editörü — Hizmetler bölümünün kendine özgü görsel dili
 * (masterplan Sahne 3). Görünür olduğunda satırlar bir kez, doğal hızda
 * "yazılır"; sonda başarı satırı belirir ve imleç söner. Döngü yok.
 * Markaya özel içerik: bir restoranın HIZIR ile ayağa kalkışı.
 */

type Token = { text: string; color?: string };
type Line = { indent: number; tokens: Token[] };

// Sözdizimi renkleri — koyu editör zemininde okunaklı, marka uyumlu sabitler.
const C = {
  keyword: "#c792ea",
  variable: "#e5e9f0",
  property: "#82aaff",
  string: "#c3e88d",
  boolean: "#f78c6c",
  punct: "rgba(229,233,240,0.55)",
  comment: "rgba(229,233,240,0.35)",
  success: "#7ef0b0",
} as const;

const LINES: Line[] = [
  {
    indent: 0,
    tokens: [
      { text: "const ", color: C.keyword },
      { text: "restoran", color: C.variable },
      { text: " = ", color: C.punct },
      { text: "new ", color: C.keyword },
      { text: "HizirApp", color: C.property },
      { text: "({", color: C.punct },
    ],
  },
  {
    indent: 1,
    tokens: [
      { text: "qrMenu", color: C.property },
      { text: ": ", color: C.punct },
      { text: "true", color: C.boolean },
      { text: ",", color: C.punct },
    ],
  },
  {
    indent: 1,
    tokens: [
      { text: "diller", color: C.property },
      { text: ": [", color: C.punct },
      { text: "\"tr\"", color: C.string },
      { text: ", ", color: C.punct },
      { text: "\"en\"", color: C.string },
      { text: "],", color: C.punct },
    ],
  },
  {
    indent: 1,
    tokens: [
      { text: "siparisler", color: C.property },
      { text: ": ", color: C.punct },
      { text: "\"canli\"", color: C.string },
      { text: ",", color: C.punct },
    ],
  },
  {
    indent: 0,
    tokens: [{ text: "});", color: C.punct }],
  },
  {
    indent: 0,
    tokens: [
      { text: "restoran", color: C.variable },
      { text: ".", color: C.punct },
      { text: "yayinla", color: C.property },
      { text: "();", color: C.punct },
    ],
  },
];

const SUCCESS_LINE = "✓ Yayında — aynı gün kurulum";
// Karakter başına yazım süresi (ms) — doğal ama sıkmayan tempo.
const CHAR_MS = 22;

function lineText(line: Line): string {
  return line.tokens.map((t) => t.text).join("");
}

export function CodeEditor({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-100px", once: true });
  const reduced = useReducedMotion();

  // typed[i] = i. satırın o ana kadar yazılmış karakter sayısı.
  const [typed, setTyped] = useState<number[]>(() => LINES.map(() => 0));
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      // Azaltılmış hareket: her şey anında, tam yazılmış görünür.
      setTyped(LINES.map((l) => lineText(l).length));
      setDone(true);
      return;
    }
    let line = 0;
    let char = 0;
    const id = setInterval(() => {
      if (line >= LINES.length) {
        clearInterval(id);
        setDone(true);
        return;
      }
      char += 1;
      const target = lineText(LINES[line]).length;
      // Updater asenkron çalışır; `line`/`char` closure'da değişmeden önce
      // değerleri sabitle (yoksa her satırın son karakteri kaybolur).
      const writeLine = line;
      const writeChar = Math.min(char, target);
      setTyped((prev) => {
        const next = [...prev];
        next[writeLine] = writeChar;
        return next;
      });
      if (char >= target) {
        line += 1;
        char = 0;
      }
    }, CHAR_MS);
    return () => clearInterval(id);
  }, [inView, reduced]);

  // Aktif (yazılmakta olan) satır — imleç orada yanıp söner.
  const activeLine = typed.findIndex(
    (n, i) => n < lineText(LINES[i]).length
  );

  // Tam yazılmış satır sayısı — çıktı önizlemesi buna göre kendini kurar.
  const completed = typed.filter((n, i) => n >= lineText(LINES[i]).length).length;

  return (
    <div
      ref={rootRef}
      className={className}
      aria-hidden="true"
    >
      <div className="grid items-stretch gap-4 lg:grid-cols-[1.15fr_1fr]">
      <div className="overflow-hidden rounded-xl border border-black/40 bg-[#12141b] shadow-lifted">
        {/* Pencere çubuğu */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-2 text-[10px] text-white/35">kurulum.ts — HIZIR</span>
        </div>
        {/* Kod alanı */}
        <div className="px-4 py-4 font-mono text-[11px] leading-6 sm:px-5 sm:text-xs">
          {LINES.map((line, i) => {
            const shown = typed[i];
            if (shown === 0 && i !== 0 && typed[i - 1] < lineText(LINES[i - 1]).length) {
              // Henüz sırası gelmemiş satır: yer tutucu (yükseklik zıplamasın).
              return <div key={i} className="h-6" />;
            }
            let remaining = shown;
            return (
              <div key={i} style={{ paddingLeft: line.indent * 16 }}>
                <span className="mr-4 inline-block w-4 select-none text-right text-white/20">
                  {i + 1}
                </span>
                {line.tokens.map((token, j) => {
                  if (remaining <= 0) return null;
                  const take = Math.min(remaining, token.text.length);
                  remaining -= take;
                  return (
                    <span key={j} style={{ color: token.color }}>
                      {token.text.slice(0, take)}
                    </span>
                  );
                })}
                {i === activeLine ? (
                  <motion.span
                    className="ml-0.5 inline-block h-3.5 w-[6px] translate-y-0.5 bg-white/70"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                  />
                ) : null}
              </div>
            );
          })}
          {/* Başarı satırı — yazım bitince belirir */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={done ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3"
          >
            <span style={{ color: C.success }} className="text-[11px]">
              {SUCCESS_LINE}
            </span>
          </motion.div>
        </div>
      </div>

      {/* --- Canlı çıktı: kod yazıldıkça kendini kuran QR menü --- */}
      <OutputPreview completed={completed} done={done} />
      </div>
    </div>
  );
}

/**
 * Kod editörünün "çıktısı" — kod yazıldıkça (completed arttıkça) kendini
 * kuran bir QR menü önizlemesi. Girdi→çıktı bağı: her config satırı bittiğinde
 * karşılığı çıktıda belirir. "Böyle inşa ediyoruz"un görsel karşılığı.
 */
function OutputPreview({ completed, done }: { completed: number; done: boolean }) {
  const reduced = useReducedMotion();
  const reveal = (n: number) => ({
    initial: reduced ? false : { opacity: 0, y: 8 },
    animate: completed >= n ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
      {/* Tarayıcı çubuğu */}
      <div className="flex items-center gap-2 border-b border-border bg-background px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-black/15" />
        <span className="flex-1 truncate rounded-md bg-muted px-2.5 py-1 text-[9px] text-muted-foreground">
          fincankahve.hizir.app
        </span>
        {/* Yayında rozeti — yayinla() bitince */}
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={done ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          className="flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[8px] font-semibold text-emerald-600"
        >
          <span className="h-1 w-1 rounded-full bg-emerald-500" /> Yayında
        </motion.span>
      </div>

      {/* İçerik */}
      <div className="flex-1 p-4">
        {/* Başlık — qrMenu: true bitince (completed>=2) */}
        <motion.div {...reveal(2)} className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-[11px] font-bold text-accent">
            F
          </span>
          <div className="leading-tight">
            <p className="text-[11px] font-semibold tracking-tight">Fincan Kahve</p>
            <p className="text-[7px] uppercase tracking-widest text-muted-foreground">
              Dijital Menü
            </p>
          </div>
        </motion.div>

        {/* Dil sekmeleri — diller bitince (completed>=3) */}
        <motion.div {...reveal(3)} className="mt-3 flex gap-1.5">
          {["TR", "EN"].map((l, i) => (
            <span
              key={l}
              className={
                i === 0
                  ? "rounded-full bg-accent px-2 py-0.5 text-[8px] font-semibold text-white"
                  : "rounded-full bg-muted px-2 py-0.5 text-[8px] text-muted-foreground"
              }
            >
              {l}
            </span>
          ))}
        </motion.div>

        {/* Ürünler — siparisler bitince (completed>=4) */}
        <motion.div {...reveal(4)} className="mt-3 space-y-1.5">
          {[
            ["Karamel Latte", "₺95", "#b08a5f"],
            ["San Sebastian", "₺140", "#c07f3f"],
          ].map(([name, price, color]) => (
            <div
              key={name}
              className="flex items-center gap-2 rounded-lg border border-border bg-background p-1.5"
            >
              <span
                className="h-6 w-6 shrink-0 rounded-md"
                style={{ background: `radial-gradient(circle at 40% 30%, ${color}bb, ${color})` }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[8.5px] font-semibold">{name}</p>
                <div className="mt-0.5 h-1 w-8 rounded bg-black/10" />
              </div>
              <span className="text-[8.5px] font-bold text-accent">{price}</span>
            </div>
          ))}
          {/* Canlı sipariş göstergesi */}
          <div className="flex items-center gap-1.5 pt-0.5 text-[7.5px] text-emerald-600">
            <motion.span
              className="h-1 w-1 rounded-full bg-emerald-500"
              animate={done && !reduced ? { opacity: [1, 0.3, 1] } : undefined}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            canlı sipariş alımı açık
          </div>
        </motion.div>
      </div>
    </div>
  );
}
