import type { Variants } from "framer-motion";

/**
 * Site genelinde paylaşılan Framer Motion variant'ları.
 * Süre/easing MotionProvider'daki MotionConfig'ten miras alınır;
 * burada yalnızca hareket şekli (transform/opacity) tanımlanır.
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

export function staggerContainer(
  staggerChildren = 0.08,
  delayChildren = 0
): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  };
}
