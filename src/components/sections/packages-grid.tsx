"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export type PackageTier = {
  id: string;
  name: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

/**
 * Paket/fiyatlandırma grid'i — örnek bir yapı sunar. Fiyat alanı bilinçli
 * olarak sayısal bir değer değil, `priceLabel` (ör. "Teklif üzerine") ile
 * doldurulur; gerçek fiyatlandırma müşteriyle birlikte belirlenene kadar
 * sahte bir rakam göstermez. Gelecekte gerçek fiyatlar eklendiğinde yalnızca
 * `priceLabel`/`PackageTier` verisi değişir, bileşen aynı kalır.
 */
export function PackagesGrid({
  tiers,
  priceLabel,
  ctaLabel,
  ctaHref = "/iletisim",
}: {
  tiers: PackageTier[];
  priceLabel: string;
  ctaLabel: string;
  ctaHref?: string;
}) {
  return (
    <motion.div
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid gap-6 lg:grid-cols-3"
    >
      {tiers.map((tier) => (
        <motion.div
          key={tier.id}
          variants={fadeInUp}
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className={cn(
            "flex flex-col rounded-xl border p-8 shadow-soft transition-[box-shadow,border-color] duration-base ease-out-soft hover:shadow-glow",
            tier.highlighted
              ? "border-accent/50 bg-surface ring-1 ring-accent/20"
              : "border-border bg-background hover:border-accent/40"
          )}
        >
          <h3 className="text-lg font-semibold tracking-tight">{tier.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
          <ul className="mt-6 flex flex-col gap-2 border-t border-border pt-6">
            {tier.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            <p className="mb-3 text-sm font-medium text-foreground">{priceLabel}</p>
            <ButtonLink
              href={ctaHref}
              variant={tier.highlighted ? "primary" : "outline"}
              className="w-full"
            >
              {ctaLabel}
            </ButtonLink>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
