import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Dil-farkında (locale-aware) navigasyon araçları.
 * Bileşenlerde next/link yerine buradaki Link kullanılır; böylece
 * bağlantılar otomatik olarak doğru dil önekini alır.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
