# HIZIR Motion & Experience Masterplan

> Durum: ONAYLANDI (2026-07-14) — sahibin kararlarıyla:
> 1. Koyu bölüm VAR ama blok değil: bölümler birbirinin İÇİNE eriyerek geçer (uzun gradyanlar).
> 2. Malzeme markaya özel: hazır Lottie yok; kod-çizim motion graphics + ileride gerçek ekran loop'ları. Performans daima önce.
> 3. Uygulama: Faz 1+2 BİRLİKTE (tam dönüşüm), Faz 3 ardından.
> Referans his: Linear, Stripe, Vercel, Raycast, Apple. Kopya değil; kendi dilimiz.

---

## 0. Teşhis — bugün neden istenen hissi vermiyor?

| Sorun | Kanıt | Sonuç |
|---|---|---|
| **Obje hareket ediyor, ürün yaşamıyor** | Laptop mouse'la eğiliyor, scroll'da dönüp sallanıyor | "Bak animasyon var" hissi; ucuzlaştırıyor |
| **Enerji Hero'da bitiyor** | Hero'dan sonra sayfa "normal site"ye dönüyor | Kullanıcının heyecanı 1. ekranda tükeniyor |
| **Aynı görsel dil tekrar ediyor** | Laptop → dashboard → kart → gradient → tekrar dashboard | Bölümler birbirinden ayırt edilemiyor |
| **Section'lar hâlâ "biten sayfalar"** | Gradyan geçiş var ama sahne dönüşümü yok | Tek hikâye hissi oluşmuyor |

## 1. Deneyim Anayasası (her kararın süzgeci)

1. **Sahne sabit, hikâye akar.** Büyük objeler (laptop, kartlar, cihazlar) YERİNDEN OYNAMAZ. Hareket her zaman İÇERİKTE: veri, ışık, çizgi, metin.
2. **Motion = kalite işareti, gösteri değil.** Bir hareketi fark ediyorsan ama nedenini soruyorsan → fazladır, çıkar.
3. **Her 1–2 scroll'da bir keşif.** Küçük, tek seferlik, kullanıcı görünce oynayan ("vay be" anı). Döngülü dikkat çeken hiçbir şey yok — tek istisna: canlı VERİ (dashboard).
4. **Her bölüm kendi atmosferi, tek marka dili.** Zemin/ışık/materyal bölümden bölüme değişir; token'lar (renk, radius, gölge, easing) asla değişmez.
5. **3D his = katman derinliği.** Mouse yalnızca ARKA PLAN katmanlarını (ızgara, ışıma) hafifçe kaydırır. Ön plandaki objeye tilt YOK.
6. **Bütçeler:** yalnızca transform/opacity; yeni ağır bağımlılık yok; `prefers-reduced-motion`'da site tamamen durağan; her canlı öğe yalnızca görünürken çalışır.

## 2. Kullanıcı Yolculuğu — sahne sahne

Sayfa tek bir hikâye anlatır: **"Ürün canlı → fiyat net → işler ortada → böyle yapıyoruz → süreç akıyor → sorular → kapanış."**

### Sahne 0 · HERO — "Ürün zaten çalışıyor"
- **Atmosfer:** Aydınlık, nokta-ızgara zemin, merkezde SABİT laptop.
- **Değişen:** Laptop'taki tüm obje hareketi KALKAR — mouse tilt yok, scroll'da dönme/sallanma yok, bildirimde titreme yok. Scroll'da yalnızca **çok hafif perspektif düzelmesi** (rotateX ~6°→0) + yazının doğal çıkışı + arka planın evrilmesi (ışıma büyür, ızgara söner).
- **Yaşayan:** Dashboard'un İÇİ (mevcut: ciro sayacı, sipariş akışı, kendini çizen grafik, tooltip'li barlar) kalır ve incelir: bildirim toast'ı panelin içinde doğal konumda, sipariş satırı yumuşak eklenir.
- **Mouse:** yalnızca zemindeki ışıma/ızgara ~%2 kayar (derinlik hissi, obje sabit).

### Sahne 1 · FİYATLANDIRMA — "Net teklif"
- **Atmosfer:** En aydınlık, en sade bölüm. Güven = sadelik.
- **Keşif anı:** Fiyat rakamları görünüre girince **sayarak dolar** (₺0→₺350, tek sefer). "En çok tercih edilen" rozeti bir kez ışık süpürmesi alır.
- **Mikro:** Kart hover'ında **spotlight border** — imlecin konumunu izleyen hafif ışıklı kenar (Linear dili). Scale yok; ışık + gölge + border tepkisi.

### Sahne 2 · ÖRNEK ÇALIŞMALAR — "İşler ortada" (KOYU BÖLÜM)
- **Atmosfer değişimi:** Sayfa burada **koyu zemine erir** (Stripe/Linear'ın imza hamlesi). Kullanıcı "farklı bir dünyaya girdim" hisseder — atmosfer çeşitliliğinin bel kemiği.
- **Keşif anı:** Üç demo kartının İÇİ görünürken bir kez oynar: web demo'da rezervasyon onayı düşer, QR menüde kategori değişir, POS'ta yeni satır işlenir. Tek sefer, döngüsüz.
- **Not:** Gerçek müşteri ekran görüntüleri geldikçe (panelden yönetiliyor) kartlar gerçek işlere dönüşür.

### Sahne 3 · HİZMETLER — "Böyle inşa ediyoruz" (KOD EDİTÖRÜ)
- **Atmosfer:** Koyudan aydınlığa dönüş; sol/üstte yeni görsel dil: **mini kod editörü penceresi**. Görünürken satırlar yazılır (typewriter, ~2sn, tek sefer) — yazılan "kod", hizmeti anlatan gerçekçi satırlar (`<QrMenu lang="tr" allergens />` gibi).
- **Mikro:** Hizmet ikonları mevcut canlanmayı korur; kartlara spotlight border gelir.

### Sahne 4 · SÜREÇ — "İş akışı çalışıyor" (WORKFLOW)
- **Atmosfer:** Yeni görsel dil: adımlar bir **hat üzerinde** bağlanır; görünürken hat çizilir ve üzerinde küçük bir ışık noktası adımdan adıma **veri gibi akar** (tek tur, yavaş). Adım kartları sırayla "aktifleşir" (nokta geldiğinde border ışır).
- Kullanıcının istediği "workflow animasyonu" tam burası.

### Sahne 5 · SSS — "Nefes"
- **Atmosfer:** Bilinçli sakin bölüm — ritim için gerekli. Accordion açılışı yumuşak (height+opacity), ok dönüşü spring. Başka hiçbir şey oynamaz.

### Sahne 6 · KAPANIŞ CTA — "Son akor"
- **Atmosfer:** Koyu/accent kapanış bandı. Arka planda ÇOK yavaş (20sn+) bir **aurora gradyan sürüklenmesi** — fark edilir ama bağırmaz.
- **Mikro:** Ana butonda fizik hissi: basınca yaylı çökme + bırakınca geri tepme; hover'da glow nefesi.

## 3. Görsel Çeşitlilik Envanteri

| Bölüm | Materyal / dil | Tekrar kontrolü |
|---|---|---|
| Hero | Canlı dashboard (laptop İÇİ) | Laptop YALNIZCA burada |
| Fiyatlandırma | Tipografi + sayı + ışık | Mockup yok |
| Çalışmalar | Koyu vitrin + ürün demoları / gerçek ekranlar | Tek koyu galeri |
| Hizmetler | Kod editörü + ikon kartları | Editör YALNIZCA burada |
| Süreç | Workflow hattı + akış noktası | Hat YALNIZCA burada |
| SSS | Sade tipografi | Bilinçli boşluk |
| CTA | Aurora gradyan | Tek kapanış efekti |

**Lottie / video / render konusunda öneri:** Şimdilik EKLEMEYELİM. Kod-çizim SVG + framer: (a) bundle küçük kalır, (b) marka token'larına birebir uyar, (c) bakım tek yerden. İstisna — Çalışmalar bölümüne ileride gerçek ürünlerin **hafif ekran kaydı loop'ları** (sessiz mp4/webm, birkaç yüz KB) eklenebilir; gerçek işler geldiğinde en güçlü "premium" kanıtı bu olur.

## 4. Global Mikro-Etkileşim Dili (site geneli sözlük)

| Etkileşim | Davranış |
|---|---|
| Buton (tap) | Yaylı çökme `scale 0.97` → geri tepme (spring 500/30); shine süpürmesi yalnız hover'da, tek yön |
| Kart (hover) | Spotlight border (imleci izleyen kenar ışığı) + gölge yumuşak derinleşir; **scale/lift minimum** (≤2px) |
| İkon (hover) | Tek seferlik mikro jest (≤400ms): çizgi çizilmesi, hafif dönme — bounce yok |
| Link | Alt çizgi soldan sağa çizilir |
| Tooltip | 150ms fade+2px yükselme; koyu zeminde beyaz, aydınlıkta ters |
| Başlık girişi | Eyebrow çizgisi çizilir → başlık kelime kelime değil BLOK halinde yumuşak girer (kelime kelime = gösteriş) |

## 5. Teknik Kararlar

- **Kütüphane:** framer-motion yeterli (scrub+spring desenimiz kanıtlandı). GSAP eklenmez. **Lenis (smooth scroll): önermiyorum** — native his + erişilebilirlik daha "Apple"; istenirse Faz 3'te tartışılır.
- **Kanıtlanmış desenler (önceki turdan ders):** scroll-style ile variants AYNI öğede birleşmez; scrub değerleri `useSpring`'ten geçer (native ViewTimeline hatasını da çözüyor); sticky sahne düzeni JS state değil CSS breakpoint.
- **Performans bütçesi:** yeni bağımlılık 0 KB; hero dışında sticky sahne yok (hafif kalır); tüm interval'ler `useInView` kapılı.

## 6. Uygulama Fazları (her faz sonunda birlikte bakarız)

- **Faz 1 — Sakinleştir + Dil Birliği:** Hero'da obje hareketini kes (tilt/sallanma/dönme), perspektifi inceltt; spotlight border + buton fiziği + tooltip standardını site geneline yay. *(En hızlı algı sıçraması burada.)*
- **Faz 2 — Atmosferler:** Koyu Çalışmalar bölümü; kod editörü (Hizmetler); workflow hattı (Süreç).
- **Faz 3 — Koreografi + Kapanış:** Fiyat count-up, başlık giriş dili, SSS incelikleri, aurora CTA; bölüm erimelerinin son ayarı.

---

## Açık kararlar (sahibin onayı bekleniyor)

1. Çalışmalar bölümünün **koyu zemine** geçmesi — onay?
2. Lottie/video şimdilik yok, kod-çizim + ileride gerçek ekran kayıtları — onay?
3. Faz sırası yukarıdaki gibi mi, yoksa önce atmosferler (Faz 2) mi?
