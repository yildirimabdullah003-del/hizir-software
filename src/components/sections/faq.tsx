"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

/**
 * Erişilebilir SSS akordeonu: buton + aria-expanded/aria-controls,
 * yükseklik animasyonu AnimatePresence ile. Tek seferde tek soru açık
 * kalır; ilk soru varsayılan açık gelir ki bölümün "tıklanabilir"
 * olduğu ilk bakışta anlaşılsın.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-border overflow-hidden rounded-xl border border-border bg-background shadow-soft">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${item.id}`}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-medium transition-colors duration-fast hover:bg-surface"
            >
              {item.question}
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-base ease-out-soft",
                  isOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={`faq-panel-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
