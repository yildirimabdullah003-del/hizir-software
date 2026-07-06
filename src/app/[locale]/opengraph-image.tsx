import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// bkz. src/app/icon.tsx — Satori CSS custom property okuyamadığı için hardcode.
const ACCENT = "#2b59ff";
const INK = "#0a0a0b";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: INK,
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: ACCENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            H
          </div>
          <div style={{ fontSize: 30, fontWeight: 600 }}>{t("name")}</div>
        </div>
        <div style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.2, maxWidth: 950 }}>
          {t("tagline")}
        </div>
      </div>
    ),
    { ...size }
  );
}
