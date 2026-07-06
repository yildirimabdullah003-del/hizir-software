import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Satori (ImageResponse'un render motoru) CSS custom property okuyamaz,
// bu yüzden accent tonu burada tek seferlik hardcode edilir.
// globals.css'teki --color-accent değişirse burası da elle güncellenmeli.
const ACCENT = "#2b59ff";

export default function Icon() {
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
          borderRadius: 7,
          color: "#ffffff",
          fontSize: 20,
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
