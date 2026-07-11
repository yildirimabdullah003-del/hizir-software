# HIZIR Software — Proje Devir (Handoff) Dokümanı

> Son güncelleme: 2026-07-11
> Bu dosya projeyi devralan herkesin (veya yeni bir yapay zeka oturumunun)
> hızla resmi görmesi için hazırlanmıştır. Kararların gerekçeleri için ayrıca
> bkz. `docs/ROADMAP.md`, `docs/decisions/` (ADR'ler) ve `CHANGELOG.md`.

---

## 1. Hedef (Proje ne için var?)

HIZIR Software; **restoranlara ve küçük işletmelere** dijital çözümler satan
bir yazılım markasıdır. Ürünler:

- **QR Menü** — dijital menü (baskı maliyeti yok, anında güncelleme)
- **Web Sitesi** — işletmeye özel, SEO uyumlu tanıtım sitesi
- **POS Sistemi** — kasa/masa/mutfak sipariş yönetimi
- **Kapsamlı İşletme** — hepsi bir arada paket

Bu depo iki şeyi içerir:
1. **Pazarlama sitesi** (hizirsoftware.com) — ürünleri tanıtır, WhatsApp'a lead
   yönlendirir.
2. **Admin panel** (/admin) — mesajları, sayfa içeriklerini, fiyatları, medyayı
   ve site trafiğini yönetir.

İş modeli StilSoftware benzeri: net fiyat + WhatsApp üzerinden hızlı satış.
Hedef kitle teknik değil; sahibi (Abdullah Yıldırım) tek kişi, bütçe bilinçli.

---

## 2. Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Stil | Tailwind CSS v4 (token'lar `src/app/globals.css` `@theme`) |
| Çok dillilik | next-intl (TR varsayılan + EN), `messages/tr.json` / `en.json` |
| Animasyon | framer-motion |
| Veritabanı | PostgreSQL (**Neon**) + **Prisma** ORM |
| Admin oturumu | **iron-session** (şifreli cookie) + bcryptjs |
| Medya deposu | **Vercel Blob** (OIDC ile kimlik) |
| E-posta | **Resend** (henüz KURULMADI — bkz. §7) |
| Analitik | Kendi barındırdığımız (Neon) + Vercel Web Analytics |
| Hosting | **Vercel** |
| Alan adı | **hizirsoftware.com** (Turhost) |

---

## 3. Hesaplar ve Servisler (Tüm bağlantılar)

| Servis | Bilgi | Durum |
|---|---|---|
| **GitHub** | `github.com/yildirimabdullah003-del/hizir-software` (private) | ✅ Aktif, master'a push'lu |
| **Vercel** | Proje repo'ya bağlı, otomatik deploy (her push) | ✅ Canlı |
| **Domain** | hizirsoftware.com — Turhost'tan alındı | ✅ Canlı, HTTPS aktif |
| **Turhost DNS** | Nameserver: `dns1.turhost.com` / `dns2.turhost.com`; A `@`→`216.198.79.1`, CNAME `www`→Vercel | ✅ Çözülüyor |
| **Neon (Postgres)** | Proje: neondb, host `ep-polished-haze-assggrcn` (eu-central-1). Pooled + direct URL `.env.local`'da | ✅ Bağlı, migration uygulı |
| **Vercel Blob** | **Public** store, projeye bağlı, OIDC ile çalışır | ✅ Medya yükleme çalışıyor |
| **Resend** | E-posta bildirimi | ❌ Kurulmadı (domain DKIM gerekli) |
| **Google Search Console** | SEO | ❌ Kurulmadı |
| **Google Business Profile** | Yerel görünürlük | ❌ Kurulmadı |
| **WhatsApp** | Numara: **0545 936 33 47** (wa.me/905459363347) | ✅ Tüm CTA'lar buraya |
| **Instagram** | instagram.com/hizirsoftware (footer + Hakkımızda) | ✅ Sitede linkli |
| **İletişim e-postası** | iletisim@hizirsoftware.com (site config) | ⚠️ Gerçek kutu var mı teyit edilmeli |

### Ortam değişkenleri (Vercel'de + `.env.local`'da)
- `DATABASE_URL` — Neon **pooled** bağlantı (uygulama sorguları)
- `DIRECT_URL` — Neon **direct** bağlantı (migration'lar; host'ta `-pooler` YOK)
- `SESSION_SECRET` — 64 karakter rastgele (admin oturum şifreleme). **Prod'da yerelden farklı olmalı.**
- `NEXT_PUBLIC_SITE_URL` — `https://hizirsoftware.com` olmalı (canonical/OG/sitemap)
- `BLOB_STORE_ID` + `BLOB_WEBHOOK_PUBLIC_KEY` — Vercel Blob (otomatik, OIDC)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` — **yalnızca `npm run db:seed` için** (Vercel'e GİRİLMEZ)
- `ADMIN_PREVIEW=1` — **yalnızca yerel geliştirme**; giriş/DB olmadan paneli gezmek için. **Prod'a ASLA girilmez.**

> ⚠️ **Güvenlik:** Neon bağlantı dizesi ve admin parolası sohbet geçmişinde
> açıkta paylaşıldı. Güvenlik için Neon parolasını bir kez sıfırlamak (rotate)
> ve yeni değeri Vercel + `.env.local`'a girmek iyi olur.

### Admin giriş
- Adres: `https://hizirsoftware.com/admin/login`
- E-posta: `yildirimabdullah4700@gmail.com`
- Parola: `.env.local` içindeki `ADMIN_PASSWORD` (rol: OWNER)

---

## 4. Proje Yapısı (Hangi dosyalarla çalışıyoruz?)

```
hizir-software/
├─ prisma/
│  ├─ schema.prisma          # DB modelleri (User, Page, ContactSubmission,
│  │                         #  MediaAsset, SiteSetting, AnalyticsEvent)
│  ├─ migrations/            # init + analytics_and_pricing
│  └─ seed.ts                # ilk admin + hizmet sayfalarını içe aktarır
├─ messages/
│  ├─ tr.json / en.json      # TÜM site metinleri (fiyatlar, SSS, sayfalar...)
├─ src/
│  ├─ app/
│  │  ├─ [locale]/(marketing)/   # PUBLIC SİTE
│  │  │  ├─ page.tsx             #   ana sayfa (hero, fiyat, örnek çalışmalar, SSS)
│  │  │  ├─ hizmetler/[slug]/    #   6 hizmet detay sayfası
│  │  │  ├─ calismalar/          #   örnek çalışmalar (public)
│  │  │  ├─ iletisim/ hakkimizda/ gizlilik/ kullanim-kosullari/
│  │  │  └─ layout.tsx           #   header + footer + WhatsApp float
│  │  ├─ admin/                  # ADMIN PANEL (locale DIŞINDA)
│  │  │  ├─ login/               #   giriş
│  │  │  └─ (dashboard)/         #   genel bakış, mesajlar, sayfalar,
│  │  │     ...                  #   fiyatlandırma, medya, ayarlar, kullanıcılar
│  │  ├─ api/
│  │  │  ├─ contact/route.ts     #   form → DB + Resend
│  │  │  └─ track/route.ts       #   analitik olay toplama
│  │  ├─ [locale]/layout.tsx     #   kök layout + analitik + Vercel Analytics
│  │  ├─ icon.tsx / apple-icon.tsx / opengraph-image.tsx  # dinamik favicon/OG
│  │  └─ sitemap.ts / robots
│  ├─ components/
│  │  ├─ sections/               # hero, pricing-grid, showcase-gallery, faq, ...
│  │  ├─ layout/                 # site-header, site-footer
│  │  ├─ ui/                     # button, whatsapp-float/icon, ...
│  │  └─ analytics/page-tracker.tsx
│  ├─ features/admin/            # ADMIN İŞ MANTIĞI (route'lardan ayrı)
│  │  ├─ auth/                   #   session.ts, password.ts, actions.ts
│  │  ├─ pages/ submissions/ media/ settings/ users/ pricing/ analytics/
│  │  └─ preview.ts             #   ADMIN_PREVIEW demo verisi
│  ├─ config/
│  │  ├─ site.ts                #   url, iletişim, telefon, sosyal linkler, nav
│  │  └─ services.ts            #   hizmet slug'ları
│  └─ lib/                      #   prisma.ts, track.ts, seo.ts, utils.ts, motion.ts
├─ docs/
│  ├─ ROADMAP.md               # 4 uzman mutabakatıyla aşamalı yol haritası
│  └─ decisions/               # ADR'ler (0001-0008)
├─ vercel.json                 # build komutu = build:prod (migrate deploy dahil)
├─ CHANGELOG.md
└─ handoff.md                  # (bu dosya)
```

### Önemli komutlar
```bash
npm run dev          # geliştirme sunucusu (localhost:3000)
npm run build        # yerel derleme
npm run build:prod   # migrate deploy + build (Vercel bunu kullanır)
npm run typecheck    # tsc --noEmit
npm run lint
npm run db:migrate   # prisma migrate dev (yeni migration)
npm run db:seed      # ilk admin + hizmet sayfalarını yükle
npm run db:studio    # Prisma Studio (DB gezgini)
```

### İçerik yönetim mantığı (hibrit)
- **UI metinleri** (buton etiketleri, nav): `messages/*.json`'da kalır.
- **İş içeriği** (hizmet sayfaları, fiyatlar): DB'de (`Page`/`PageTranslation`,
  `SiteSetting`), panelden düzenlenebilir. DB'de kayıt yoksa `messages`'a düşer
  (regresyon yok).

---

## 5. Şu ana kadar ne yapıldı? (Kronolojik özet)

1. **Pazarlama sitesi** kuruldu: cihaz mockup'lı hero, fiyat vitrini, örnek
   çalışmalar galerisi, 6 hizmet detay sayfası (TR+EN), SSS, WhatsApp entegrasyonu,
   yüzen WhatsApp butonu, gizlilik + kullanım koşulları sayfaları.
2. **Admin panel** yazıldı: iron-session auth, mesajlar/sayfalar/medya/ayarlar/
   kullanıcılar + geliştirici önizleme modu.
3. **4 uzman + moderatör mutabakatıyla** aşamalı yol haritası çıkarıldı
   (`docs/ROADMAP.md`). Aşama 0-5 kod tarafı tamamlanıp aşama aşama commit'lendi.
4. **Neon veritabanı** bağlandı, migration + seed çalıştırıldı, iletişim formu
   DB-öncelikli hale getirildi (mesaj kaybolmaz).
5. **Kampanya fiyatlandırması**: "İlk 15 müşteriye %30 indirim", çizili liste
   fiyatı + indirimli fiyat + yıllık + kurulum ücretleri. Güncel liste aylık:
   QR ₺500→₺350, Web ₺1.750→₺1.225, POS ₺1.250→₺875, Kapsamlı ₺2.450→₺1.715.
   Kurulum (indirimsiz): ₺1.000 / ₺2.500 / ₺3.500 / ₺4.500.
6. **GitHub + Vercel deploy** yapıldı; site canlıya alındı.
7. **Domain** (hizirsoftware.com) Turhost'tan alınıp Vercel'e bağlandı; DNS
   nameserver sorunu (cpns→dns1/dns2) çözüldü, HTTPS aktif.
8. **Vercel Blob** kuruldu (Public store, OIDC); panelden medya yükleme çalışıyor.
9. **Instagram** eklendi (footer + Hakkımızda satırı).
10. **Kendi analitiğimiz** kuruldu: dashboard'da 14 günlük trafik grafiği,
    ziyaretçi/görüntülenme, WhatsApp tıklama kırılımı, en çok görüntülenen sayfalar
    (gizlilik-dostu; IP saklanmaz).
11. **Panelden fiyat düzenleme** eklendi (`/admin/pricing`).

---

## 6. Site & Proje Durumu (Şu an ne çalışıyor?)

| Özellik | Durum |
|---|---|
| Public site (hizirsoftware.com) | ✅ Canlı, HTTPS, TR+EN |
| İletişim formu → DB → admin Mesajlar | ✅ Çalışıyor (gerçek mesaj düştü) |
| İletişim formu → e-posta bildirimi | ❌ Resend yok (mesaj panelde ama e-posta gelmiyor) |
| Admin giriş + panel | ✅ Çalışıyor (üretimde) |
| Medya yükleme | ✅ Çalışıyor |
| Analitik grafiği | ✅ Çalışıyor (gerçek veri) |
| Panelden fiyat düzenleme | ✅ Çalışıyor (DB round-trip test edildi) |
| SEO canonical/OG | ⚠️ `NEXT_PUBLIC_SITE_URL` gerçek domaine güncellenmeli |

### ⚠️ Bilinen kısıt (test ortamı)
Claude'un **iç tarayıcısı** iron-session cookie'sini POST/sunucu-aksiyonlarında
iletmiyor; bu yüzden admin **yazma** işlemleri (Kaydet) o tarayıcıda test
edilemedi. **Üretimde çalışıyor** (kullanıcı medya yüklemeyi başardı — aynı
`requireSession` deseni). Yerelde test için normal Chrome ya da `ADMIN_PREVIEW=1`
kullanılmalı.

---

## 7. Önümüzde ne var? (Yapılacaklar / Gelecek planlar)

### Kısa vade — yayın tamamlama (öncelik sırasıyla)
1. **`NEXT_PUBLIC_SITE_URL` = `https://hizirsoftware.com`** yapıp redeploy et
   (canonical/OG/sitemap doğru domaini yaysın). *Kod hazır, sadece Vercel env.*
2. **Resend kurulumu** — form mesajları e-posta olarak da gelsin. Domain hazır
   olduğu için artık yapılabilir: resend.com'da domain doğrula (Turhost'a
   SPF/DKIM DNS kayıtları), `RESEND_API_KEY`'i Vercel'e ekle.
3. **Google Business Profile** aç (yerel görünürlük, bedava lead).
4. **Google Search Console** — domain doğrula, sitemap gönder.

### Orta vade — güven & dönüşüm (satış işi)
5. **İlk gerçek referans**: 1-2 tanıdık işletmeye QR menü kur, izinle gerçek
   ekran görüntüsü + yorum al → `/calismalar`'daki "Demo" kartlarını gerçeğiyle
   değiştir. (Şu an vitrindeki markalar kurgu, "Demo" rozetli.)
6. **Admin panel iyileştirmeleri** (kullanıcı talebi — HENÜZ YAPILMADI):
   - Mesajlar/Medya/Kullanıcılar sekmelerini daha kapsamlı/kullanışlı yap
   - Ayarlar sekmesini gerçek bir ayarlar paneline dönüştür
   - Panele premium bir tasarım havası ver
7. **Blog** (public + admin CRUD) — SEO içeriği için.

### Uzun vade — koşullu (bkz. ROADMAP Aşama 6 + ADR 0007)
8. **Çok kiracılı platform DB'si** (Website Builder / restoran SaaS) — YALNIZCA
   1-2 gerçek ödeyen müşteri kapandığında başlanır. Tasarım ADR'de hazır, kod yok.

### Sertleştirme (trafik/veri arttıkça)
9. Haftalık DB yedeği (Neon PITR + pg_dump).
10. Lighthouse a11y/performans denetimi CI'a bağlama.

---

## 8. Hızlı referans — sık yapılan işler

- **Fiyat değiştir:** `/admin/pricing` (panelden) VEYA `messages/*.json` →
  `home.pricing` (kod). Panel kaydı `messages`'ı ezer.
- **Hizmet sayfası metni:** `/admin/pages` (panel) VEYA `messages` →
  `serviceDetails.<slug>`.
- **Telefon/sosyal/nav:** `src/config/site.ts`.
- **Yeni migration:** şemayı düzenle → `npm run db:migrate --name <ad>` →
  commit et (`prisma/migrations/` dahil) → push (Vercel `migrate deploy` koşar).
- **Kampanyayı kapat:** `messages`'ta `home.pricing.campaign` ve `listPrice`/
  `annualListPrice` alanlarını temizle (veya panelden kampanya bandını boşalt).

---

## 9. Kararların gerekçeleri (nereye bakmalı?)

- **`docs/ROADMAP.md`** — 4 uzman mutabakatıyla aşamalı plan + çelişki uzlaşıları
- **`docs/decisions/0001-0008`** — mimari kararlar (teknoloji, klasör, hosting,
  i18n, starter felsefe, admin panel, platform DB, güvenlik/yedekleme)
- **`CHANGELOG.md`** — sürüm sürüm ne değişti
