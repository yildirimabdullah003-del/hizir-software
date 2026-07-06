import { Wand2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/motion/reveal";

/**
 * Henüz geliştirilmemiş "Website Builder" özelliğinin tanıtım bölümü.
 * Bilinçli olarak ana CTA'dan (CtaSection) farklı, kesikli çerçeveli —
 * kullanıcının bunu aktif/çalışan bir özellikle karıştırmaması için.
 *
 * Yönetim kurulu kararı (bkz. toplantı raporu): gerçek bir e-posta bekleme
 * listesi altyapısı kurulana kadar CTA gösterilmez; `cta` prop'u opsiyoneldir
 * ve şu an hiçbir sayfadan geçirilmez. Bekleme listesi hazır olduğunda
 * yalnızca prop'u geri eklemek yeterli.
 */
export function WebsiteBuilderTeaser({
  badge,
  title,
  description,
  cta,
  ctaHref = "/iletisim",
}: {
  badge: string;
  title: string;
  description: string;
  cta?: string;
  ctaHref?: string;
}) {
  return (
    <Reveal className="rounded-2xl border border-dashed border-accent/40 bg-accent/5 px-8 py-14 text-center sm:px-16">
      <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium tracking-wide text-accent uppercase">
        <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
        {badge}
      </span>
      <h2 className="mt-5 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-balance text-muted-foreground">
        {description}
      </p>
      {cta ? (
        <div className="mt-8">
          <ButtonLink href={ctaHref} variant="outline" size="lg">
            {cta}
          </ButtonLink>
        </div>
      ) : null}
    </Reveal>
  );
}
