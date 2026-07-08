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
  compact = false,
}: {
  title: string;
  subtitle: string;
  primaryCta: string;
  primaryHref?: string;
  secondaryCta?: string;
  secondaryHref?: string;
  /** Daha alçak, tek satıra yakın sürüm — fiyat vitrini asıl odakken kullanılır. */
  compact?: boolean;
}) {
  if (compact) {
    return (
      <Reveal
        variants={scaleIn}
        className="relative overflow-hidden rounded-2xl border border-border bg-foreground px-8 py-10 sm:px-12"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, var(--color-accent), transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div className="relative flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-balance text-xl font-semibold tracking-tight text-background sm:text-2xl">
              {title}
            </h2>
            <p className="mt-1.5 max-w-xl text-balance text-sm text-background/70">
              {subtitle}
            </p>
          </div>
          <ButtonLink href={primaryHref} className="shrink-0">
            {primaryCta}
          </ButtonLink>
        </div>
      </Reveal>
    );
  }

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
