import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/motion/reveal";
import { scaleIn } from "@/lib/motion";

export function CtaSection({
  title,
  subtitle,
  primaryCta,
  primaryHref = "/iletisim",
  secondaryCta,
  secondaryHref = "/hizmetler",
}: {
  title: string;
  subtitle: string;
  primaryCta: string;
  primaryHref?: string;
  secondaryCta?: string;
  secondaryHref?: string;
}) {
  return (
    <Reveal
      variants={scaleIn}
      className="relative overflow-hidden rounded-2xl border border-border bg-foreground px-8 py-16 text-center sm:px-16"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, var(--color-accent), transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div className="relative">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-background sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-base text-background/70">
          {subtitle}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={primaryHref} size="lg">
            {primaryCta}
          </ButtonLink>
          {secondaryCta ? (
            <ButtonLink
              href={secondaryHref}
              size="lg"
              variant="outline"
              className="border-background/20 text-background hover:bg-background/10"
            >
              {secondaryCta}
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}
