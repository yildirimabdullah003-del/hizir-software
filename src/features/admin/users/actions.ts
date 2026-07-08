"use server";

import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/features/admin/auth/session";
import { createUser, setUserActive } from "@/features/admin/users/data";
import { isPreviewMode, PREVIEW_WRITE_MESSAGE } from "@/features/admin/preview";

export type CreateUserState = { error?: string; success?: boolean };

const createUserSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  password: z.string().min(10, "Parola en az 10 karakter olmalı"),
  role: z.enum(["ADMIN", "EDITOR"]),
});

/**
 * Yeni personel hesabı. Yalnızca OWNER/ADMIN erişebilir; panelden OWNER
 * oluşturulamaz (tek OWNER, seed ile açılır — yetki devri bilinçli olarak
 * panel dışında tutuldu).
 */
export async function addUser(
  _prev: CreateUserState,
  formData: FormData
): Promise<CreateUserState> {
  await requireRole("ADMIN");
  if (isPreviewMode()) return { error: PREVIEW_WRITE_MESSAGE };

  const parsed = createUserSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    name: String(formData.get("name") ?? ""),
    password: String(formData.get("password") ?? ""),
    role: String(formData.get("role") ?? ""),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await createUser(parsed.data as typeof parsed.data & { role: Role });
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.includes("Unique constraint")
    ) {
      return { error: "Bu e-posta adresiyle bir hesap zaten var." };
    }
    throw err;
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function toggleUserActive(formData: FormData) {
  const auth = await requireRole("ADMIN");
  if (isPreviewMode()) return;
  const id = String(formData.get("id") ?? "");
  const isActive = formData.get("isActive") === "true";
  // Kendi hesabını pasifleştirmek kilitlenmeye yol açar; engelle.
  if (!id || id === auth.userId) return;

  await setUserActive(id, isActive);
  revalidatePath("/admin/users");
}
