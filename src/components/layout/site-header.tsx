"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Site başlığı — sticky, scroll'da glassmorphism'e geçen, aktif sayfayı
 * kayan bir pill ile işaretleyen premium navigasyon.
 */
export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf = 0;
    function measure() {
      setScrolled(window.scrollY > 8);
    }
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    }
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Rota değiştiğinde mobil menüyü kapat.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Menü açıkken arka plan kaydırmasını kilitle.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  // Esc ile kapat, odağı tetikleyici düğmeye geri ver.
  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[box-shadow,border-color] duration-base ease-out-soft",
        scrolled
          ? "border-b border-border shadow-soft"
          : "border-b border-transparent"
      )}
    >
      {/* Blur zemini AYRI katmanda: backdrop-filter doğrudan header'da olursa
          fixed konumlu mobil menü header'a kilitlenip kırpılıyor (CSS
          containing block kuralı). Katmana taşıyınca menü viewport'a göre
          konumlanır ve tam açılır. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 bg-background/70 backdrop-blur-xl transition-opacity duration-base ease-out-soft",
          scrolled ? "opacity-100" : "opacity-0"
        )}
      />
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="rounded-sm text-lg font-semibold tracking-tight transition-opacity duration-fast hover:opacity-80"
        >
          {t("site.name")}
        </Link>

        <DesktopNav pathname={pathname} />

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors duration-fast hover:bg-muted md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <motion.span
            initial={false}
            animate={{ rotate: menuOpen ? 90 : 0 }}
            className="flex"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </motion.span>
          <span className="sr-only">
            {menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
          </span>
        </button>
      </div>

      <AnimatePresence>{menuOpen && <MobileNav pathname={pathname} />}</AnimatePresence>
    </header>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  const t = useTranslations();

  return (
    <nav aria-label={t("nav.mainNav")} className="hidden items-center gap-1 md:flex">
      {siteConfig.navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-fast",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive ? (
              <motion.span
                layoutId="nav-active-pill"
                className="absolute inset-0 rounded-full bg-muted"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            ) : null}
            <span className="relative z-10">{t(`nav.${item.key}`)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function LanguageSwitcher() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label={t("nav.languageSwitcher")}
      className="flex items-center gap-0.5 rounded-full border border-border p-0.5"
    >
      {routing.locales.map((loc) => (
        <motion.button
          key={loc}
          type="button"
          aria-pressed={locale === loc}
          onClick={() => router.replace(pathname, { locale: loc as Locale })}
          whileTap={{ scale: 0.92 }}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-colors duration-fast",
            locale === loc
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {loc}
        </motion.button>
      ))}
    </div>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const t = useTranslations();

  return (
    <motion.nav
      id="mobile-nav"
      aria-label={t("nav.mainNav")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-x-0 top-16 bottom-0 z-40 border-t border-border bg-background/98 backdrop-blur-xl md:hidden"
    >
      <div className="flex h-full flex-col gap-1 overflow-y-auto px-6 py-8">
        {siteConfig.navItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "block rounded-md px-3 py-3.5 text-2xl font-semibold tracking-tight transition-colors duration-fast",
                  isActive
                    ? "text-accent"
                    : "text-foreground hover:text-accent"
                )}
              >
                {t(`nav.${item.key}`)}
              </Link>
            </motion.div>
          );
        })}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: siteConfig.navItems.length * 0.05 }}
          className="mt-6 border-t border-border pt-6"
        >
          <LanguageSwitcher />
        </motion.div>
      </div>
    </motion.nav>
  );
}
