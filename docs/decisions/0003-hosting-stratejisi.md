# ADR 0003 — Hosting / Dağıtım Stratejisi

**Durum:** ✅ Kabul edildi
**Tarih:** 3 Temmuz 2026

## Bağlam

HIZIR Software hem kendi ürünlerini geliştirecek hem de çok sayıda müşteri
projesi teslim edecek. Her projede sıfırdan "bunu nereye deploy etsem?" diye
düşünmek zaman kaybı ve tutarsızlık yaratır. Aynı zamanda küçük bir girişim
olarak maliyet verimliliği kritik.

## Karar

Önceden tanımlı **üç dağıtım profili (reçete)**. Her yeni projede sadece hangi
profile uyduğuna bakılır:

| Profil | Kapsam | Çözüm | Neden |
|--------|--------|-------|-------|
| **A** | HIZIR Software sitesi + kendi ürünlerimiz (SaaS vb.) | **Vercel** | Hız, sıfır DevOps, en iyi Next.js entegrasyonu. Az sayıda, stratejik proje — maliyet burada sorun değil. |
| **B** | Basit kurumsal müşteri siteleri (statik/az dinamik) | **Statik export + ekonomik hosting** (ör. Cloudflare Pages) | Cömert ücretsiz katman. Müşteriden alınan ücretin büyük kısmı kâr kalır. |
| **C** | Dinamik müşteri projeleri (rezervasyon, panel, DB) | **VPS + Coolify** | Çok sayıda dinamik projeyi tek sunucu maliyetine sığdırır. Kendi mini-Vercel'imiz. |

## Gerekçe

- **Neden profil sistemi?** "Proje bazında karar veririz" demek, her seferinde
  yeniden düşünme yükü ve tutarsızlık demek. Reçeteler bu kararı 5 saniyelik bir
  seçime indirir.
- **Neden Vercel sadece kendi ürünlerde?** Vercel harika ama çok sayıda müşteri
  sitesi orada pahalıya patlar. Kendi ürünlerimizde değeri (hız/kolaylık) maliyetine değer.
- **Neden VPS (Coolify)?** Onlarca dinamik müşteri projesini tek VPS'te toplamak,
  her birini ayrı ayrı Vercel'de tutmaktan kat kat ucuz.

## Alternatifler

- **Her şeyi Vercel'de tutmak:** Basit ama müşteri sayısı arttıkça fatura şoku yaratır.
- **Her şeyi VPS'te tutmak:** Ucuz ama kendi ürünlerimizde gereksiz DevOps yükü
  ve daha yavaş geliştirme döngüsü.

## Sonuçlar

**Avantajlar:**
- Maliyet, proje tipine göre optimize.
- Her projede tutarlı, hızlı deploy kararı.

**Dezavantajlar / dikkat:**
- Kod, statik export'u engellemeyecek şekilde yazılmalı (Profil B için). Bu,
  geliştirme sırasında akılda tutulacak bir kısıt.
- VPS (Profil C) DevOps bilgisi gerektirir; Coolify bunu büyük ölçüde basitleştirir
  ama yine de öğrenilmesi gereken bir araç.

## Önemli Not

Bu profillerin hiçbiri bugün kurulmuyor. Bugün sadece **kararı** veriyoruz ki kodu
bu profillere uygun (özellikle statik export'a engel olmayacak) şekilde yazalım.
İlk somut kurulum yalnızca **Profil A** (HIZIR sitesi → Vercel) olacak.

## Ne zaman gözden geçirilir?

- İlk dinamik müşteri projesi geldiğinde → Profil C somut olarak kurulacak.
- Vercel/Cloudflare fiyatlandırması önemli ölçüde değiştiğinde.
