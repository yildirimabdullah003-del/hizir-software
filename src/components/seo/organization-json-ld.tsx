import { siteConfig } from "@/config/site";

type ServiceOffer = { name: string; url: string };

/**
 * Organization + WebSite + ProfessionalService yapılandırılmış verisi
 * (Schema.org). Yalnızca gerçek, doğrulanabilir alanlar içerir — sahte
 * puan/yorum (AggregateRating, Review) veya uydurma kuruluş tarihi eklenmez.
 *
 * İletişim/sosyal bilgiler panelden yönetilir; layout DB-öncelikli okuyup
 * `phone` / `sameAs` olarak geçirir (kayıt yoksa siteConfig'e düşer).
 */
export function OrganizationJsonLd({
  name,
  description,
  locale,
  phone,
  email,
  sameAs = [],
  services = [],
}: {
  name: string;
  description: string;
  locale: string;
  phone?: string;
  email?: string;
  /** Sosyal profil URL'leri (Instagram vb.) — Schema.org sameAs. */
  sameAs?: string[];
  /** Sunulan hizmetler (isim + detay URL'i) — makesOffer için. */
  services?: ServiceOffer[];
}) {
  const orgId = `${siteConfig.url}#organization`;
  const logoUrl = `${siteConfig.url}/icon`;

  const organization: Record<string, unknown> = {
    "@type": ["Organization", "ProfessionalService"],
    "@id": orgId,
    name,
    description,
    url: siteConfig.url,
    email: email ?? siteConfig.contactEmail,
    logo: logoUrl,
    image: `${siteConfig.url}/${locale}/opengraph-image`,
    areaServed: { "@type": "Country", name: "Türkiye" },
    knowsLanguage: ["tr", "en"],
  };

  if (phone) {
    organization.telephone = phone;
    organization.contactPoint = {
      "@type": "ContactPoint",
      telephone: phone,
      email: email ?? siteConfig.contactEmail,
      contactType: "customer service",
      areaServed: "TR",
      availableLanguage: ["Turkish", "English"],
    };
  }

  if (sameAs.length > 0) organization.sameAs = sameAs;

  if (services.length > 0) {
    organization.makesOffer = services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.name,
        url: s.url,
        provider: { "@id": orgId },
      },
    }));
  }

  const json = {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}#website`,
        name,
        description,
        url: siteConfig.url,
        inLanguage: locale,
        publisher: { "@id": orgId },
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
