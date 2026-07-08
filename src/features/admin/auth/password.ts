import bcrypt from "bcryptjs";

/**
 * Parola hash'leme yardımcıları. bcryptjs (saf JS) tercih edildi:
 * Windows/Linux fark etmeden derleme gerektirmez, Vercel serverless'ta
 * sorunsuz çalışır. Maliyet faktörü 12, iç araç için yeterli denge.
 */
const COST_FACTOR = 12;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, COST_FACTOR);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
