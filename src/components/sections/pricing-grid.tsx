"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { track } from "@vercel/analytics";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { trackEvent } from "@/lib/track";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

export type PricingProduct = {
  id: string;
  name: string;
  price: string; // indirimli aylık, "₺350" — biçimlendirilmiş; biçim içerikte kalır
  listPrice?: string; // kampanya öncesi liste fiyatı, üstü çizili gösterilir
  period: string; // "/ay"
  annualPrice?: string; // indirimli yıllık
  annualListPrice?: string; // liste yıllık, üstü çizili
  setupPrice?: string; // tek seferlik kurulum ücreti
  description: string;
  features: string[];
  highlighted?: boolean;
};

/**
 * Ürün/fiyat kartları — ana sayfadaki net fiyatlı ürün vitrini.
 * PackagesGrid'den farkı: gerçek fiyat gösterir ve CTA'sı WhatsApp'a gider
 * (hedef kitle restoran işletmecileri; en hızlı kanal WhatsApp).
 */
export function PricingGrid({
  products,
  whatsappNumber,
  whatsappCtaLabel,
  whatsappMessage,
  popularLabel,
  setupNote,
  discountBadge,
  annualLabel,
  setupLabel,
  setupSuffix,
}: {
  products: PricingProduct[];
  whatsappNumber: string;
  whatsappCtaLabel: string;
  /** İçinde {product} geçen şablon; ürün adına göre doldurulur. */
  whatsappMessage: string;
  /** Öne çıkan (highlighted) ürüne konan rozet. */
  popularLabel: string;
  /** Her kartın altındaki güven notu (ör. "Sözleşme yok · Dilediğinde iptal"). */
  setupNote: string;
  /** Çizili liste fiyatının yanındaki kampanya rozeti (ör. "%30 indirim"). */
  discountBadge: string;
  /** "Yıllık" satır etiketi. */
  annualLabel: string;
  /** "Kurulum" satır etiketi. */
  setupLabel: string;
  /** Kurulum ücretinin yanındaki ek ("tek seferlik"). */
  setupSuffix: string;
}) {
  return (
    <motion.div
      variants={staggerContainer(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
    >
      {products.map((product) => {
        const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          whatsappMessage.replace("{product}", product.name)
        )}`;
        return (
          <motion.div
            key={product.id}
            variants={fadeInUp}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className={cn(
              "relative flex flex-col rounded-xl border p-7 shadow-soft transition-[box-shadow,border-color] duration-base ease-out-soft hover:shadow-lifted",
              product.highlighted
                ? "border-accent/50 bg-surface ring-1 ring-accent/20"
                : "border-border bg-background hover:border-accent/40"
            )}
          >
            {product.highlighted ? (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-3 py-1 text-xs font-medium text-[var(--color-accent-foreground)] shadow-soft">
                {popularLabel}
              </span>
            ) : null}
            <h3 className="text-lg font-semibold tracking-tight">
              {product.name}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {product.description}
            </p>
            <div className="mt-5">
              {product.listPrice ? (
                <p className="flex items-center gap-2 text-sm">
                  <s className="text-muted-foreground">{product.listPrice}</s>
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                    {discountBadge}
                  </span>
                </p>
              ) : null}
              <p className={product.listPrice ? "mt-0.5" : undefined}>
                <span className="text-3xl font-semibold tracking-tight">
                  {product.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {product.period}
                </span>
              </p>
              {product.annualPrice ? (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {annualLabel}:{" "}
                  {product.annualListPrice ? (
                    <s>{product.annualListPrice}</s>
                  ) : null}{" "}
                  <span className="font-semibold text-foreground">
                    {product.annualPrice}
                  </span>
                </p>
              ) : null}
              {product.setupPrice ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {setupLabel}:{" "}
                  <span className="font-semibold text-foreground">
                    {product.setupPrice}
                  </span>{" "}
                  ({setupSuffix})
                </p>
              ) : null}
            </div>
            <ul className="mt-5 flex flex-col gap-2 border-t border-border pt-5">
              {product.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  track("whatsapp_click", { product: product.id });
                  trackEvent("whatsapp_click", product.id);
                }}
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors",
                  product.highlighted
                    ? "bg-[#25D366] text-white hover:bg-[#1fb857]"
                    : "border border-[#25D366]/40 text-[#128C4B] hover:bg-[#25D366]/10"
                )}
              >
                <WhatsAppIcon className="h-4 w-4" />
                {whatsappCtaLabel}
              </a>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {setupNote}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
