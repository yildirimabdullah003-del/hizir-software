import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

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

  const resendApiKey = process.env.RESEND_API_KEY;

  // RESEND_API_KEY tanımlı değilse e-posta gönderilmez; talep sunucu loguna
  // düşer ki form akışı geliştirme ortamında da uçtan uca test edilebilsin.
  // ÜRETİMDE bu durum bir yapılandırma hatasıdır ve lead kaybı demektir —
  // o yüzden orada error seviyesinde bağırır.
  if (!resendApiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[contact] KRİTİK: Üretim ortamında RESEND_API_KEY tanımlı değil — " +
          "form mesajları e-posta olarak İLETİLMİYOR, yalnızca loglanıyor:",
        { name, email, company, message }
      );
    } else {
      console.warn(
        "[contact] RESEND_API_KEY tanımlı değil, mesaj yalnızca loglanıyor:",
        { name, email, company, message }
      );
    }
    return NextResponse.json({ ok: true, delivered: false });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `HIZIR Software <noreply@${new URL(siteConfig.url).hostname}>`,
      to: siteConfig.contactEmail,
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
    return NextResponse.json({ error: "delivery-failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
