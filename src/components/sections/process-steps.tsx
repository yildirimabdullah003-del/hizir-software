"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export type ProcessStep = {
  id: string;
  title: string;
  description: string;
};

export function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  return (
    <motion.ol
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
    >
      {steps.map((step, index) => (
        <motion.li key={step.id} variants={fadeInUp} className="relative">
          <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-base font-semibold tracking-tight">
            {step.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {step.description}
          </p>
        </motion.li>
      ))}
    </motion.ol>
  );
}
