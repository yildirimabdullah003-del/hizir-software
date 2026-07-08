# ADR 0007 — Platform Veritabanı Tasarımı (Website Builder + Restoran)

**Durum:** 🟡 ÖNERİ — onay bekliyor, kod yazılmadı
**Tarih:** 7 Temmuz 2026

## Bağlam

HIZIR'ın gelecekteki ürünü: müşterilerin (özellikle restoranların) kendi web
sitelerini kurup işlettiği çok kiracılı (multi-tenant) bir SaaS platformu —
Website Builder + restoran yönetimi (menü, rezervasyon, sipariş). Bu ADR,
o ürünün veri modelini **uygulamadan önce** tasarlar; Faz A (site) ve Faz B
(admin panel) tamamlandı, bu şema onaylanana kadar tek satır kod yazılmaz.

## Temel karar: ADR 0006 şemasından TAM AYRIŞMA

- ADR 0006'daki admin şeması HIZIR'ın **kendi tek sitesini** yönetir; bu şema
  ise HIZIR'ın **müşterilerini** modelleyen ayrı bir üründür.
- İki şema arasında **foreign key YOKTUR**. Meşru tek bağlantı iş sürecidir:
  bir `ContactSubmission` (satış görüşmesi sonrası) uygulama seviyesinde bir
  `Organization` kaydına dönüşür — DB ilişkisi değil.
- Başlangıçta aynı Neon Postgres instance'ında ama **ayrı logical schema /
  ayrı Prisma şema dosyası** olarak yaşar. İlk ödeme yapan müşteriyle
  birlikte ayrı veritabanına (hatta ayrı projeye) taşınabilir — iç içe geçmiş
  FK'ler olmadığı için bu taşıma temiz kalır.

## Çok kiracılı çekirdek

```prisma
model Organization {          // kiracı: HIZIR platformunun bir müşterisi
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique          // <slug>.hizirsites.com alt alan adı
  plan      String                    // "starter" | "pro" — planlar netleşince enum
  createdAt DateTime @default(now())
  sites     Site[]
  users     OrgUser[]
  locations Location[]
}

model OrgUser {               // kiracının personeli — ADR 0006 User'ından AYRI
  id             String @id @default(cuid())
  organizationId String
  email          String
  passwordHash   String
  role           String               // "owner" | "manager" | "staff" (org-scoped)
  organization   Organization @relation(fields: [organizationId], references: [id])
  @@unique([organizationId, email])
}

model Site {                  // bir org'a ait "kurulmuş" web sitesi
  id             String  @id @default(cuid())
  organizationId String
  name           String
  customDomain   String? @unique
  subdomain      String  @unique
  status         String              // "draft" | "published"
  organization   Organization @relation(fields: [organizationId], references: [id])
  pages          SitePage[]
}

model SitePage {
  id          String  @id @default(cuid())
  siteId      String
  path        String                  // "/", "/menu", "/hakkimizda"
  isPublished Boolean @default(false)
  site        Site @relation(fields: [siteId], references: [id])
  blocks      SiteBlock[]
  @@unique([siteId, path])
}

model SiteBlock {             // builder'ın yapı taşı: sıralı içerik blokları
  id      String @id @default(cuid())
  pageId  String
  type    String                      // "hero" | "text" | "gallery" | "menu-embed" ...
  order   Int
  content Json                        // blok tipine özgü yapısal içerik
  page    SitePage @relation(fields: [pageId], references: [id])
}
```

`SiteBlock`/`SitePage`, ADR 0006'daki `Page`/`PageTranslation` ile tablo
değil **kalıp** paylaşır (tip + yapısal JSON). İleride ortak bir "Design
Library" doğarsa paylaşılacak şey kod (blok renderer kaydı,
`src/features/blocks/`) olur — veri değil.

## Restoran katmanı

```prisma
model Location {              // fiziksel şube
  id             String @id @default(cuid())
  organizationId String
  name           String
  address        String
  timezone       String
  organization   Organization @relation(fields: [organizationId], references: [id])
  categories     MenuCategory[]
  tables         DiningTable[]
  reservations   Reservation[]
  orders         Order[]
  staff          StaffMember[]
}

model MenuCategory {
  id         String @id @default(cuid())
  locationId String
  name       String
  order      Int
  location   Location @relation(fields: [locationId], references: [id])
  items      MenuItem[]
}

model MenuItem {
  id             String  @id @default(cuid())
  categoryId     String
  name           String
  description    String?
  basePrice      Decimal
  isAvailable    Boolean @default(true)
  category       MenuCategory @relation(fields: [categoryId], references: [id])
  modifierGroups MenuItemModifierGroup[]
}

model MenuItemModifierGroup { // "Boyut", "Ekstralar" gibi seçim grupları
  id         String @id @default(cuid())
  menuItemId String
  name       String
  minSelect  Int @default(0)
  maxSelect  Int @default(1)
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id])
  options    ModifierOption[]
}

model ModifierOption {
  id         String  @id @default(cuid())
  groupId    String
  name       String
  priceDelta Decimal @default(0)
  group      MenuItemModifierGroup @relation(fields: [groupId], references: [id])
}

model DiningTable {
  id           String @id @default(cuid())
  locationId   String
  label        String                 // "Masa 4", "Teras 2"
  capacity     Int
  location     Location @relation(fields: [locationId], references: [id])
  reservations Reservation[]
}

model Reservation {
  id            String   @id @default(cuid())
  locationId    String
  tableId       String?
  customerName  String
  customerPhone String
  partySize     Int
  startsAt      DateTime
  status        String               // "confirmed" | "seated" | "cancelled" | "no-show"
  location      Location @relation(fields: [locationId], references: [id])
  table         DiningTable? @relation(fields: [tableId], references: [id])
}

model Order {
  id          String  @id @default(cuid())
  locationId  String
  tableId     String?
  status      String                 // "open" | "in-kitchen" | "served" | "paid" | "cancelled"
  totalAmount Decimal
  createdAt   DateTime @default(now())
  location    Location @relation(fields: [locationId], references: [id])
  items       OrderItem[]
}

model OrderItem {
  id                String  @id @default(cuid())
  orderId           String
  menuItemId        String
  quantity          Int
  unitPrice         Decimal            // SİPARİŞ ANI fiyat snapshot'ı — menü sonradan değişebilir
  selectedModifiers Json               // seçilen opsiyonların snapshot'ı (id/ad/fiyat farkı)
  order             Order @relation(fields: [orderId], references: [id])
}

model StaffMember {           // şube-scoped görev (garson/mutfak/müdür)
  id         String @id @default(cuid())
  locationId String
  orgUserId  String
  jobRole    String                   // "waiter" | "kitchen" | "manager"
  location   Location @relation(fields: [locationId], references: [id])
}
```

## Kritik tasarım notları

1. **Snapshot ilkesi:** `OrderItem.unitPrice` ve `selectedModifiers`, sipariş
   anındaki değerleri kopyalar. Menü fiyatı değişince eski siparişlerin
   tutarı değişmemeli — muhasebe bütünlüğünün temeli.
2. **Kiracı izolasyonu sorgu seviyesinde:** her sorgu `organizationId` (veya
   zincirli üst ilişki) filtresiyle yazılır; ileride Postgres RLS
   (row-level security) eklenebilir.
3. **String status alanları bilinçli:** akışlar (sipariş durumları vb.) ilk
   gerçek müşteriyle netleşene kadar enum'a dönüştürülmez (Rule of Three).
4. **Çok dillilik:** `SiteBlock.content` JSON'u gerektiğinde locale-keyed
   yapı taşıyabilir; ayrı çeviri tablosu ilk ihtiyaçta eklenir.

## Ne zaman uygulanır?

- Bu ADR onaylandığında **ve** ilk gerçek müşteri/pilot restoran
  netleştiğinde. Uygulama sırası: `Organization`+`OrgUser`+`Site*` çekirdeği
  → menü katmanı → rezervasyon → sipariş.

## Ne zaman gözden geçirilir?

- İlk pilot müşteriyle şema gerçek veriyle test edildiğinde.
- Online ödeme entegrasyonu gündeme geldiğinde (Order'a payment alanları).
- Kurye/paket servis isteği geldiğinde (teslimat modeli eklenir).
