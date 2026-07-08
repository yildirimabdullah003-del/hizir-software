import type { Role, SubmissionStatus } from "@prisma/client";

/**
 * Geliştirici önizleme modu — SADECE `npm run dev`'de ve `ADMIN_PREVIEW=1`
 * env'iyle açılır. Amaç: veritabanı (Neon) kurmadan ve giriş yapmadan
 * admin panelini uçtan uca gezebilmek. Üretimde ASLA aktif olmaz
 * (NODE_ENV kontrolü) — güvenlik için çift kilit.
 *
 * Açıkken: oturum kontrolü demo bir OWNER döndürür, veri fonksiyonları
 * Prisma'ya hiç gitmeden aşağıdaki sahte veriyi verir. Yazma işlemleri
 * (kaydet/sil) devre dışıdır; panel salt-görsel bir demo gibi davranır.
 */
export function isPreviewMode(): boolean {
  return (
    process.env.NODE_ENV !== "production" && process.env.ADMIN_PREVIEW === "1"
  );
}

// Sabit tarih tabanı — demo verinin her yenilemede aynı görünmesi için.
const BASE = new Date("2026-07-07T09:30:00");
function daysAgo(n: number): Date {
  return new Date(BASE.getTime() - n * 24 * 60 * 60 * 1000);
}

export const PREVIEW_SESSION = {
  userId: "demo-owner",
  role: "OWNER" as Role,
  name: "Demo Yönetici",
};

type DemoSubmission = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  status: SubmissionStatus;
  emailDelivered: boolean;
  ipAddress: string | null;
  createdAt: Date;
  handledById: string | null;
  handledBy: { name: string } | null;
};

export const PREVIEW_SUBMISSIONS: DemoSubmission[] = [
  {
    id: "s1",
    name: "Mehmet Yılmaz",
    email: "mehmet@lezzetduragi.com",
    company: "Lezzet Durağı",
    message:
      "Merhaba, iki şubemiz için QR menü ve web sitesi paketini konuşmak istiyoruz. Rezervasyon özelliği de olsun. Müsait olduğunuzda arayabilir misiniz?",
    status: "NEW",
    emailDelivered: true,
    ipAddress: "85.104.22.10",
    createdAt: new Date(BASE.getTime() - 2 * 60 * 60 * 1000),
    handledById: null,
    handledBy: null,
  },
  {
    id: "s2",
    name: "Ayşe Demir",
    email: "ayse@fincankahve.com",
    company: "Fincan Kahve",
    message:
      "Sadece QR menü yeterli olur. Aylık fiyat ve kurulum süresi hakkında bilgi alabilir miyim?",
    status: "IN_PROGRESS",
    emailDelivered: true,
    ipAddress: "88.230.14.55",
    createdAt: daysAgo(1),
    handledById: "demo-owner",
    handledBy: { name: "Demo Yönetici" },
  },
  {
    id: "s3",
    name: "Can Kaya",
    email: "can@saraypide.com",
    company: "Saray Pide",
    message:
      "Kapsamlı işletme paketi ilgimi çekti. Mutfak ekranı ve kurye paneli demo görebilir miyiz?",
    status: "RESOLVED",
    emailDelivered: true,
    ipAddress: "78.180.9.201",
    createdAt: daysAgo(4),
    handledById: "demo-owner",
    handledBy: { name: "Demo Yönetici" },
  },
  {
    id: "s4",
    name: "SEO Ajans",
    email: "no-reply@spam-example.com",
    company: null,
    message: "Sitenizi 1. sıraya çıkarıyoruz, backlink paketi...",
    status: "SPAM",
    emailDelivered: false,
    ipAddress: "45.12.0.3",
    createdAt: daysAgo(6),
    handledById: "demo-owner",
    handledBy: { name: "Demo Yönetici" },
  },
];

// Yönetilen sayfalar — 6 hizmet detayı. listPages metadata + çeviri özeti;
// getPage tam içeriği messages dosyalarından okur (bkz. data.ts preview dalı).
const SERVICE_SLUGS = [
  "kurumsal-web-siteleri",
  "dijital-urun-gelistirme",
  "e-ticaret-cozumleri",
  "marka-tasarim-sistemi",
  "bakim-performans-seo",
  "danismanlik-teknik-strateji",
];

export const PREVIEW_PAGES = SERVICE_SLUGS.map((slug, i) => ({
  id: `page-${slug}`,
  type: "service-detail",
  slug,
  isPublished: true,
  createdAt: daysAgo(30),
  updatedAt: daysAgo(i),
  translations: [
    { locale: "tr" as const, updatedAt: daysAgo(i) },
    { locale: "en" as const, updatedAt: daysAgo(i + 1) },
  ],
}));

// Küçük, her zaman yüklenen (data-URI) demo görseller — dış bağlantı yok.
function swatch(bg: string, label: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180'><rect width='320' height='180' fill='${bg}'/><text x='50%' y='50%' fill='white' font-family='sans-serif' font-size='20' text-anchor='middle' dominant-baseline='middle'>${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PREVIEW_MEDIA = [
  {
    id: "m1",
    url: swatch("#8a3f24", "hero-restoran"),
    filename: "hero-restoran.jpg",
    mimeType: "image/jpeg",
    sizeBytes: 248_000,
    altText: "Restoran iç mekan görseli",
    uploadedById: "demo-owner",
    createdAt: daysAgo(3),
    uploadedBy: { name: "Demo Yönetici" },
  },
  {
    id: "m2",
    url: swatch("#2d4a3e", "menu-kapak"),
    filename: "menu-kapak.png",
    mimeType: "image/png",
    sizeBytes: 92_400,
    altText: "QR menü kapak görseli",
    uploadedById: "demo-owner",
    createdAt: daysAgo(5),
    uploadedBy: { name: "Demo Yönetici" },
  },
  {
    id: "m3",
    url: "#",
    filename: "kurumsal-brosur.pdf",
    mimeType: "application/pdf",
    sizeBytes: 1_240_000,
    altText: null,
    uploadedById: "demo-owner",
    createdAt: daysAgo(8),
    uploadedBy: { name: "Demo Yönetici" },
  },
];

export const PREVIEW_USERS = [
  {
    id: "demo-owner",
    email: "yonetici@hizirsoftware.com",
    name: "Demo Yönetici",
    role: "OWNER" as Role,
    isActive: true,
    createdAt: daysAgo(40),
  },
  {
    id: "demo-editor",
    email: "editor@hizirsoftware.com",
    name: "İçerik Editörü",
    role: "EDITOR" as Role,
    isActive: true,
    createdAt: daysAgo(12),
  },
];

export const PREVIEW_SETTINGS: Record<string, { key: string; value: unknown; updatedAt: Date }> = {
  siteMeta: {
    key: "siteMeta",
    value: {
      url: "https://hizirsoftware.com",
      contactEmail: "iletisim@hizirsoftware.com",
    },
    updatedAt: daysAgo(2),
  },
  socialLinks: {
    key: "socialLinks",
    value: [
      { name: "LinkedIn", href: "https://linkedin.com/company/hizir", icon: "linkedin" },
    ],
    updatedAt: daysAgo(2),
  },
};

export const PREVIEW_STATS = {
  newSubmissions: PREVIEW_SUBMISSIONS.filter((s) => s.status === "NEW").length,
  totalSubmissions: PREVIEW_SUBMISSIONS.length,
  pages: PREVIEW_PAGES.length,
  media: PREVIEW_MEDIA.length,
};

/** Yazma işlemleri önizlemede engellenir; formlar bu mesajı gösterir. */
export const PREVIEW_WRITE_MESSAGE =
  "Önizleme modunda değişiklikler kaydedilmez. Gerçek veritabanı bağlanınca aktif olur.";
