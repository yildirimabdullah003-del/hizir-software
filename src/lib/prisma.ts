import { PrismaClient } from "@prisma/client";

/**
 * PrismaClient singleton — Next.js dev sunucusunda hot-reload her modül
 * yeniden yüklemesinde yeni bağlantı havuzu açmasın diye globalde saklanır.
 * Üretimde (Vercel) her serverless instance kendi istemcisini oluşturur;
 * Neon'un pooled connection string'i ile kullanılmalıdır.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
