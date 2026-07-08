"use client";

import { Mail, Phone, Github, Linkedin, Twitter, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { getServiceSlug, isServiceDetailSlug } from "@/config/services";
import type { ServiceItem } from "@/components/sections/services-grid";

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  github: Github,
  x: Twitter,
};

export function SiteFooter() {
  const t = useTranslations();
  const year = new Date().getFullYear();
  const services = t.raw("services.items") as ServiceItem[];

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight">
              {t("site.name")}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {t("site.tagline")}
            </p>
          </div>

          {/* Ürünler — fiyat vitrinindeki dört paket */}
          <FooterLinkGroup title={t("footer.productsTitle")}>
            {(t.raw("home.pricing.products") as { id: string; name: string }[]).map(
              (product) => (
                <FooterLink key={product.id} href="/#fiyatlandirma">
                  {product.name}
                </FooterLink>
              )
            )}
          </FooterLinkGroup>

          {/* Şirket — hizmetler + iletişim */}
          <FooterLinkGroup title={t("footer.companyTitle")}>
            <FooterLink href="/hizmetler">{t("nav.services")}</FooterLink>
            {services.slice(0, 3).map((service) => {
              const slug = getServiceSlug(service.id);
              const href =
                slug && isServiceDetailSlug(slug)
                  ? `/hizmetler/${slug}`
                  : "/hizmetler";
              return (
                <FooterLink key={service.id} href={href}>
                  {service.title}
                </FooterLink>
              );
            })}
            <FooterLink href="/iletisim">{t("footer.writeToUs")}</FooterLink>
          </FooterLinkGroup>

          {/* Yasal + iletişim */}
          <FooterLinkGroup title={t("footer.legalTitle")}>
            <FooterLink href="/gizlilik">{t("footer.privacy")}</FooterLink>
            <FooterLink href="/kullanim-kosullari">
              {t("footer.terms")}
            </FooterLink>
            <FooterLink href={`mailto:${siteConfig.contactEmail}`}>
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              {siteConfig.contactEmail}
            </FooterLink>
            <FooterLink href={`https://wa.me/${siteConfig.whatsappNumber}`}>
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {siteConfig.phone}
            </FooterLink>
          </FooterLinkGroup>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {year} {t("site.name")}. {t("footer.rights")}
          </p>
          {siteConfig.socialLinks.length > 0 ? (
            <div className="flex items-center gap-2">
              {siteConfig.socialLinks.map((social) => {
                const Icon = SOCIAL_ICONS[social.icon];
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.94 }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-fast hover:border-accent/40 hover:text-accent"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </motion.a>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <ul className="mt-4 flex flex-col gap-3">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const className =
    "group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-fast hover:text-accent";
  const content = (
    <motion.span
      className="inline-flex items-center gap-2"
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {children}
    </motion.span>
  );

  return (
    <li>
      {href.startsWith("mailto:") || href.startsWith("http") ? (
        <a
          href={href}
          className={className}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {content}
        </a>
      ) : (
        <Link href={href} className={className}>
          {content}
        </Link>
      )}
    </li>
  );
}
