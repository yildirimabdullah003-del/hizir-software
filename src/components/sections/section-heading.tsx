import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

/**
 * Sayfa bloklarının ortak başlık deseni (eyebrow + title + subtitle).
 * Beşten fazla yerde tekrar ettiği için ADR 0005'teki "Rule of Three"
 * eşiğini geçti ve tek bileşene çıkarıldı. Reveal ile sarılı olduğu için
 * tüm bölüm başlıkları site genelinde aynı scroll-reveal davranışını paylaşır.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "mx-auto max-w-2xl",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-4 text-sm font-medium tracking-widest text-accent uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-balance text-lg text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
