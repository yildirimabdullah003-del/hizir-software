"use client";

import { Layers, Gauge, Globe, Leaf, Sparkles, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const ICONS: Record<string, LucideIcon> = {
  "shared-foundation": Layers,
  performance: Gauge,
  multilingual: Globe,
  sustainability: Leaf,
};

export type ValueItem = {
  id: string;
  title: string;
  description: string;
};

export function ValuesGrid({ items }: { items: ValueItem[] }) {
  return (
    <motion.div
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid gap-6 sm:grid-cols-2"
    >
      {items.map((item) => {
        const Icon = ICONS[item.id] ?? Sparkles;
        return (
          <motion.div
            key={item.id}
            variants={fadeInUp}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="rounded-xl border border-border bg-background p-8 shadow-soft transition-[box-shadow,border-color] duration-base ease-out-soft hover:border-accent/40 hover:shadow-lifted"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold tracking-tight">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {item.description}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
