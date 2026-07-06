# ADR 0004 — Çok Dillilik (i18n)

**Durum:** ✅ Kabul edildi
**Tarih:** 3 Temmuz 2026

## Bağlam

HIZIR Software önce Türkiye'de tanınmayı, sonra uluslararası pazara açılmayı
hedefliyor. Kurumsal site ileride İngilizce de sunacak. i18n'i sonradan eklemek
çok pahalıdır (tüm metinleri koddan söküp çıkarmak, her route'u yeniden
yapılandırmak); ancak altyapıyı baştan kurup içeriği tek dilde tutmak neredeyse
bedavadır.

## Karar

- Altyapı en baştan **çok dilli** kurulur (**next-intl**).
- İlk içerikler **yalnızca Türkçe** hazırlanır.
- URL yapısı: `/tr/...` ve (ileride) `/en/...` — dil, route'un en dış segmenti
  (`[locale]`).
- İngilizce açıldığında **hiçbir kod değişmeyecek**, yalnızca `messages/en.json`
  çeviri dosyası doldurulacak.

## Gerekçe

Bu, "geleceği düşün ama bugünü karmaşıklaştırma" prensibinin ders kitabı örneği.
i18n'i "sonra ekleyemeyeceğimiz" nadir kararlardan biri olduğu için baştan
çözüyoruz; ama içeriği çift dilde yazma yükünü şimdi almıyoruz.

## ⚠️ Türkçe'ye Özel Teknik Tuzak

Türkçe'de `i`/`İ` harfleri, standart `toLowerCase()` / `toUpperCase()` ile
**yanlış** dönüşür (JavaScript varsayılanı İngilizce kurallarını uygular:
"İstanbul".toLowerCase() → "i̇stanbul" gibi bozuk sonuçlar).

**Kural:** String büyük/küçük harf işlemlerinde daima locale-aware metotlar
kullanılacak:
```js
str.toLocaleLowerCase('tr-TR')
str.toLocaleUpperCase('tr-TR')
```
Bu, arama, filtreleme, slug üretimi gibi yerlerde sessiz hatalara yol açan
klasik bir Türkçe bug'ıdır. Kod inceleme aşamasında bu noktaya dikkat edilecek.

## Alternatifler

- **i18n'i tamamen sonraya bırakmak:** Reddedildi. Sonradan eklemek 5 kat pahalı;
  tüm route ve metin yapısını yeniden kurmak gerekir.
- **İki dili de en baştan tam içerikle doldurmak:** Reddedildi. Henüz EN pazarına
  girmeden çift içerik yazmak gereksiz yük.

## Sonuçlar

**Avantajlar:**
- EN'i açmak sadece çeviri dosyası eklemek olur; sıfır refactor.
- SEO açısından her dil kendi URL'ine sahip.

**Dezavantajlar / dikkat:**
- Metinler baştan çeviri dosyalarında (`messages/tr.json`) tutulmalı, koda
  gömülmemeli. Bu bir disiplin gerektirir ama karşılığı büyük.

## Ne zaman gözden geçirilir?

- İngilizce içerik hazır olduğunda → `messages/en.json` doldurulacak, `en` locale
  aktif edilecek.
