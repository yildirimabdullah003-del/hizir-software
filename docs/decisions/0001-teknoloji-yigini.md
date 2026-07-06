# ADR 0001 — Teknoloji Yığını (Tech Stack)

**Durum:** ✅ Kabul edildi
**Tarih:** 3 Temmuz 2026

## Bağlam

HIZIR Software'in iki hedefi var: (1) kısa vadede müşteri projeleriyle gelir
üretmek, (2) uzun vadede kendi ürünlerini (SaaS, HIZIR Drone Platformu)
geliştirmek. Kuracağımız temel her ikisini de desteklemeli; SEO, performans ve
uzun vadeli sürdürülebilirlik öncelikli.

## Karar

Aşağıdaki yığında karar kıldık:

| Katman | Seçim |
|--------|-------|
| Framework | **Next.js 15 (App Router)** |
| Dil | **TypeScript** |
| Stil | **Tailwind CSS** |
| UI Component | **shadcn/ui** |
| Çok dillilik | **next-intl** |
| Veritabanı *(ilerisi)* | **PostgreSQL + Prisma ORM** |

## Gerekçe

- **Next.js + App Router:** SEO ve performans birincil hedefimiz. SSR/SSG
  hibriti bunun sektör standardı. İleride tam React uygulaması gerektiren
  müşteri/admin panellerine aynı framework'le geçebiliyoruz — ekosistem
  parçalanmıyor.
- **TypeScript:** Kod tabanı büyüdükçe ve ekip genişledikçe hata önlemenin en
  güçlü aracı. Tip güvenliği, refactor'u güvenli hale getirir.
- **Tailwind + shadcn/ui:** Minimalizm hedefimize uygun. shadcn/ui'de
  component'ler *bizim* kontrolümüzde kalır (kapalı kutu kütüphane bağımlılığı
  yok). Starter kit felsefemizin "değişen/değişmeyen katman" ayrımı için ideal.
- **next-intl:** Çok dillilik altyapısını en baştan kurmamızı sağlar (bkz. ADR 0004).
- **PostgreSQL + Prisma:** Blog, panel, CRM gibi ilişkisel veri gerektiren
  modüller için en güvenli temel. Bugün kurulmuyor; ilk dinamik modülde açılacak.

## Alternatifler

- **Astro:** Statik site için harika, ancak dinamik panel/uygulama tarafında
  Next.js kadar olgun değil. İki hedefi tek framework'le karşılama isteğimize ters.
- **Vue/Nuxt:** Geçerli bir seçenek, ancak React/Next.js ekosistemi (özellikle
  shadcn/ui gibi araçlar ve iş piyasası) bizim için daha avantajlı.
- **CSS-in-JS (styled-components vb.):** Tailwind'e kıyasla runtime maliyeti ve
  performans dezavantajı var. Minimalizm ve hız hedefimize Tailwind daha uygun.

## Sonuçlar

**Avantajlar:**
- Tek framework ile hem statik site hem dinamik uygulama.
- Güçlü SEO/performans temeli.
- Geniş topluluk, kolay işe alım (ekip büyürse).

**Dezavantajlar / dikkat edilecekler:**
- Next.js App Router'ın öğrenme eğrisi var (Server/Client Component ayrımı).
- Tailwind'in başlangıçta "kalabalık className" hissi olabilir; disiplinle yönetilecek.

## Ne zaman gözden geçirilir?

- Next.js'te büyük bir mimari değişiklik (yeni major sürüm) olduğunda.
- Bir müşteri projesi framework'ün karşılamadığı özel bir gereksinim getirdiğinde.
