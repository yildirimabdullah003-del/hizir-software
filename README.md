# HIZIR Software

Kurumsal web sitesi ve şirketin uzun vadeli ürün altyapısının temeli.

Modern, minimal, premium bir tasarım anlayışıyla; SEO, performans ve
sürdürülebilirlik önceliğiyle geliştirilir.

## Teknoloji Yığını

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4** (token'lar `src/app/globals.css` içinde `@theme` ile)
- **next-intl** (çok dilli altyapı: TR + EN)
- Yardımcılar: `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`

Alınan tüm mimari kararlar ve gerekçeleri `docs/` klasöründedir.

## Gereksinimler

- **Node.js 18.18+** (öneri: 20 LTS veya üzeri)
- npm (veya pnpm / yarn)

## Kurulum

```bash
# 1) Bağımlılıkları kur
npm install

# 2) Ortam dosyasını hazırla
cp .env.example .env.local

# 3) Geliştirme sunucusunu başlat
npm run dev
```

Ardından tarayıcıda: **http://localhost:3000** → otomatik olarak
`http://localhost:3000/tr` adresine yönlenir.

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi |
| `npm run start` | Üretim sunucusu |
| `npm run lint` | Kod kontrolü |
| `npm run typecheck` | TypeScript tip kontrolü |

## Klasör Yapısı

Bkz. `docs/decisions/0002-proje-klasor-yapisi.md`

## Çok Dillilik

İçerik şu an Türkçe. İngilizceyi açmak için `messages/en.json` doldurmak yeterli;
kod değişikliği gerekmez (bkz. `docs/decisions/0004-cok-dillilik-i18n.md`).

## Not

Bu depo, üretim seviyesinde bir **iskelet**tir. Ana sayfa ve tasarım sistemi
geliştirme süreci içinde olgunlaştırılmaktadır.
