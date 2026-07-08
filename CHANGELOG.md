# Değişiklik Günlüğü

Bu projedeki tüm önemli değişiklikler bu dosyada tutulur.
Format [Keep a Changelog](https://keepachangelog.com/tr/1.1.0/) temel alınır;
sürümleme [Semantic Versioning](https://semver.org/lang/tr/) izler.

Yol haritası ve aşama gerekçeleri için bkz. [docs/ROADMAP.md](docs/ROADMAP.md).

## [Yayımlanmadı]

### Eklendi
- Ana sayfa: cihaz mockup'lı hero vitrini, fiyatlandırma bölümü (QR Menü / Web
  Sitesi / POS / Kapsamlı İşletme) WhatsApp CTA'larıyla, "Örnek Çalışmalar"
  galerisi (kurgu markalar, "Demo" rozetli), yüzen WhatsApp butonu.
- 6 hizmet detay sayfası (TR + EN) ve içerik modülleri.
- Kullanım Koşulları sayfası; footer'da telefon/WhatsApp ve yasal bağlantılar.
- Admin panel (V1): iron-session + bcrypt kimlik doğrulama, Prisma şeması,
  genel bakış / mesajlar / sayfa içerik editörü (TR-EN) / medya / ayarlar /
  kullanıcılar bölümleri.
- Geliştirici önizleme modu (`ADMIN_PREVIEW=1`, yalnızca yerel): admin panelini
  giriş ve veritabanı olmadan demo veriyle gezme.
- İletişim API'si artık DB-öncelikli: mesaj önce veritabanına yazılır, sonra
  Resend ile e-posta gönderilir (e-posta kesintisinde lead kaybolmaz).

### Değişti
- Navigasyon: "Hakkımızda" menüden kaldırıldı (URL'den erişilebilir kalır),
  "Fiyatlandırma" eklendi.
- `docs/decisions/`: mükerrer platform veritabanı ADR'si (`0006-restoran-...`)
  silindi; tekil ADR `0007-platform-veritabani-tasarimi.md` olarak korundu.
  Sonuç: 0006 = admin panel, 0007 = platform veritabanı.

### Notlar
- Bu sürüm henüz canlıya alınmadı. Yayın öncesi gerekli adımlar (Neon
  veritabanı, deploy, gerçek alan adı, KVKK metni) için bkz. ROADMAP Aşama 1-2.
