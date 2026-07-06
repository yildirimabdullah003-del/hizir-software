import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button-link";

/**
 * (marketing) grubunun 404 sınırı. Hem [...rest] catch-all'undan hem de
 * dynamicParams=false olan [slug] gibi rotaların notFound() çağrılarından
 * buraya düşülür; sayfa, grup layout'u sayesinde header/footer ile çıkar.
 */
export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center sm:py-40">
      <p className="text-sm font-medium tracking-widest text-accent uppercase">
        404
      </p>
      <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md text-balance text-lg text-muted-foreground">
        {t("description")}
      </p>
      <div className="mt-8">
        <ButtonLink href="/" size="lg">
          {t("backHome")}
        </ButtonLink>
      </div>
    </section>
  );
}
