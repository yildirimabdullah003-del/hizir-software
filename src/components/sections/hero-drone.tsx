"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * HIZIR maskotu — markaya özel mini teslimat dronu. Hero vitrini etrafında
 * süzülür: rotorlar döner, gövde nazikçe salınır, altındaki paket ışıldar.
 * Amaç MiyavHav'daki kedi gibi sayfaya hayat vermek; abartısız, premium.
 * Tamamen SVG + transform animasyonu (GPU dostu, layout tetiklemez).
 */
export function HeroDrone({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      aria-hidden="true"
      // Süzülme rotası: yumuşak dikey salınım + çok hafif yatay sürüklenme.
      animate={
        reduced
          ? undefined
          : {
              y: [0, -10, 0, -6, 0],
              x: [0, 6, 0, -6, 0],
              rotate: [0, -2.5, 0, 2.5, 0],
            }
      }
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      whileHover={reduced ? undefined : { scale: 1.12, rotate: -6 }}
    >
      <svg
        width="92"
        height="78"
        viewBox="0 0 92 78"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rotor kolları */}
        <path
          d="M24 22 L40 30 M68 22 L52 30"
          stroke="var(--color-foreground)"
          strokeOpacity="0.35"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Rotorlar — dönüş hissi scaleX salınımıyla (top-down pervane) */}
        <motion.ellipse
          cx="24"
          cy="20"
          rx="14"
          ry="3.2"
          fill="var(--color-accent)"
          fillOpacity="0.5"
          animate={reduced ? undefined : { scaleX: [1, 0.25, 1] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "24px", originY: "20px" }}
        />
        <motion.ellipse
          cx="68"
          cy="20"
          rx="14"
          ry="3.2"
          fill="var(--color-accent)"
          fillOpacity="0.5"
          animate={reduced ? undefined : { scaleX: [0.25, 1, 0.25] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "68px", originY: "20px" }}
        />
        {/* Rotor göbekleri */}
        <circle cx="24" cy="20" r="2.6" fill="var(--color-foreground)" fillOpacity="0.5" />
        <circle cx="68" cy="20" r="2.6" fill="var(--color-foreground)" fillOpacity="0.5" />

        {/* Gövde — yuvarlatılmış kapsül, marka mavisi */}
        <rect x="32" y="26" width="28" height="18" rx="9" fill="var(--color-accent)" />
        {/* Gövdedeki H monogramı */}
        <path
          d="M41 31 V39 M51 31 V39 M41 35 H51"
          stroke="#ffffff"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Göz/ışık — nazikçe yanıp söner */}
        <motion.circle
          cx="46"
          cy="44"
          r="2"
          fill="#7ef0b0"
          animate={reduced ? undefined : { opacity: [1, 0.25, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Taşıma ipleri */}
        <path
          d="M38 44 L42 56 M54 44 L50 56"
          stroke="var(--color-foreground)"
          strokeOpacity="0.35"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Paket — sipariş kutusu */}
        <motion.g
          animate={reduced ? undefined : { rotate: [0, 3, 0, -3, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "46px", originY: "56px" }}
        >
          <rect
            x="38"
            y="56"
            width="16"
            height="13"
            rx="3"
            fill="var(--color-background)"
            stroke="var(--color-border)"
            strokeWidth="1.4"
          />
          <path d="M38 61.5 H54" stroke="var(--color-accent)" strokeWidth="1.4" />
          <path d="M46 56 V69" stroke="var(--color-accent)" strokeWidth="1.4" />
        </motion.g>
      </svg>
    </motion.div>
  );
}
