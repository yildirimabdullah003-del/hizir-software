"use server";

import { redirect } from "next/navigation";
import { findUserByEmail } from "@/features/admin/users/data";
import { verifyPassword } from "@/features/admin/auth/password";
import { getSession } from "@/features/admin/auth/session";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");

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
