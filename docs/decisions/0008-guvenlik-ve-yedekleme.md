# ADR 0008 — Güvenlik Sertleştirme ve Yedekleme

**Durum:** 🟢 Kısmen uygulandı (login rate-limit) — kalanlar canlı sonrası
**Tarih:** 2026-07-08
**İlgili:** ROADMAP Aşama 5

## Bağlam

Admin panel (ADR 0006) kişisel veri (iletişim mesajları: ad, e-posta, IP)
barındırdığından, canlıya alma öncesi/sonrası temel bir güvenlik ve
dayanıklılık zemini gerekir. Bu ADR, alınan kararları kısa biçimde kayda
geçirir.

## Kararlar

### 1. Kimlik doğrulama sertleştirme (uygulandı)

- **Brute-force koruması:** `/admin/login` server action'ında IP başına
  başarısız deneme sınırı (15 dakikada en fazla 8 başarısız deneme). Serverless
  instance başına in-memory; birden çok instance'a çıkıldığında dağıtık bir
  limitle (ör. Upstash Ratelimit) değiştirilebilir.
- **Zamanlama sızıntısı yok:** Kullanıcı bulunmasa bile parola doğrulaması
  kadar süre harcanır (kullanıcı sayımı/enumerasyon engellenir).
- **Cookie güvenliği:** iron-session cookie'si `httpOnly` + `sameSite=lax` +
  üretimde `secure`; oturum 8 saat sonra düşer.
- **Parola:** bcrypt maliyet faktörü 12.

### 2. Önizleme modu üretimde kapalı (uygulandı)

`ADMIN_PREVIEW` bayrağı yalnızca `NODE_ENV !== "production"` iken etkilidir
(çift kilit). Üretimde tanımlansa bile önizleme bypass'ı devreye girmez.
Yine de bu bayrak Vercel üretim ortamına ASLA girilmemelidir.

### 3. Sırların yönetimi (politika)

`SESSION_SECRET` ve API anahtarları (Resend, Blob) yalnızca Vercel ortam
değişkenlerinde tutulur, repoya girmez. `SESSION_SECRET` üretimde yerelden
farklı ve rastgele üretilir.

### 4. Yedekleme (canlı sonrası — ertelendi)

- Neon'un point-in-time restore özelliği teyit edilir.
- Haftalık `pg_dump` bir zamanlanmış görevle harici bir depoya alınır.
- Gerçek trafik/veri oluşmadan önce kurulması şart değildir; ilk gerçek
  müşteri kaydından önce devreye alınmalıdır.

### 5. Sistematik a11y/performans denetimi (canlı sonrası — ertelendi)

Lighthouse a11y + axe CI entegrasyonu, Core Web Vitals ölçümü ve tam WCAG
taraması, gerçek görseller ve trafik geldikten sonra yapılır. "Ölçmeden cila
eklenmez" ilkesi korunur (bkz. ROADMAP çelişki uzlaşısı #4).

## Sonuç

Canlıya alma için yeterli asgari güvenlik zemini hazır; yedekleme ve
sistematik denetim, gerçek kullanım başladığında Aşama 5'in kalanında
tamamlanacak.
