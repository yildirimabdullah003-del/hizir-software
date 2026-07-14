"use client";

import { useEffect, useRef } from "react";

/**
 * Hero arka planında yavaşça süzülen "yıldız/parçacık" alanı — aura hissi.
 * Canvas tabanlı: tek requestAnimationFrame döngüsü, DPR-duyarlı, sekme
 * gizliyken veya görünür değilken durur (pil/performans). Açık zemine uygun
 * yumuşak, düşük opaklıklı noktalar; bir kısmı accent tonlu, hepsi hafifçe
 * yukarı-çapraz akar ve nazikçe parlar. `prefers-reduced-motion` açıkken
 * animasyon çalışmaz, seyrek durağan noktalar çizilir.
 */
export function HeroStarfield({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;
    // Guard sonrası non-null yerel bağlamalar (closure'larda TS daralması için).
    const canvas = canvasEl;
    const ctx = context;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const accent =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-accent")
        .trim() || "#2b59ff";

    let width = 0;
    let height = 0;
    let dpr = 1;
    type Star = {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      baseA: number;
      tw: number; // parıltı fazı
      accent: boolean;
    };
    let stars: Star[] = [];

    function rand(min: number, max: number) {
      // Math.random harness'te güvenli değil; deterministik olmasa da yerel.
      return min + Math.random() * (max - min);
    }

    function build() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Alana göre yoğunluk — üst sınırlı (performans).
      const count = Math.min(120, Math.round((width * height) / 8500));
      stars = Array.from({ length: count }, () => ({
        x: rand(0, width),
        y: rand(0, height),
        r: rand(0.7, 2.5),
        vx: rand(-0.07, 0.07),
        vy: rand(-0.22, -0.05), // yukarı süzülme
        baseA: rand(0.18, 0.55),
        tw: rand(0, Math.PI * 2),
        accent: Math.random() < 0.34,
      }));
    }

    function draw(twinkle: boolean) {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const a = twinkle
          ? s.baseA * (0.6 + 0.4 * Math.sin(s.tw))
          : s.baseA;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        if (s.accent) {
          const [rr, gg, bb] = hexToRgb(accent);
          ctx.fillStyle = `rgba(${rr},${gg},${bb},${a})`;
        } else {
          ctx.fillStyle = `rgba(90,100,120,${a * 0.8})`;
        }
        ctx.fill();
      }
    }

    function step() {
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        s.tw += 0.02;
        // Kenardan çıkınca karşıdan gir (sonsuz akış).
        if (s.y < -4) {
          s.y = height + 4;
          s.x = rand(0, width);
        }
        if (s.x < -4) s.x = width + 4;
        else if (s.x > width + 4) s.x = -4;
      }
      draw(true);
      raf = requestAnimationFrame(step);
    }

    let raf = 0;
    let running = false;
    function start() {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(step);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    build();
    if (reduced) {
      draw(false);
    } else {
      start();
    }

    // Görünürlük & sekme durumuna göre durdur/başlat.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(canvas);
    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      build();
      if (reduced) draw(false);
    });
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h.split("").map((c) => c + c).join("")
      : h.padEnd(6, "0").slice(0, 6);
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
