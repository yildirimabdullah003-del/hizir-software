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

  return (
    <div
      ref={rootRef}
      className={className}
      aria-hidden="true"
    >
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
    </div>
  );
}
