"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button — starter kit'in "değişmeyen katman" örneği (ADR 0005).
 * Mantık her projede aynı; görünüm token'lardan (globals.css @theme) gelir.
 * Bir projede rengi değiştirmek için token'ı değiştirmek yeterli; bu dosya
 * elle düzenlenmez.
 *
 * Hover/tap animasyonu burada, tek yerde tanımlanır; her kullanım (Hero,
 * CTA, form vb.) otomatik olarak aynı hissi paylaşır — çağıran taraflarda
 * ayrı motion sarmalayıcıları gerekmez.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:opacity-90",
        secondary:
          "bg-muted text-foreground hover:bg-[var(--color-border)]",
        outline:
          "border border-[var(--color-border)] bg-transparent text-foreground hover:bg-muted",
        ghost: "bg-transparent text-foreground hover:bg-muted",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-5",
        lg: "h-12 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends HTMLMotionProps<"button">,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
