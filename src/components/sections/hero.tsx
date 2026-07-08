"use client";

import { useState, type MouseEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { HeroShowcase } from "@/components/sections/hero-showcase";

/**
 * Ana sayfa Hero'su — solda ölçülü tipografi + CTA'lar, sağda ürünü
 * gösteren cihaz mockup'ları (HeroShowcase). Dev tipografi bilinçli olarak
 * terk edildi: ziyaretçi ilk ekranda ne sattığımızı GÖRMELİ.
 * Sahte rakam/referans içermez; yalnızca gerçek konumlandırma metni kullanılır.
 */
export function Hero() {
  const t = useTranslations("home.hero");
  const [glowActive, setGlowActive] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.4 });
  const glowY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.4 });
  const glowBackground = useMotionTemplate`radial-gradient(480px circle at ${glowX}px ${glowY}px, var(--color-accent) 0%, transparent 70%)`;

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
    if (!glowActive) setGlowActive(true);
  }

  return (
    <section onMouseMove={handleMouseMove} className="relative overflow-hidden">
      {/* Sabit, ince gradient zemin */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, var(--color-accent), transparent 55%)",
        }}
        aria-hidden="true"
      />
      {/* Blur'lu dekoratif accent blob'ları */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl sm:h-96 sm:w-96"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96"
        aria-hidden="true"
      />
      {/* İmleci takip eden hafif glow; ilk hareketten önce görünmez kalır */}
      <motion.div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-slow",
          glowActive ? "opacity-[0.08]" : "opacity-0"
        )}
        style={{ background: glowBackground }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-28 pt-20 sm:pt-28 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <motion.div
          variants={staggerContainer(0.12, 0.05)}
          initial="hidden"
          animate="visible"
          className="text-center lg:text-left"
        >
          <motion.p
            variants={fadeInUp}
            className="mb-5 text-sm font-medium tracking-widest text-muted-foreground uppercase"
          >
            {t("eyebrow")}
          </motion.p>
          <motion.h1
            variants={fadeInUp}
            className="text-balance text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl"
          >
            {t("title")}
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg lg:mx-0"
          >
            {t("subtitle")}
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <ButtonLink href="/iletisim" size="lg">
              {t("primaryCta")}
            </ButtonLink>
            <ButtonLink href="#fiyatlandirma" size="lg" variant="outline">
              {t("secondaryCta")}
            </ButtonLink>
          </motion.div>
        </motion.div>

        {/* Ürün vitrini — telefonun taşma payı için alt boşluk */}
        <div className="pb-10 lg:pb-6">
          <HeroShowcase />
        </div>
      </div>
    </section>
  );
}
