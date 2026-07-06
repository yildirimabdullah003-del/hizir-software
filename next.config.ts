import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// i18n mesajlarının nereden yükleneceğini next-intl'e bildirir.
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Sadece kullanılan ikon/yardımcı modülleri paketle; import edilen
    // ama kullanılmayan kısımları bundle'dan ayıklar.
    optimizePackageImports: ["lucide-react"],
  },
};

export default withNextIntl(nextConfig);
