"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/motion";

type Status = "idle" | "sending" | "success" | "error";

const inputClasses =
  "w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm outline-none transition-[border-color,box-shadow] duration-fast placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/15";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      // Honeypot — insan kullanıcı bu alanı görmez ve doldurmaz.
      website: String(data.get("website") ?? "").trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus("error");
      setErrorMessage(t("requiredError"));
      return;
    }

    setStatus("sending");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("request-failed");
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage(t("error"));
    }
  }

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="flex items-start gap-3 rounded-xl border border-border bg-surface p-6"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 18 }}
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          </motion.span>
          <p className="text-sm text-foreground">{t("success")}</p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          noValidate
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0 }}
          className="relative flex flex-col gap-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t("nameLabel")} htmlFor="name">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder={t("namePlaceholder")}
                className={inputClasses}
              />
            </Field>
            <Field label={t("emailLabel")} htmlFor="email">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
                className={inputClasses}
              />
            </Field>
          </div>

          <Field label={t("companyLabel")} htmlFor="company">
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              placeholder={t("companyPlaceholder")}
              className={inputClasses}
            />
          </Field>

          <Field label={t("messageLabel")} htmlFor="message">
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder={t("messagePlaceholder")}
              className={inputClasses}
            />
          </Field>

          {/* Honeypot: ekran dışında, odak zincirinde değil; botlar doldurur. */}
          <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <AnimatePresence>
            {status === "error" && errorMessage ? (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2 text-sm text-danger"
              >
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {errorMessage}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <motion.div variants={fadeInUp} className="flex flex-col gap-3 sm:self-start">
            <Button type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto">
              {status === "sending" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {t("sending")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              {t.rich("privacyNotice", {
                link: (chunks) => (
                  <Link
                    href="/gizlilik"
                    className="underline underline-offset-2 transition-colors duration-fast hover:text-foreground"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </motion.div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeInUp} className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
    </motion.div>
  );
}
