"use client";

import { Mail, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

export function ContactInfo({
  title,
  email,
  phone,
  whatsappHref,
  note,
  processTitle,
  processBody,
}: {
  title: string;
  email: string;
  phone?: string;
  whatsappHref?: string;
  note: string;
  processTitle: string;
  processBody: string;
}) {
  return (
    <motion.div
      variants={staggerContainer(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="flex flex-col gap-4"
    >
      <motion.div
        variants={fadeInUp}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="rounded-xl border border-border bg-surface p-7"
      >
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <a
          href={`mailto:${email}`}
          className="group mt-4 flex items-center gap-3 text-sm text-foreground transition-colors duration-fast hover:text-accent"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Mail className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="flex-1">{email}</span>
          <ArrowUpRight
            className="h-4 w-4 shrink-0 opacity-0 transition-opacity duration-fast group-hover:opacity-100"
            aria-hidden="true"
          />
        </a>
        {phone && whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-3 flex items-center gap-3 text-sm text-foreground transition-colors duration-fast hover:text-[#128C4B]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#25D366]/10 text-[#128C4B]">
              <WhatsAppIcon className="h-4 w-4" />
            </span>
            <span className="flex-1">{phone}</span>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 opacity-0 transition-opacity duration-fast group-hover:opacity-100"
              aria-hidden="true"
            />
          </a>
        ) : null}
        <p className="mt-5 text-sm text-muted-foreground">{note}</p>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="rounded-xl border border-border bg-surface p-7"
      >
        <h3 className="text-base font-semibold tracking-tight">{processTitle}</h3>
        <p className="mt-3 text-sm text-muted-foreground">{processBody}</p>
      </motion.div>
    </motion.div>
  );
}
