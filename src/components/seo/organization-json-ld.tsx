import { siteConfig } from "@/config/site";

/**
 * Organization + WebSite yapılandırılmış verisi (Schema.org).
 * Yalnızca gerçek, doğrulanabilir alanlar içerir — sahte puan/yorum
 * (AggregateRating, Review) veya uydurma kuruluş tarihi eklenmez.
 */
export function OrganizationJsonLd({
  name,
  description,
  locale,
}: {
  name: string;
  description: string;
  locale: string;
}) {
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}#organization`,
        name,
        url: siteConfig.url,
        email: siteConfig.contactEmail,
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}#website`,
        name,
        description,
        url: siteConfig.url,
        inLanguage: locale,
        publisher: { "@id": `${siteConfig.url}#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify çıktısı; kullanıcı girdisi içermediği için XSS riski yoktur.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
