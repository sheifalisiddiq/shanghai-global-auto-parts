import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#161616",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 100 100" fill="none">
            <path
              d="M78 22 C 78 10, 55 6, 40 14 C 20 24, 20 40, 38 46 C 56 52, 80 54, 80 70 C 80 88, 55 92, 30 82"
              stroke="#EF0606"
              strokeWidth={14}
              strokeLinecap="round"
            />
          </svg>
          <span style={{ fontSize: 30, fontWeight: 900, letterSpacing: 2 }}>SHANGHAI GLOBAL</span>
        </div>
        <div style={{ display: "flex", marginTop: 50, fontSize: 62, fontWeight: 900, lineHeight: 1.05, maxWidth: 980 }}>
          YOUR SOURCE FOR CHINESE AUTOMOTIVE PARTS
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 24, color: "#ABABAB" }}>
          Original · OEM · Reliable — shipped worldwide from the UAE
        </div>
      </div>
    ),
    { ...size },
  );
}
