import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// bkz. icon.tsx — Satori CSS custom property okuyamadığı için hardcode.
const ACCENT = "#2b59ff";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: ACCENT,
          color: "#ffffff",
          fontSize: 110,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        H
      </div>
    ),
    { ...size }
  );
}
