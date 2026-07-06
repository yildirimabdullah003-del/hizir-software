"use client";

import {
  Globe,
  Rocket,
  ShoppingBag,
  Palette,
  LineChart,
  Compass,
  Check,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { getServiceSlug, isServiceDetailSlug } from "@/config/services";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const ICONS: Record<string, LucideIcon> = {
  "corporate-web": Globe,
  "product-dev": Rocket,
  ecommerce: ShoppingBag,
  "brand-design": Palette,
  growth: LineChart,
  consulting: Compass,
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
};

export function ServicesGrid({
  items,
  showBullets = true,
  viewDetailsLabel,
  className,
}: {
  items: ServiceItem[];
  showBullets?: boolean;
  /** Detay sayfası olan hizmet kartlarında gösterilen "Detayları incele" etiketi. */
  viewDetailsLabel: string;
  className?: string;
}) {
  return (
    <motion.div
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}
    >
      {items.map((item) => (
        <ServiceCard
          key={item.id}
          item={item}
          showBullets={showBullets}
          viewDetailsLabel={viewDetailsLabel}
        />
      ))}
    </motion.div>
  );
}

function ServiceCard({
  item,
  showBullets,
  viewDetailsLabel,
}: {
  item: ServiceItem;
  showBullets: boolean;
  viewDetailsLabel: string;
}) {
  const Icon = ICONS[item.id] ?? Compass;
  const slug = getServiceSlug(item.id);
  const hasDetailPage = Boolean(slug && isServiceDetailSlug(slug));
  const hasBullets = showBullets && item.bullets.length > 0;

  const card = (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group flex h-full flex-col rounded-xl border border-border bg-background p-7 shadow-soft transition-[box-shadow,border-color] duration-base ease-out-soft hover:border-accent/40 hover:shadow-lifted"
    >
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors duration-base ease-out-soft group-hover:bg-accent group-hover:text-accent-foreground">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
      {hasBullets ? (
        <ul className="mt-5 flex flex-col gap-2 border-t border-border pt-5">
          {item.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                aria-hidden="true"
              />
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}
      {hasDetailPage ? (
        <div
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium text-accent",
            hasBullets ? "mt-4" : "mt-5 border-t border-border pt-5"
          )}
        >
          {viewDetailsLabel}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-fast group-hover:translate-x-1"
            aria-hidden="true"
          />
        </div>
      ) : null}
    </motion.div>
  );

  if (hasDetailPage && slug) {
    return (
      <Link href={`/hizmetler/${slug}`} className="block h-full">
        {card}
      </Link>
    );
  }

  return card;
}
