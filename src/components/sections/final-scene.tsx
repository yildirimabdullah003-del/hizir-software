"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/reveal";
import { scaleIn } from "@/lib/motion";

/**
 * Final Sahnesi — sayfanın "end credits"i (masterplan V3 Sahne 6).
 * Cesur koyu zemin, yavaşça sürüklenen aurora, büyük güvenli tipografi ve
 * doruk noktası CTA. FAQ'nun açık zemininden koyuya uzun gradyanla erir;
 * altta koyudan tekrar surface'e döner ki footer temiz devam etsin.
 * Hareket yalnızca yavaş aurora (amaçlı, dikkat dağıtmaz); reduced-motion'da durağan.
 */
export function FinalScene({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  primaryHref = "/iletisim",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  primaryHref?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--color-surface) 0%, #0a0c14 26%, #0a0c14 82%, var(--color-surface) 100%)",
      }}
    >
      {/* Aurora sürüklenmesi — yavaş, ölçülü */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/3 h-[36rem] w-[36rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 40%, transparent) 0%, transparent 62%)",
          filter: "blur(60px)",
        }}
        animate={reduced ? undefined : { x: [0, 80, 0], y: [0, -30, 0], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 top-1/2 h-[30rem] w-[30rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, #7c5cff 34%, transparent) 0%, transparent 60%)",
          filter: "blur(64px)",
        }}
        animate={reduced ? undefined : { x: [0, -70, 0], y: [0, 24, 0], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* İnce yıldız dokusu */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 10%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, black 10%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 py-32 text-center sm:py-40">
        <Reveal variants={scaleIn}>
          <p className="mb-5 text-sm font-medium uppercase tracking-widest text-[#8fb0ff]">
            {eyebrow}
          </p>
          <h2 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-balance text-base text-white/55 sm:text-lg">
            {subtitle}
          </p>
          <div className="mt-10 flex justify-center">
            {/* Doruk CTA — fizik hissi + ışık süpürmesi */}
            <motion.div
              whileHover={reduced ? undefined : { y: -2 }}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
            >
              <Link
                href={primaryHref}
                className="shine group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-8 py-4 text-base font-semibold text-white shadow-[0_0_40px_-6px_color-mix(in_srgb,var(--color-accent)_70%,transparent)]"
              >
                {primaryCta}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-fast group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
