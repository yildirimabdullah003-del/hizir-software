/**
 * Hizmet id -> URL slug eşlemesi — tek doğruluk kaynağı.
 * Metinler (site.ts'teki gibi) i18n'den gelir; burada yalnızca yapı/rota
 * tutulur. `id` değerleri messages/*.json içindeki services.items[].id
 * alanlarıyla birebir eşleşmelidir.
 *
 * localePrefix "always" ama slug'lar (hakkımızda/iletişim gibi) dile göre
 * değişmez; bu yüzden slug burada tek, locale-bağımsız bir değerdir.
 */
export const serviceRoutes = [
  { id: "corporate-web", slug: "kurumsal-web-siteleri" },
  { id: "product-dev", slug: "dijital-urun-gelistirme" },
  { id: "ecommerce", slug: "e-ticaret-cozumleri" },
  { id: "brand-design", slug: "marka-tasarim-sistemi" },
  { id: "growth", slug: "bakim-performans-seo" },
  { id: "consulting", slug: "danismanlik-teknik-strateji" },
] as const;

export function getServiceSlug(id: string): string | undefined {
  return serviceRoutes.find((route) => route.id === id)?.slug;
}

/**
 * Hangi slug'ların kendi detay sayfası (/hizmetler/[slug]) var.
 * Yeni bir hizmet sayfası eklerken:
 *   1) src/content/services/<slug>.ts içine ServiceDetailContent şemasında
 *      veri oluştur (bkz. o dosyadaki örnek: kurumsal-web-siteleri).
 *   2) messages/tr.json ve messages/en.json içine
 *      serviceDetails.<slug> çevirilerini ekle.
 *   3) Aşağıdaki listeye slug'ı ekle.
 * ServicesGrid, yalnızca burada listelenen slug'lar için kartı tıklanabilir
 * yapıp detay sayfasına bağlar; listelenmeyenler mevcut (statik) haliyle kalır.
 */
export const SERVICE_DETAIL_SLUGS = ["kurumsal-web-siteleri"] as const;

export type ServiceDetailSlug = (typeof SERVICE_DETAIL_SLUGS)[number];

export function isServiceDetailSlug(slug: string): slug is ServiceDetailSlug {
  return (SERVICE_DETAIL_SLUGS as readonly string[]).includes(slug);
}
