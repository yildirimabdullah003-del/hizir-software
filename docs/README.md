# HIZIR Software — Teknik Dokümantasyon

Bu klasör, HIZIR Software projesinde alınan tüm önemli teknik kararları ve
bunların gerekçelerini içerir. Amaç: aylar sonra bile "bu kararı neden aldık?"
sorusunu net bir şekilde cevaplayabilmek.

## Neden bu dokümanlar var?

Yazılım projelerinde en pahalı hatalar, geçmiş kararların gerekçesinin
unutulmasıyla oluşur. Birisi (belki 6 ay sonraki sen, belki ekibe katılan yeni
bir geliştirici) "burası neden böyle yapılmış?" diye sorduğunda, cevabı
tahmin etmek yerine burada bulabilmeli.

## Klasör Yapısı

- **`decisions/`** — Mimari Karar Kayıtları (ADR — Architecture Decision Records).
  Her önemli teknik karar numaralı bir dosyada, gerekçesi ve alternatifleriyle
  birlikte belgelenir.
- **`design-system.md`** — Renk, tipografi, spacing, animasyon dili. *(Sıradaki adım)*
- **`roadmap.md`** — İlk 30 günlük sprint planı ve uzun vadeli yol haritası. *(Sıradaki adım)*

## Karar Kayıtları (ADR) Nasıl Okunur?

Her ADR şu bölümlerden oluşur:

- **Durum** — Kabul edildi / Değerlendiriliyor / Reddedildi / Yenisiyle değiştirildi
- **Bağlam** — Bu kararı almamızı gerektiren durum neydi?
- **Karar** — Ne karar verdik?
- **Gerekçe** — Neden bu şekilde?
- **Alternatifler** — Başka neleri düşündük, neden seçmedik?
- **Sonuçlar** — Bu kararın avantajları ve dezavantajları
- **Ne zaman gözden geçirilir?** — Bu kararı yeniden değerlendirmemizi gerektirecek sinyaller

## Mevcut Kararlar

| No | Karar | Durum |
|----|-------|-------|
| [0001](decisions/0001-teknoloji-yigini.md) | Teknoloji Yığını (Tech Stack) | ✅ Kabul edildi |
| [0002](decisions/0002-proje-klasor-yapisi.md) | Proje ve Klasör Yapısı | ✅ Kabul edildi |
| [0003](decisions/0003-hosting-stratejisi.md) | Hosting / Dağıtım Stratejisi | ✅ Kabul edildi |
| [0004](decisions/0004-cok-dillilik-i18n.md) | Çok Dillilik (i18n) | ✅ Kabul edildi |
| [0005](decisions/0005-starter-kit-felsefesi.md) | Starter Kit Felsefesi | ✅ Kabul edildi |

---

*Son güncelleme: 3 Temmuz 2026*
