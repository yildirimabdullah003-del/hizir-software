import { getIronSession, type IronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { isPreviewMode, PREVIEW_SESSION } from "@/features/admin/preview";

/**
 * iron-session tabanlı oturum yönetimi. Oturum, şifrelenmiş httpOnly bir
 * cookie'de yaşar (sunucu dışında okunamaz/değiştirilemez); ayrı bir
 * session tablosu veya JWT altyapısı gerekmez. Bkz. plan: NextAuth bilinçli
 * olarak KULLANILMADI — bu, sabit birkaç personel hesabı olan iç araçtır.
 */

export type SessionData = {
  userId?: string;
  role?: Role;
  name?: string;
};

// Rol hiyerarşisi: sayı büyüdükçe yetki artar. requireRole "en az bu rol"
// anlamına gelir (EDITOR isteyen sayfaya ADMIN ve OWNER da girebilir).
const ROLE_LEVEL: Record<Role, number> = {
  EDITOR: 1,
  ADMIN: 2,
  OWNER: 3,
};

function getSessionOptions(): SessionOptions {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error(
      "SESSION_SECRET tanımlı değil veya 32 karakterden kısa. " +
        ".env.local dosyasına en az 32 karakterlik rastgele bir değer ekleyin."
    );
  }
  return {
    password,
    cookieName: "hizir_admin_session",
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      // 8 saat: iş günü boyunca açık kalır, gece düşer.
      maxAge: 60 * 60 * 8,
    },
  };
}

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, getSessionOptions());
}

/**
 * Oturum yoksa /admin/login'e yönlendirir; varsa oturum verisini döndürür.
 * Dashboard layout'unda ve server action'larda kullanılır.
 */
export async function requireSession(): Promise<{
  userId: string;
  role: Role;
  name: string;
}> {
  // Önizleme modu: giriş sorulmadan demo OWNER olarak devam edilir.
  if (isPreviewMode()) return PREVIEW_SESSION;

  const session = await getSession();
  if (!session.userId || !session.role) {
    redirect("/admin/login");
  }
  return {
    userId: session.userId,
    role: session.role,
    name: session.name ?? "",
  };
}

/**
 * Belirtilen role (veya üstüne) sahip değilse dashboard ana sayfasına
 * yönlendirir. Örn. kullanıcı yönetimi sayfası: requireRole("ADMIN").
 */
export async function requireRole(minimum: Role) {
  const auth = await requireSession();
  if (ROLE_LEVEL[auth.role] < ROLE_LEVEL[minimum]) {
    redirect("/admin");
  }
  return auth;
}
