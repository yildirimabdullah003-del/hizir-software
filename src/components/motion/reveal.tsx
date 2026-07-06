"use client";

import { motion, type Variants } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

/**
 * Görünüme girince (viewport'a bir kez) çözülen ortak scroll-reveal sarmalayıcı.
 * `once: true` ile ekrana her girişte yeniden tetiklenmez; bu hem performansı
 * korur hem de tekrar eden hareketin dikkat dağıtmasını önler.
 */
export function Reveal({
  children,
  variants = fadeInUp,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  variants?: Variants;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
