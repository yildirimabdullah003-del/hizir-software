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
import { BusinessDashboard } from "@/components/sections/business-dashboard";

/**
 * Ana sayfa Hero'su — scroll ile yaşayan sinematik sahne.
 *
 * Kurgu (lg+): bölüm 200vh; içteki sahne ekrana yapışır (sticky). Kaydırdıkça:
 *   1. Başlık + CTA'lar yukarı süzülüp küçülür, büyüyen laptop altına girer,
 *   2. Eğik laptop düzleşerek (rotateX 32°→0) sahne merkezine oturur —
 *      ekranında canlı çalışan HIZIR paneli,
 *   3. Arka plan accent ışıması güçlenir, nokta ızgarası söner (zemin değişir),
 *   4. Finalde panelin altında imza satırı belirir.
 * İmleç sahneye hafif 3D eğim verir. Mobilde sahne sabitlenmez (normal akış);
 * sticky/scrub düzeni JS'e değil saf CSS breakpoint'ine bağlıdır ki scroll
 * ölçümleri hydration'da bayatlamasın.
 *
 * ÖNEMLİ desen: scroll'a bağlı transform katmanı ile giriş (variants)
 * animasyonu AYRI motion.div'lerde tutulur — aynı öğede ikisi çakışır.
 */
export function Hero() {
  const t = useTranslations("home.hero");
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // --- Scroll sineması -------------------------------------------------------
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // Yumuşatma yayı: scrub'a sinematik akıcılık verir. Ayrıca opacity'leri
  // spring'ten geçirmek şart — aksi halde framer opacity'yi native
  // ViewTimeline animasyonuna devrediyor ve sticky+200vh kurgusunda o yol
  // yanlış ilerleme okuyor (transform'lar JS yolunda kalıp doğru çalışıyor).
  const smooth = { stiffness: 260, damping: 34, mass: 0.6 };

  // Yazı: yukarı süzülür, küçülür ve erir; laptop üstüne binerek kapatır.
  const textY = useSpring(useTransform(scrollYProgress, [0, 0.38], [0, -180]), smooth);
  const textOpacity = useSpring(
    useTransform(scrollYProgress, [0.05, 0.32], [1, 0]),
    smooth
  );
  const textScale = useSpring(
    useTransform(scrollYProgress, [0, 0.38], [1, 0.93]),
    smooth
  );
  // Laptop: SABİT bir sahne objesi gibi davranır — sallanmaz, eğilmez.
  // Scroll yalnızca ÇOK hafif bir perspektif düzelmesi ve sahneye oturma
  // hareketi verir (masterplan: "sahne sabit, hikâye akar").
  const laptopRotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.55], [10, 0]),
    smooth
  );
  const laptopScale = useSpring(
    useTransform(scrollYProgress, [0, 0.6], [0.94, 1.0]),
    smooth
  );
  const laptopY = useSpring(
    useTransform(scrollYProgress, [0, 0.6], [110, -150]),
    smooth
  );
  // Arka plan: accent ışıması güçlenir/büyür, nokta ızgarası söner.
  const glowOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.6], [0.05, 0.2]),
    smooth
  );
  const glowScale = useSpring(
    useTransform(scrollYProgress, [0, 0.6], [0.8, 1.35]),
    smooth
  );
  const gridOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.5], [0.35, 0.1]),
    smooth
  );
  // Final imza satırı laptop otururken belirir.
  const captionOpacity = useSpring(
    useTransform(scrollYProgress, [0.6, 0.8], [0, 1]),
    smooth
  );
  const captionY = useSpring(
    useTransform(scrollYProgress, [0.6, 0.8], [16, -150]),
    smooth
  );

  // --- İmleç yalnızca ZEMİN katmanlarını kaydırır (derinlik hissi) -----------
  // Ön plandaki objeye (laptop) tilt YOK — masterplan kuralı 5.
  const bgShiftX = useSpring(0, { stiffness: 60, damping: 20 });
  const bgShiftY = useSpring(0, { stiffness: 60, damping: 20 });

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    bgShiftX.set(nx * 36);
    bgShiftY.set(ny * 20);
  }

  function handleMouseLeave() {
    bgShiftX.set(0);
    bgShiftY.set(0);
  }

  // Azaltılmış harekette scroll-transform'ları hiç bağlama (statik sahne).
  const scrollStyle = <T,>(style: T): T | undefined => (reduced ? undefined : style);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative lg:h-[200vh]"
    >
      {/* Yapışkan sahne — mobilde normal akış (CSS breakpoint, JS değil) */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden pb-20 pt-20 sm:pt-24 lg:sticky lg:top-0 lg:h-screen lg:pb-0 lg:pt-0">
        {/* --- Arka plan katmanları --- */}
        {/* Nokta ızgarası: derinlik zemini, scroll'da söner */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: reduced ? 0.3 : gridOpacity,
            backgroundImage:
              "radial-gradient(color-mix(in srgb, var(--color-foreground) 9%, transparent) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage:
              "radial-gradient(ellipse 90% 70% at 50% 40%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 70% at 50% 40%, black 30%, transparent 75%)",
          }}
        />
        {/* Büyüyen accent ışıması: sahne zemini scroll'la değişir */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/3 rounded-full"
          style={{
            opacity: reduced ? 0.1 : glowOpacity,
            scale: reduced ? 1 : glowScale,
            x: bgShiftX,
            y: bgShiftY,
            background:
              "radial-gradient(circle, var(--color-accent) 0%, transparent 62%)",
            filter: "blur(40px)",
          }}
        />

        {/* --- Faz 1: Başlık + CTA (scroll katmanı) --- */}
        <motion.div
          style={scrollStyle({ y: textY, opacity: textOpacity, scale: textScale })}
          className="relative z-0 mx-auto max-w-3xl px-6 text-center"
        >
          {/* Giriş animasyonu katmanı */}
          <motion.div
            variants={staggerContainer(0.12, 0.05)}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={fadeInUp}
              className="mb-5 text-sm font-medium tracking-widest text-muted-foreground uppercase"
            >
              {t("eyebrow")}
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            >
              {t("title")}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mx-auto mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg"
            >
              {t("subtitle")}
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <ButtonLink href="/iletisim" size="lg">
                {t("primaryCta")}
              </ButtonLink>
              <ButtonLink href="#fiyatlandirma" size="lg" variant="outline">
                {t("secondaryCta")}
              </ButtonLink>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* --- Faz 2: Laptop + çalışan panel (scroll katmanı) --- */}
        <motion.div
          style={scrollStyle({ y: laptopY, scale: laptopScale })}
          className="relative z-10 mt-12 w-full max-w-3xl px-6 lg:mt-16"
        >
          {/* Giriş animasyonu katmanı */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            style={{ perspective: 1600 }}
          >
            {/* Scroll'a bağlı hafif perspektif düzelmesi — imleç eğimi YOK */}
            <motion.div
              style={scrollStyle({
                rotateX: laptopRotateX,
                transformStyle: "preserve-3d" as const,
                transformOrigin: "center bottom",
              })}
            >
              {/* Laptop ekranı */}
              <div className="rounded-xl border border-black/40 bg-[#1a1d26] p-1.5 shadow-lifted sm:rounded-2xl sm:p-2">
                {/* Kamera çentiği */}
                <div className="mx-auto mb-1 h-1 w-12 rounded-full bg-black/50" />
                <BusinessDashboard />
              </div>
              {/* Laptop gövdesi */}
              <div className="mx-auto h-2.5 w-[104%] max-w-none -translate-x-[2%] rounded-b-xl bg-gradient-to-b from-[#2a2e3a] to-[#171a22] shadow-lifted sm:h-3.5">
                <div className="mx-auto h-1 w-16 rounded-b-md bg-black/30 sm:w-20" />
              </div>
            </motion.div>

            {/* Panelin altındaki yumuşak yer gölgesi */}
            <div
              aria-hidden="true"
              className="mx-auto mt-4 h-6 w-3/4 rounded-[100%] bg-foreground/10 blur-xl"
            />
          </motion.div>
        </motion.div>

        {/* --- Final imza satırı: masaüstünde scroll'la belirir --- */}
        <motion.p
          style={scrollStyle({ opacity: captionOpacity, y: captionY })}
          className="relative z-10 mt-6 hidden text-sm text-muted-foreground lg:block"
        >
          {t("caption")}
        </motion.p>
        <p className="relative z-10 mt-8 px-6 text-center text-sm text-muted-foreground lg:hidden">
          {t("caption")}
        </p>
      </div>
    </section>
  );
}
