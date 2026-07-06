"use client";

import { Target, Eye, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const ICONS: Record<string, LucideIcon> = {
  mission: Target,
  vision: Eye,
};

export type MissionVisionItem = {
  id: "mission" | "vision";
  title: string;
  body: string;
};

export function MissionVisionGrid({ items }: { items: MissionVisionItem[] }) {
  return (
    <motion.div
      variants={staggerContainer(0.12)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid gap-6 sm:grid-cols-2"
    >
      {items.map(({ id, title, body }) => {
        const Icon = ICONS[id];
        return (
          <motion.div
            key={id}
            variants={fadeInUp}
            className="rounded-xl border border-border bg-surface p-8"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {body}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
