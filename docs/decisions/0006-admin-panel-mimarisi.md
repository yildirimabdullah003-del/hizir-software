# ADR 0006 — Admin Panel Mimarisi (V1: Site Yönetimi)

**Durum:** ✅ Kabul edildi ve uygulandı
**Tarih:** 7 Temmuz 2026

## Bağlam

HIZIR Software sitesinin kod düzenlemeden yönetilmesi gerekiyor: iletişim
mesajları, sayfa içerikleri (TR/EN), medya, site ayarları ve personel
hesapları. Panel ileride HIZIR ekosisteminin (Website Builder, CRM, restoran
yönetimi, drone platformu...) merkezi kontrol paneline dönüşecek; bu yüzden
modüler kurulmalı ama bugün yalnızca site yönetimi özellikleri içermeli
(bkz. ADR 0005 — Rule of Three).

## Kararlar

| Konu | Karar | Neden |
|------|-------|-------|
| ORM | **Prisma** (+ Neon serverless Postgres) | Vercel/Neon ile birinci sınıf uyum (ADR 0003 Profil A); şema DSL'i ve migration araçları solo geliştirici + gelecekteki ekip için Drizzle'dan daha okunur/olgun. |
| Auth | **iron-session** (şifreli httpOnly cookie) + bcryptjs | Halka açık kayıt yok; sabit birkaç personel hesabı. NextAuth'un provider/adapter yüzeyi bu ihtiyaç için gereksiz karmaşıklık. |
| RBAC | `User.role` enum: OWNER / ADMIN / EDITOR | Ayrı izin tablosu 3 sabit rol için over-engineering. `requireRole()` "en az bu rol" hiyerarşisi uygular. |
| Konum | `src/app/admin/` — `[locale]` DIŞINDA | Panel arayüzü tek dil (TR); TR/EN *içerik* düzenlemesi form içi dil sekmeleriyle. next-intl middleware matcher'ı `/admin`'i dışlar. |
| İçerik stratejisi | **Hibrit** | UI metinleri (`nav`, buton etiketleri) `messages/*.json`'da kalır (deploy kadansı); iş içeriği (hizmet detayları, SEO, ayarlar) DB'de (`Page`/`PageTranslation`, iş kadansı). Public sayfa önce DB'ye bakar, yoksa/ulaşamazsa messages'a düşer — **site DB olmadan da tamamen çalışır**. |
| Medya | **Vercel Blob**; DB'de yalnızca metadata | Binary DB'de tutulmaz; aynı ekosistem, ek vendor yok. |
| Mutasyonlar | **Server Actions** (React 19 `useActionState`) | İç araç, dış API tüketicisi yok; route handler yalnızca gerektiğinde. |
| Audit log | **V1'de yok** | Rule of Three: ikinci editör hesabı + gerçek "bunu kim değiştirdi" ihtiyacı doğunca eklenecek. |
| Multi-tenancy | **V1 şemasında yok** | Website Builder / restoran platformu ayrı ürün alanı ve ayrı şemadır (bkz. ADR 0007); admin şemasına spekülatif `tenantId` eklenmez. |

## Şema (özet)

`User`, `Page` (+`PageTranslation`: locale başına JSON içerik, Zod ile
doğrulanır), `MediaAsset`, `ContactSubmission` (durum akışı:
NEW→IN_PROGRESS→RESOLVED/SPAM), `SiteSetting` (key/value JSON).

## İletişim formu: DB-öncelikli

`/api/contact` önce `ContactSubmission` yazar, sonra Resend'e gönderir.
E-posta başarısız olsa da lead panelde durur; DB yazımı başarısızsa eski
davranışa (log + e-posta) düşülür. Rate-limit ve honeypot değişmedi.

## Modülerlik sınırı

Tüm iş mantığı `src/features/admin/<alt-alan>/` altında (auth, pages, media,
submissions, settings, users); `src/app/admin/` yalnızca ince route/UI
katmanı. Gelecek modüller (`features/website-builder/`, `features/crm/`...)
kardeş klasörler olarak eklenir, `admin`'in içine uzanmaz.

## Kurulum

```bash
# .env.local: DATABASE_URL, SESSION_SECRET, ADMIN_EMAIL/PASSWORD/NAME
npx prisma migrate dev --name init   # şemayı DB'ye uygula
npm run db:seed                      # OWNER hesabı + mevcut içeriği içe aktar
```

## Ne zaman gözden geçirilir?

- İkinci editör hesabı açıldığında → audit log.
- İlk harici API tüketicisi doğduğunda → route handler katmanı.
- Blog/portfolyo public sayfaları eklendiğinde → yeni `Page.type` değerleri.
