import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #b34d1f 0%, #d9622b 55%, #b34d1f 100%)",
          position: "relative",
        }}
      >
        {/* Decorative ring, kept outside the mobile-crop safe zone */}
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -140,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -160,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            display: "flex",
          }}
        />

        {/* Safe-zone content: centered within ~150-1050px */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 900,
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 108,
              height: 108,
              borderRadius: 28,
              background: "rgba(255,255,255,0.16)",
              border: "3px solid rgba(255,255,255,0.55)",
              marginBottom: 36,
              fontSize: 56,
            }}
          >
            📍
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: -1,
            }}
          >
            myMadhepura
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 40,
              fontWeight: 600,
              color: "#fdf1e7",
              lineHeight: 1.3,
            }}
          >
            Madhepura&apos;s No.1 Local Business Directory
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: 28,
              fontWeight: 600,
              color: "#ffffff",
              background: "rgba(0,0,0,0.22)",
              padding: "12px 32px",
              borderRadius: 999,
            }}
          >
            226+ trusted businesses in Bihar
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
