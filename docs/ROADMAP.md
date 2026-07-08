# HIZIR Software — Aşamalı Yol Haritası (Mutabakat Kaydı)

**Tarih:** 2026-07-08
**Yöntem:** 4 uzman görüşü (Ürün/Satış, Ön Yüz/UX, Arka Uç/Altyapı, Kalite/SEO/Hukuk) + moderatör mutabakat sentezi.
**Sonuç:** Tüm maddelerde 4/4 oybirliği.

## Özet

Dört uzman da tek noktada birleşiyor: **bir şey satılmadan önce site canlı, güvenilir ve yönetilebilir olmalı.** Yani deploy + gerçek alan adı + Neon veritabanı + placeholder'ların kapatılması bir ön koşuldur; cila ve büyüme sonra gelir. Plan, teknik olmayan tek kişilik sahip için **her aşaması git commit + CHANGELOG + gerektiğinde ADR ile kayıt altına alınacak** şekilde aşamalandırılmıştır.

---

## Aşama 0 — Kayıt disiplini + karar hijyeni (koda dokunmaz)

**Amaç:** Bundan sonraki her adımın izlenebilir ve geri alınabilir olması.

- GitHub'da **private repo** aç, mevcut tek "Initial commit"i push et (Vercel için zaten ön koşul).
- **ADR 0006 çakışmasını gider:** Mükerrer `0006-restoran-platformu-veri-modeli.md`, `0007-platform-veritabani-tasarimi.md` ile aynı içerikti; silindi. Sonuç: 0006 = admin panel, 0007 = platform veritabanı (tekil).
- **CHANGELOG.md** (Keep a Changelog formatı) oluştur; `.gitignore`'un `.env*.local` + `.next`'i dışladığını teyit et (mevcut).

**Kayıt:** `chore(docs): ADR 0006 çakışmasını gider, CHANGELOG ekle` + GitHub'a push.
**Bitti sayılır:** Private repo GitHub'da; tek 0006 var; CHANGELOG mevcut; `.env.local` izlenmiyor.

## Aşama 1 — Veri katmanını lokalde ayağa kaldır (Neon + migration + seed)

**Amaç:** Deploy anında prod'da debug yapmamak için DB'yi önce lokalde uçtan uca çalıştır.

- Neon'da ücretsiz proje; **POOLED** connection string (uygulama) + **DIRECT_URL** (migration) ayrı alınır.
- `.env.local`'a gerçek `DATABASE_URL` + `DIRECT_URL`; **`ADMIN_PREVIEW` kaldırılır**; `npx prisma migrate dev --name init` ile ilk migration üretilir (repoda `prisma/migrations/` yok — bu adım oluşturur).
- `ADMIN_EMAIL/PASSWORD/NAME` girilir, `npm run db:seed` çalıştırılır; form gönderimi → DB → admin > Mesajlar akışı doğrulanır.

**Kayıt:** `feat(db): Neon Postgres + ilk migration + admin seed`; `prisma/migrations/` commit'e dahil.
**Bitti sayılır:** Lokalde gerçek admin ile /admin'e giriliyor; form DB'ye yazıyor.

## Aşama 2 — Canlıya al: deploy + domain + placeholder kapatma + KVKK kapısı

**Amaç:** Satılabilir, HTTPS'li, gerçek adresli canlı site.

- Alan adı al; Vercel'i repo'ya bağla; domaini ekle. Sırlar **yalnızca Vercel env'e**: `DATABASE_URL`, `DIRECT_URL`, `SESSION_SECRET` (yeni rastgele), `NEXT_PUBLIC_SITE_URL`. **`ADMIN_PREVIEW` üretimde ASLA girilmez.**
- `package.json` build: `prisma migrate deploy && next build` (şu an sadece `next build`).
- `src/config/site.ts` satır 9-10 `url`/`contactEmail` placeholder'ları gerçek değerlerle; boş `public/` klasörüne **favicon + statik OG fallback** görseli.
- **KVKK kapısı:** Form kişisel veriyi (ad, e-posta, IP) sakladığından gizlilik metni "hangi veri / ne süre / hangi işleyiciler (Neon+Vercel+Resend) / hukuki dayanak" ile güncellenir + form altına aydınlatma linki. (Fiyat/KDV/sözleşme netliği ayrı bir iş kararıdır.)

**Kayıt:** `feat(deploy): Vercel prod + domain, placeholder kapatma, build'e migrate deploy, KVKK metni`; CHANGELOG **v0.1.0**.
**Bitti sayılır:** Gerçek HTTPS domainde açılıyor; WhatsApp önizlemesi görsel+doğru başlık; prod'da ADMIN_PREVIEW yok; gizlilik metni gerçek akışla uyumlu.

## Aşama 3 — Lead hunisini tam çalışır kıl (Resend + Blob + WhatsApp bağlamı + smoke test)

**Amaç:** Gelen her mesaj sahibe fiilen ulaşsın ve hangi paketten geldiği belli olsun.

- **Resend** hesabı + domain doğrulama (SPF/DKIM) + `RESEND_API_KEY`; **Vercel Blob** + `BLOB_READ_WRITE_TOKEN`, panel medya yüklemesi test.
- WhatsApp CTA'ları **ön-doldurulmuş metinle** wa.me'ye (ör. "Merhaba, QR Menü ₺300 paketi için bilgi almak istiyorum"); iletişim formuna **alan-bazlı hata + aria-live/aria-invalid + client e-posta doğrulaması + hataya odak**.
- Deploy sonrası **smoke-test:** form→DB→e-posta; admin login gerçek mod; 404/500 yok; temel SEO (title/meta/hreflang/robots).

**Kayıt:** `feat(lead): Resend+Blob, ön-doldurulmuş WhatsApp CTA, form a11y, smoke-test`; CHANGELOG "Lead hunisi uçtan uca çalışır".
**Bitti sayılır:** Test formu sahibin e-postasına düşüyor; her buton doğru ön-dolu metne gidiyor; smoke-test tamamen yeşil.

## Aşama 4 — Güven + dönüşüm katmanı (ilk referans, fiyat netliği, public portfolyo/SSS)

**Amaç:** Sosyal kanıt açığını kapat. Bu bir go-to-market işi — saf kod değil.

- 1-2 tanıdık/yerel işletmeye QR menüyü **"kurucu fiyatı"** ile kur; izinle gerçek isim + ekran görüntüsü + tek cümlelik yorum al. Public **`/calismalar`** (detay sayfalı) + **`/blog`** rotalarını yayına al; gerçek referans gelene kadar vitrin "Demo" rozetli kalır.
- Fiyat kartlarını netleştir: kapsam (madde madde), kurulum ücreti, "iptal serbest", "KDV dahil", "En çok tercih edilen" rozeti (detaylar sahiple netleşir). **Analytics** (Vercel/Plausible) ile hangi paketin tıklandığını ölç; eklenince aydınlatma metnini güncelle.
- "Nasıl çalışır: yaz-kur-yayınla" + teslim/garanti **SSS**; **Google İşletme Profili** + gerçek OG/telefon/e-posta.

**Kayıt:** `feat(content): /calismalar + /blog`, `feat(pricing): netlik + analytics`, `feat(trust): SSS + Google İşletme + OG`; CHANGELOG **v0.2.0**.
**Bitti sayılır:** En az 1 gerçek referans public'te; fiyat kartları net; analytics topluyor; SSS + Google İşletme yayında.

## Aşama 5 — Sertleştirme + sistematik kalite denetimi (görseller/trafik geldikten sonra)

**Amaç:** Canlı ve satan sistemi güvenli, hızlı, erişilebilir, yedekli kıl. **Ölçüme dayalı cila — kör optimizasyon yok.**

- **Güvenlik:** admin login'e rate-limit; /admin middleware koruması ve prod'da preview bypass'ının erişilemezliği; bcrypt cost + iron-session cookie (Secure+HttpOnly+SameSite) teyidi.
- **Performans + a11y:** gerçek görsellerde next/image + AVIF/WebP + lazy-load + LCP; framer-motion hydration maliyetini mobilde **ölç** + prefers-reduced-motion; skip-to-content, focus-visible, kontrast, heading hiyerarşisi; Lighthouse a11y + axe CI'a.
- **Yedekleme:** Neon PITR teyit + haftalık `pg_dump` scheduled task ile harici depoya.

**Kayıt:** `feat(security)`, `perf(ui)`, `ops(db)` commit'leri; kısa ADR'ler (güvenlik + yedekleme); CHANGELOG **v0.3.0**.
**Bitti sayılır:** Admin brute-force'a korumalı; Lighthouse a11y+SEO CI yeşil; LCP ölçülü; haftalık yedek çalışıyor.

## Aşama 6 — KOŞULLU: Faz C çok kiracılı website-builder DB'si

**Amaç:** Tek ürünün (QR Menü) sattığı **kanıtlandıktan sonra** çok kiracılı platform. Talep yoksa başlatılmaz.

- **Tetik:** en az 1-2 gerçek ödeme yapan müşteri + doğrulanmış platform talebi.
- Tetiklenirse ADR 0007 tasarımı Prisma migration'a dönüştürülür; kiracı izolasyonu + yetkilendirme uygulanır.

**Kayıt:** Tetiklenirse ADR "Uygulandı" güncellenir, migration commit, CHANGELOG **v0.4.0**. Tetiklenmezse "ertelendi, talep bekliyor" olarak ADR'de not.
**Bitti sayılır:** Ya migration uygulanıp gerçek kiracıyla test edildi; ya da bilinçli ertelenip ADR'de kayıtlı.

---

## Uzlaştırılan çelişkiler

1. **Sıralama (önce DB mi, deploy mi, kayıt mı?):** Rakip değil, aynı paketin bağımlı parçaları. Uzlaşı: **domain/kayıt (Aşama 0) → veri katmanı lokalde (1) → deploy birleştirir (2).** Boş prod'a çıkıp orada debug riski elenir.
2. **KVKK metni kimin işi?:** Fiyat/KDV/sözleşme **iş kararıdır** (sahiple netleşir), ama kişisel veri işleme metni **deploy öncesi zorunlu kalite kapısıdır** — ayrıştırıldı, Aşama 2 exit kriterine bağlandı.
3. **Faz C zamanlaması:** Oybirliğiyle **en sona ve koşullu** — yalnızca gerçek müşteri talebi doğrulanınca.
4. **Ön yüz cilası ne zaman?:** İkiye ayrıldı — satışı doğrudan etkileyen minimum düzeltmeler (form a11y, WhatsApp linkleri, OG) erken (2-3); sistematik denetimler (Lighthouse/axe CI, CWV, WCAG) trafik/görsel sonrası (5). **Ölçmeden cila eklenmez** kuralı korundu.

## Mutabakat notları (4/4 hemfikir)

- Site canlıya alınmadan hiçbir satış/cila aksiyonu anlamlı değil.
- Neon + ilk migration + seed olmadan panel demo kalır; kod DB-öncelikli olduğundan DB yoksa lead'ler kalıcı saklanmaz.
- `site.ts` placeholder'ları ve boş `public/` (favicon/OG) kapatılmalı.
- Her şey tek commit'te — aşamalı commit + CHANGELOG + GitHub push şart (kullanıcının "aşama kaydı" talebi).
- İki 0006 ADR çakışması giderilmeli (mükerrer silindi → 0006 admin, 0007 platform).
- Sırlar yalnızca Vercel env'de; `ADMIN_PREVIEW` prod'da asla.
- Resend/Blob opsiyonel-degrade ama üretimde eksikse kritik lead kaybı.
- Kurgu "Demo" içerik dürüst ama zayıf; gerçek referansla değiştirilmeli.
- Faz C tek kişilik/bütçe bilinçli sahip için erken optimizasyon; talep doğrulanınca.
