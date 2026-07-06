import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Gelen istekleri doğru dil önekine yönlendirir.
export default createMiddleware(routing);

export const config = {
  // API, statik dosyalar, Next iç yolları ve uzantısız metadata route'ları
  // (icon/apple-icon — next/og ile üretilir, dosya uzantısı URL'de görünmez)
  // hariç her şeyi kapsa.
  matcher: ["/((?!api|_next|_vercel|icon|apple-icon|.*\\..*).*)"],
};
