import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Gelen istekleri doğru dil önekine yönlendirir.
export default createMiddleware(routing);

export const config = {
  // API, statik dosyalar, Next iç yolları, uzantısız metadata route'ları
  // (icon/apple-icon — next/og ile üretilir, dosya uzantısı URL'de görünmez)
  // ve /admin (dil öneki OLMAYAN ayrı uygulama yüzeyi, bkz. admin/layout.tsx)
  // hariç her şeyi kapsa.
  matcher: ["/((?!api|admin|_next|_vercel|icon|apple-icon|.*\\..*).*)"],
};
