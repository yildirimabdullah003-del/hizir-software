"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "@/i18n/navigation";

/**
 * Rota değiştiğinde içeriği ince bir fade + kaydırma ile geçirir.
 * `pathname` key'i değiştiğinde AnimatePresence eskiyi çıkarır, yeniyi
 * (server'da zaten render edilmiş children'ı) içeri alır.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
