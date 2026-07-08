import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/features/admin/auth/password";
import { isPreviewMode, PREVIEW_USERS } from "@/features/admin/preview";

export async function listUsers() {
  if (isPreviewMode()) return PREVIEW_USERS;
  return prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(params: {
  email: string;
  name: string;
  password: string;
  role: Role;
}) {
  const passwordHash = await hashPassword(params.password);
  return prisma.user.create({
    data: {
      email: params.email.toLowerCase().trim(),
      name: params.name.trim(),
      passwordHash,
      role: params.role,
    },
  });
}

export function setUserActive(id: string, isActive: boolean) {
  return prisma.user.update({ where: { id }, data: { isActive } });
}
