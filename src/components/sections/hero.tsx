"use client";

import { useRef, type MouseEvent } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { HeroEcosystem } from "@/components/sections/hero-ecosystem";
import { HeroStarfield } from "@/components/sections/hero-starfield";

/**
 * Ana sayfa Hero'su — "Sipariş Yolculuğu".
 *
 * Laptop/cihaz mockup'ı YOK. Solda editoryal başlık + CTA, sağda çerçevesiz
 * yüzen ürün yüzeylerinden oluşan yaşayan bir ekosistem (HeroEcosystem):
 * QR menü → canlı sipariş akışı → ciro, aralarında akan bir sipariş darbesiyle
 * bağlı. Objeler sabittir; hareket İÇERİKTEDİR.
 *
 * Sayfaya bağlanma: sticky kilit yok. Scroll'da katmanlar hafifçe ayrışır,
 * zemin ışıması aşağı süzülür ve bölüm bir sonraki (fiyatlandırma) sahnenin
 * başlangıcı gibi doğal akar. Zemin katmanları imleçle çok hafif parallax
 * yapar (derinlik); yüzeyler eğilmez. Azaltılmış harekette durağan.
 */
export function Hero() {
  const t = useTranslations("home.hero");
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Scroll ile hafif ayrışma (parallax) — sahne sonraki bölüme doğal akar.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const smooth = { stiffness: 240, damping: 34, mass: 0.6 };
  const textY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -70]), smooth);
  const sceneY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 60]), smooth);
  const glowY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 120]), smooth);

  // İmleç yalnızca zemin ışımasını kaydırır (katman derinliği; yüzeyler sabit).
  const bgX = useSpring(0, { stiffness: 50, damping: 20 });
  const bgY = useSpring(0, { stiffness: 50, damping: 20 });
  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    bgX.set(((event.clientX - rect.left) / rect.width - 0.5) * 40);
    bgY.set(((event.clientY - rect.top) / rect.height - 0.5) * 24);
  }
  function handleMouseLeave() {
    bgX.set(0);
    bgY.set(0);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden"
      style={{
        // Full beyaz değil: üstte serin bir tint, sağ-üstte hafif accent,
        // aşağı doğru background'a erir — premium, derinlikli bir zemin.
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--color-accent) 5%, var(--color-surface)) 0%, var(--color-background) 55%), radial-gradient(120% 80% at 78% 8%, color-mix(in srgb, var(--color-accent) 10%, transparent) 0%, transparent 55%)",
      }}
    >
      {/* --- Zemin: akan yıldız alanı + morph eden aurora + ince ızgara --- */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        style={{ y: reduced ? undefined : glowY }}
      >
        {/* İnce nokta ızgarası, merkeze doğru maskeli */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.4,
            backgroundImage:
              "radial-gradient(color-mix(in srgb, var(--color-foreground) 8%, transparent) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 60% 35%, black 20%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 60% 35%, black 20%, transparent 72%)",
          }}
        />
        {/* Akan yıldız/parçacık alanı (aura hissi) */}
        <HeroStarfield className="absolute inset-0" />
        {/* Aurora ışıma blob'ları — yavaşça nefes alır + imleçle hafif parallax */}
        <motion.div
          className="absolute -right-24 -top-24 h-[42rem] w-[42rem] rounded-full opacity-60"
          style={{
            x: reduced ? undefined : bgX,
            y: reduced ? undefined : bgY,
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 30%, transparent) 0%, transparent 62%)",
            filter: "blur(48px)",
          }}
          animate={reduced ? undefined : { scale: [1, 1.12, 1], opacity: [0.6, 0.75, 0.6] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -left-40 top-1/3 h-[34rem] w-[34rem] rounded-full opacity-50"
          style={{
            x: reduced ? undefined : bgX,
            background:
              "radial-gradient(circle, color-mix(in srgb, #7c5cff 26%, transparent) 0%, transparent 60%)",
            filter: "blur(52px)",
          }}
          animate={reduced ? undefined : { scale: [1, 1.18, 1], opacity: [0.5, 0.62, 0.5] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-24 sm:pt-28 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:pb-32">
        {/* --- Sol: editoryal başlık --- */}
        <motion.div
          style={{ y: reduced ? undefined : textY }}
          className="relative z-10 text-center lg:text-left"
        >
          <motion.div
            variants={staggerContainer(0.1, 0.05)}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow: çizgili canlı rozet */}
            <motion.p
              variants={fadeInUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              {t("eyebrow")}
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="text-balance text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.4rem]"
            >
              {t("title")}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mx-auto mt-6 max-w-lg text-balance text-base text-muted-foreground sm:text-lg lg:mx-0"
            >
              {t("subtitle")}
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
            >
              <ButtonLink href="/iletisim" size="lg">
                {t("primaryCta")}
              </ButtonLink>
              <ButtonLink href="#fiyatlandirma" size="lg" variant="outline">
                {t("secondaryCta")}
              </ButtonLink>
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="mt-6 text-xs text-muted-foreground/80"
            >
              {t("caption")}
            </motion.p>
          </motion.div>
        </motion.div>

        {/* --- Sağ: yaşayan ürün ekosistemi --- */}
        <motion.div style={{ y: reduced ? undefined : sceneY }} className="relative z-0">
          <HeroEcosystem />
        </motion.div>
      </div>

      {/* Alt kenar: bir sonraki bölüme yumuşak erime (kopukluk yok) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background"
      />
    </section>
  );
}
