import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt =
  "Abishek — Full Stack Developer & AI Automation Engineer Portfolio";
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
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(139, 92, 246, 0.15)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(217, 70, 239, 0.15)",
            filter: "blur(80px)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              fontWeight: 800,
              color: "white",
              marginBottom: 8,
            }}
          >
            A
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              background: "linear-gradient(90deg, #c4b5fd, #e879f9, #c4b5fd)",
              backgroundClip: "text",
              color: "transparent",
              letterSpacing: -2,
            }}
          >
            Abishek
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.6)",
              letterSpacing: 1,
            }}
          >
            Full Stack Developer & AI Automation Engineer
          </div>

          {/* Tags */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 24,
            }}
          >
            {["Next.js", "React", "TypeScript", "AI/ML", "Python"].map(
              (tech) => (
                <div
                  key={tech}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 999,
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    background: "rgba(139, 92, 246, 0.1)",
                    color: "rgba(196, 181, 253, 0.9)",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {tech}
                </div>
              )
            )}
          </div>

          {/* URL */}
          <div
            style={{
              marginTop: 24,
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.3)",
              letterSpacing: 2,
            }}
          >
            abishek.dev
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
