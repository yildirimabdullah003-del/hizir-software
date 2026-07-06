"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/button-link";
import { fadeInUp, staggerContainer } from "@/lib/motion";

/**
 * Hizmet detay sayfaları için premium hero — her hizmet sayfası bu
 * bileşeni kendi çevirileriyle yeniden kullanır (bkz. [slug]/page.tsx).
 */
export function ServiceHero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  primaryHref = "/iletisim",
  secondaryCta,
  secondaryHref = "#paketler",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  primaryHref?: string;
  secondaryCta?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, var(--color-accent), transparent 55%)",
        }}
        aria-hidden="true"
      />
      <motion.div
        variants={staggerContainer(0.12, 0.05)}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:py-32"
      >
        <motion.p
          variants={fadeInUp}
          className="mb-5 text-sm font-medium tracking-widest text-accent uppercase"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          variants={fadeInUp}
          className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="mx-auto mt-6 max-w-xl text-balance text-lg text-muted-foreground"
        >
          {subtitle}
        </motion.p>
        <motion.div
          variants={fadeInUp}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <ButtonLink href={primaryHref} size="lg">
            {primaryCta}
          </ButtonLink>
          {secondaryCta ? (
            <ButtonLink href={secondaryHref} size="lg" variant="outline">
              {secondaryCta}
            </ButtonLink>
          ) : null}
        </motion.div>
      </motion.div>
    </section>
  );
}
