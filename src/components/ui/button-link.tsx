"use client";

import { motion } from "framer-motion";
import type { VariantProps } from "class-variance-authority";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

const interaction = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring", stiffness: 420, damping: 28 },
} as const;

/**
 * Buton görünümlü bağlantı. <Link><Button>...</Button></Link> deseni
 * <a> içinde <button> üretir — geçersiz HTML ve erişilebilirlik hatası.
 * Navigasyon amaçlı tüm "buton"lar bu bileşeni kullanmalı; gerçek
 * eylemler (form submit vb.) Button'da kalır.
 */
export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
} & VariantProps<typeof buttonVariants>) {
  // .shine: hover'da soldan sağa geçen ışık süpürmesi (globals.css).
  const classes = cn(buttonVariants({ variant, size }), "shine", className);

  // Sayfa içi çapa ve mailto bağlantıları locale-aware Link'ten geçmemeli.
  if (href.startsWith("#") || href.startsWith("mailto:")) {
    return (
      <motion.a href={href} {...interaction} className={classes}>
        {children}
      </motion.a>
    );
  }

  return (
    <MotionLink href={href} {...interaction} className={classes}>
      {children}
    </MotionLink>
  );
}
