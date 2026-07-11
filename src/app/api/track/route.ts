import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Gizlilik dostu, kendi barındırdığımız analitik toplama ucu.
 * KİŞİSEL VERİ SAKLANMAZ: IP yalnızca anlık rate-limit için okunur, DB'ye
 * yazılmaz. visitorId istemcinin ürettiği anonim rastgele bir kimliktir.
 * Panelde ziyaret/etkileşim grafikleri için kullanılır.
 */

const ALLOWED_TYPES = new Set(["pageview", "whatsapp_click"]);

// Kaba spam koruması: instance başına IP başına dakikada makul sınır.
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 60;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return new NextResponse(null, { status: 429 });
  }

  let body: {
    type?: string;
    path?: string;
    visitorId?: string;
    label?: string;
  };
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const type = String(body.type ?? "");
  const path = String(body.path ?? "").slice(0, 300);
  const visitorId = String(body.visitorId ?? "").slice(0, 64);
  const label = body.label ? String(body.label).slice(0, 60) : null;

  if (!ALLOWED_TYPES.has(type) || !path || !visitorId) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    await prisma.analyticsEvent.create({
      data: { type, path, visitorId, label },
    });
  } catch (err) {
    // Analitik yazımı başarısız olsa da kullanıcı deneyimi etkilenmemeli.
    console.error("[track] analitik kaydı başarısız:", err);
  }

  return new NextResponse(null, { status: 204 });
}
