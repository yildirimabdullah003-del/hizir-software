"use client";

import { MotionConfig } from "framer-motion";

/**
 * Site genelinde tek noktadan animasyon politikası.
 * reducedMotion="user" → işletim sistemi "azaltılmış hareket" tercihini
 * otomatik algılar; framer-motion o durumda transform animasyonlarını
 * (scale/translate) devre dışı bırakıp yalnızca opacity geçişine indirger.
 * Her bileşende ayrı ayrı prefers-reduced-motion kontrolü yazmaya gerek kalmaz.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionConfig>
  );
}
