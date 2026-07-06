import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind sınıflarını çakışmasız birleştirir.
 * Örn: cn("px-2", condition && "px-4") -> çakışan px kuralları doğru çözülür.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Türkçe-güvenli küçük harf dönüşümü (ADR 0004).
 * JavaScript'in varsayılan toLowerCase()'i Türkçe 'İ/ı' harflerini bozar.
 */
export function toLowerTr(value: string) {
  return value.toLocaleLowerCase("tr-TR");
}

/**
 * Türkçe-güvenli büyük harf dönüşümü (ADR 0004).
 */
export function toUpperTr(value: string) {
  return value.toLocaleUpperCase("tr-TR");
}
