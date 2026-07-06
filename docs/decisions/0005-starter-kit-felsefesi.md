# ADR 0005 — Starter Kit Felsefesi

**Durum:** ✅ Kabul edildi
**Tarih:** 3 Temmuz 2026

## Bağlam

HIZIR Software'in ajans kolu çok sayıda müşteri projesi teslim edecek. Kâr marjı,
"ikinci, beşinci, onuncu projeyi ne kadar hızlı ve tutarlı teslim ettiğimize"
bağlı. Ancak amaç, müşterilere aynı tasarımı satmak değil — bu amatörlük olur ve
müşteri bunu hisseder.

## Karar

İki katmanlı bir starter kit:

- **Değişmeyen katman** (her projede birebir aynı):
  build araçları, TypeScript config, SEO altyapısı, form/analytics/performans
  yardımcıları, erişilebilirlik standartları, deployment script'leri, `ui/`
  component'lerinin mantığı.
- **Değişen katman** (her müşteride sıfırdan, ama aynı sistem üzerinden):
  design token'ları — renk, tipografi, spacing, motion. Marka kimliği, tasarım,
  kullanıcı deneyimi her projede özgün.

**Analoji:** Motor ortak, kaporta özgün. (Volkswagen ile Audi aynı şasiyi
paylaşır ama kimse Audi'yi Volkswagen sanmaz.)

## Gerekçe

- `<Button>` her projede *var* ve aynı mantıkta çalışır, ama rengini/formunu
  token'lardan aldığı için her projede *farklı* görünür.
- Bu sayede müşteri sitesi hızlı teslim edilir ama her seferinde özgün olur.
- HIZIR Software'in kendi sitesi, bu sistemin ilk ve en gösterişli vitrin örneği olur.

## ⚠️ Kritik Uyarı: "Rule of Three"

Starter kit'i ilk günden mükemmel yapmaya **çalışma**. En büyük hata, hiç
müşterin yokken haftalarca "kusursuz boilerplate" cilalamaktır.

**Doğru yol:** Önce HIZIR sitesini yap. Tekrar eden parçaları *fark ettikçe*
starter kit'e taşı. Bir şeyi **üçüncü** kez kopyaladığında soyutla — önce değil.
Şablon, gerçek projelerden damıtılır; masabaşında tasarlanmaz.

## Alternatifler

- **Tek katmanlı sabit şablon:** Her müşteriye aynı görünümü verir → amatörlük,
  düşük algılanan değer. Reddedildi.
- **Her projeyi sıfırdan yapmak:** Tutarsızlık ve zaman kaybı → düşük kâr marjı.
  Reddedildi.

## Sonuçlar

**Avantajlar:**
- Hızlı + tutarlı + özgün teslimat.
- Zamanla olgunlaşan, gerçek deneyimden damıtılmış bir sistem.

**Dezavantajlar / dikkat:**
- "Ne ortak kalmalı, ne özgün olmalı?" ayrımı sürekli dikkat gerektirir.
- Erken soyutlama tuzağına düşmemek için disiplin şart (Rule of Three).

## Ne zaman gözden geçirilir?

- İlk 2-3 gerçek müşteri projesi tamamlandığında → starter kit'e nelerin
  taşınacağı somutlaşacak.
