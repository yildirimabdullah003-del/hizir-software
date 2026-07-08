"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { findUserByEmail } from "@/features/admin/users/data";
import { verifyPassword } from "@/features/admin/auth/password";
import { getSession } from "@/features/admin/auth/session";

export type LoginState = { error?: string };

// --- Basit brute-force koruması (IP başına başarısız deneme sınırı) --------
// Serverless instance başına çalışır; mükemmel değil ama küçük bir iç araç
// için parola deneme saldırılarını ciddi biçimde yavaşlatır. Dağıtık/kalıcı
// bir limit gerekirse (birden çok instance), Upstash Ratelimit gibi bir
// çözümle değiştirilebilir.
const LOCK_WINDOW_MS = 15 * 60 * 1000; // 15 dakika
const MAX_ATTEMPTS = 8;
const failedAttempts = new Map<string, number[]>();

function tooManyAttempts(ip: string): boolean {
  const now = Date.now();
  const recent = (failedAttempts.get(ip) ?? []).filter(
    (t) => now - t < LOCK_WINDOW_MS
  );
  failedAttempts.set(ip, recent);
  return recent.length >= MAX_ATTEMPTS;
}

function recordFailure(ip: string): void {
  const now = Date.now();
  const recent = (failedAttempts.get(ip) ?? []).filter(
    (t) => now - t < LOCK_WINDOW_MS
  );
  recent.push(now);
  failedAttempts.set(ip, recent);
}

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (tooManyAttempts(ip)) {
    return {
      error:
        "Çok fazla başarısız deneme. Güvenlik için bir süre bekleyip tekrar deneyin.",
    };
  }

  if (!email || !password) {
    return { error: "E-posta ve parola zorunludur." };
  }

  let user;
  try {
    user = await findUserByEmail(email);
  } catch {
    return {
      error:
        "Veritabanına ulaşılamadı. DATABASE_URL yapılandırmasını kontrol edin.",
    };
  }

  // Kullanıcı yoksa da parola doğrulaması kadar zaman harcanır ki e-posta
  // adreslerinin varlığı zamanlama farkından anlaşılamasın.
  const passwordOk = user
    ? await verifyPassword(password, user.passwordHash)
    : await verifyPassword(password, "$2a$12$invalidinvalidinvalidinvalidinvali");

  if (!user || !user.isActive || !passwordOk) {
    recordFailure(ip);
    return { error: "E-posta veya parola hatalı." };
  }

  const session = await getSession();
  session.userId = user.id;
  session.role = user.role;
  session.name = user.name;
  await session.save();

  redirect("/admin");
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}
