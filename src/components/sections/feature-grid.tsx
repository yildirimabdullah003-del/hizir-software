"use client";

import {
  Rocket,
  TrendingUp,
  Building2,
  Languages,
  Palette,
  Search,
  Gauge,
  Globe,
  Smartphone,
  FileText,
  Compass,
  Wrench,
  Lightbulb,
  Layers,
  Server,
  Database,
  RefreshCw,
  Store,
  Briefcase,
  CreditCard,
  Package,
  Truck,
  BarChart3,
  Sparkles,
  Users,
  Component,
  Type,
  Accessibility,
  BookOpen,
  Code2,
  ShieldCheck,
  Activity,
  Map,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * İkon adı -> bileşen kaydı. Server Component'ler bileşen referansını
 * doğrudan Client Component'e prop olarak geçiremez (RSC serileştirme
 * hatası); bu yüzden content modülleri yalnızca bu kayıttaki string
 * anahtarları (ör. "Rocket") taşır, gerçek eşleme burada yapılır.
 * Yeni bir hizmet sayfası farklı bir ikona ihtiyaç duyarsa buraya eklenir.
 */
const ICON_REGISTRY: Record<string, LucideIcon> = {
  Rocket,
  TrendingUp,
  Building2,
  Languages,
  Palette,
  Search,
  Gauge,
  Globe,
  Smartphone,
  FileText,
  Compass,
  Wrench,
  Lightbulb,
  Layers,
  Server,
  Database,
  RefreshCw,
  Store,
  Briefcase,
  CreditCard,
  Package,
  Truck,
  BarChart3,
  Sparkles,
  Users,
  Component,
  Type,
  Accessibility,
  BookOpen,
  Code2,
  ShieldCheck,
  Activity,
  Map,
  Zap,
};

export type FeatureItem = {
  id: string;
  title: string;
  description: string;
};

/**
 * Genel amaçlı ikon+başlık+açıklama kart grid'i.
 * Hizmet detay sayfalarında "kimler için" / "neler sunuyoruz" gibi
 * bölümlerde tekrar tekrar kullanılmak üzere tasarlandı — her yeni hizmet
 * sayfası kendi item listesini ve icon-adı eşlemesini geçirerek bu bileşeni
 * yeniden kullanır (bkz. ADR 0005, Rule of Three).
 */
export function FeatureGrid({
  items,
  icons,
  columns = 3,
}: {
  items: FeatureItem[];
  /** item.id -> ICON_REGISTRY anahtarı (ör. { "custom-design": "Palette" }) */
  icons: Record<string, string>;
  columns?: 2 | 3 | 4;
}) {
  return (
    <motion.div
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={cn(
        "grid gap-6",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4"
      )}
    >
      {items.map((item) => {
        const Icon = ICON_REGISTRY[icons[item.id]] ?? Compass;
        return (
          <motion.div
            key={item.id}
            variants={fadeInUp}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="rounded-xl border border-border bg-background p-7 shadow-soft transition-[box-shadow,border-color] duration-base ease-out-soft hover:border-accent/40 hover:shadow-lifted"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
