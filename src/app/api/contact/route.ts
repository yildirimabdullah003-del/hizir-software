import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSiteContact } from "@/lib/site-contact";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- Basit istek sınırlama (spam koruması, katman 2) -----------------------
// Serverless ortamda instance başına çalışır; mükemmel değil ama honeypot
// ile birlikte ucuz botların büyük kısmını eler. Kalıcı/dağıtık limit
// gerektiğinde Upstash benzeri bir çözümle değiştirilebilir.
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 dakika
const RATE_MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX_REQUESTS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
  /** Honeypot — gerçek kullanıcı bu alanı görmez; doluysa istek bottur. */
  website?: string;
};

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "rate-limited" }, { status: 429 });
  }

  let payload: Partial<ContactPayload>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }

  // Honeypot dolduysa bot: başarı taklidi yap ki bot yöntem değiştirmesin,
  // ama hiçbir şey iletme/loglama.
  if (payload.website?.trim()) {
    return NextResponse.json({ ok: true, delivered: false });
  }

  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const company = payload.company?.trim() ?? "";
  const message = payload.message?.trim() ?? "";

  if (!name || !email || !message || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "invalid-payload" }, { status: 400 });
  }

  // DB-öncelikli kayıt: e-posta iletimi başarısız olsa bile lead kaybolmaz
  // (admin paneldeki Mesajlar kutusuna düşer). DB yazımı başarısızsa eski
  // davranışa geri düşülür — e-posta iletimi DB sağlığına bağlanmaz.
  let submissionId: string | null = null;
  try {
    const submission = await prisma.contactSubmission.create({
      data: { name, email, company: company || null, message, ipAddress: ip },
      select: { id: true },
    });
    submissionId = submission.id;
  } catch (err) {
    console.error(
      "[contact] Mesaj veritabanına KAYDEDİLEMEDİ (e-posta yine de denenecek):",
      err
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  // RESEND_API_KEY tanımlı değilse e-posta gönderilmez; talep sunucu loguna
  // düşer ki form akışı geliştirme ortamında da uçtan uca test edilebilsin.
  // ÜRETİMDE bu durum bir yapılandırma hatasıdır ve lead kaybı demektir —
  // o yüzden orada error seviyesinde bağırır.
  if (!resendApiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[contact] KRİTİK: Üretim ortamında RESEND_API_KEY tanımlı değil — " +
          "form mesajları e-posta olarak İLETİLMİYOR" +
          (submissionId
            ? "; mesaj veritabanına kaydedildi (admin panel > Mesajlar)."
            : ", yalnızca loglanıyor:"),
        submissionId ? { submissionId } : { name, email, company, message }
      );
    } else {
      console.warn(
        "[contact] RESEND_API_KEY tanımlı değil" +
          (submissionId
            ? "; mesaj yalnızca veritabanına kaydedildi."
            : ", mesaj yalnızca loglanıyor:"),
        submissionId ? { submissionId } : { name, email, company, message }
      );
    }
    return NextResponse.json({ ok: true, delivered: false });
  }

  // İletim adresleri panelden yönetilir (Admin > Ayarlar). Kime gönderileceği
  // ve gönderen domaini DB'den okunur; kayıt yoksa siteConfig'e düşülür.
  const contact = await getSiteContact();

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `HIZIR Software <noreply@${new URL(contact.url).hostname}>`,
      to: contact.contactEmail,
      reply_to: email,
      subject: `Yeni proje talebi — ${name}`,
      text: [
        `Ad Soyad: ${name}`,
        `E-posta: ${email}`,
        company ? `Şirket: ${company}` : null,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    }),
  });

  if (!response.ok) {
    console.error("[contact] Resend isteği başarısız oldu:", await response.text());
    // Mesaj DB'ye kaydedildiyse lead güvende — kullanıcıya hata gösterip
    // formu tekrar doldurtmak yerine başarı dönülür.
    if (submissionId) {
      return NextResponse.json({ ok: true, delivered: false });
    }
    return NextResponse.json({ error: "delivery-failed" }, { status: 502 });
  }

  // İletim işareti best-effort: güncelleme başarısız olsa da mesaj zaten
  // kalıcı olarak kayıtlı.
  if (submissionId) {
    try {
      await prisma.contactSubmission.update({
        where: { id: submissionId },
        data: { emailDelivered: true },
      });
    } catch (err) {
      console.error("[contact] emailDelivered güncellenemedi:", err);
    }
  }

  return NextResponse.json({ ok: true, delivered: true });
}
