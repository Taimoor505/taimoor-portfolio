import { ImageResponse } from "next/og";
import { profile, releases } from "@/lib/data";

export const alt = "Taimoor Asif, AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#14213d",
          color: "#ffffff",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 22, height: 22, background: "#fca311", transform: "rotate(45deg)" }} />
          <div style={{ fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#fca311" }}>
            {profile.title}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 120, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>
            {profile.name}
            <span style={{ color: "#fca311" }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 38, marginTop: 24, color: "#c3c9d6" }}>
            Voice AI agents, automation and AI workflows
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#8f98ad",
          }}
        >
          <span>{`${releases.length} releases`}</span>
          <span>{`${profile.locationLong} · Remote`}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
