import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt =
  "Abishek — Full Stack Developer & AI Automation Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #050505 0%, #1a0a2e 50%, #050505 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            fontWeight: 800,
            color: "white",
            marginBottom: 16,
          }}
        >
          A
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            background: "linear-gradient(90deg, #c4b5fd, #e879f9)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Abishek
        </div>
        <div
          style={{
            fontSize: 20,
            color: "rgba(255, 255, 255, 0.5)",
            marginTop: 8,
          }}
        >
          Full Stack Developer & AI Automation Engineer
        </div>
      </div>
    ),
    { ...size }
  );
}
