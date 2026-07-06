# ADR 0002 — Proje ve Klasör Yapısı

**Durum:** ✅ Kabul edildi
**Tarih:** 3 Temmuz 2026

## Bağlam

Proje bugün tek bir kurumsal siteden ibaret olsa da, ileride blog, admin panel,
müşteri panel, CRM ve API servisleri eklenecek. Klasör yapısı, bu büyümeyi
"dosyaları taşımak / projeyi yeniden yazmak" zorunda kalmadan destekleyecek
şekilde kurulmalı. Aynı zamanda solo geliştirici için bugün gereksiz karmaşıklık
yaratmamalı.

## Karar

Tek Next.js projesi, aşağıdaki **monorepo'ya taşınabilir** iç yapıyla:

```
hizir-software/
├── docs/                    # Karar kayıtları, mimari, tasarım sistemi
├── messages/                # i18n çeviri dosyaları
│   ├── tr.json
│   └── en.json
├── public/                  # Statik varlıklar (görsel, font, favicon)
└── src/
    ├── app/
    │   └── [locale]/        # Dil segmenti (i18n'in kalbi)
    │       ├── (marketing)/ # Route group: kurumsal site
    │       │   ├── page.tsx
    │       │   ├── hakkimizda/
    │       │   ├── hizmetler/
    │       │   └── iletisim/
    │       ├── layout.tsx
    │       └── api/         # API route'ları (form gönderimi vb.)
    ├── components/
    │   ├── ui/              # shadcn/ui — atomik, tasarımdan bağımsız
    │   ├── layout/          # Header, Footer, Navigation
    │   └── sections/        # Sayfa blokları (Hero, Features, CTA)
    ├── features/            # Özellik-bazlı modüller (panel/CRM buraya büyür)
    ├── styles/
    │   └── tokens.css       # Design token'ları (DEĞİŞEN katman)
    ├── lib/                 # Yardımcı araçlar, i18n config
    ├── config/             # site.ts (navigasyon, metadata)
    ├── hooks/               # Paylaşılan React hook'ları
    └── types/               # Global TypeScript tipleri
```

## Gerekçe

- **`src/` kökü:** Config dosyalarını uygulama kodundan ayırır; kök dizin temiz kalır.
- **`[locale]` segmenti:** Dil, route'un en dışında. EN açıldığında hiçbir dosya
  taşınmaz. (bkz. ADR 0004)
- **Route group `(marketing)`:** Parantezli klasör URL'ye yansımaz ama kodu
  gruplar. İleride `(dashboard)`, `(admin)` gibi gruplar aynı seviyede, temiz
  sınırlarla eklenir.
- **`components/ui` vs `sections`:** `ui/` starter kit'in değişmeyen çekirdeği
  (her projede aynı mantık, farklı görünüm); `sections/` projeye özgü. Bu ayrım
  "altyapı ortak, tasarım özgün" felsefesini kod seviyesinde zorunlu kılar.
- **`features/`:** Her büyük özellik kendi kabuğunda yaşar. Bir özelliğin kodu
  diğerini bozmaz; monorepo'ya taşıma günü geldiğinde her feature temiz bir
  şekilde ayrılabilir.
- **`styles/tokens.css`:** Design token'ları tek yerde. Müşteri projesinde sadece
  bu dosya değişir, component kodu aynı kalır.

## Alternatifler

- **Monorepo (Turborepo) ile başlamak:** Solo geliştirici + tek ürün için erken
  optimizasyon. Bugün yapılandırma/CI karmaşıklığı maliyeti getirir, karşılığında
  bir fayda vermez. İkinci bağımsız ürün veya ikinci geliştirici geldiğinde geçilecek.
- **Teknik-tip bazlı düz yapı** (tüm component'ler tek klasörde): Küçük projede
  çalışır ama büyüdükçe yönetilemez hale gelir. `features/` yaklaşımı daha ölçeklenebilir.

## Sonuçlar

**Avantajlar:**
- Bugün basit, yarın büyümeye hazır.
- Her katmanın sorumluluğu net.
- Monorepo'ya taşıma 1-2 günlük iş olarak kalır (felaket değil).

**Dezavantajlar / dikkat:**
- `features/` ve `components/` arasındaki sınırı disiplinle korumak gerekir;
  aksi halde kod yanlış yerlere dağılır. Kod inceleme (code review) aşamasında
  bu sınıra dikkat edilecek.

## Ne zaman gözden geçirilir?

- İkinci bağımsız ürün (ör. HIZIR Drone Platformu) geliştirilmeye başlandığında
  → monorepo değerlendirilecek.
- Ekibe ikinci geliştirici katıldığında.
