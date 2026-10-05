import { ImageResponse } from "next/og";
import { getRelease, releases } from "@/lib/data";

export const alt = "Release by Taimoor Asif";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// params is a plain object in some Next versions and a Promise in others; awaiting handles both.
export default async function Image({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const { slug } = await params;
  const r = getRelease(slug) ?? releases[0];
  const result = r.result && r.result.value !== "Shipped" ? r.result : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f5f1e5",
          color: "#1f2a44",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 24, letterSpacing: 3, textTransform: "uppercase" }}>
          <div style={{ width: 18, height: 18, background: "#1f45e0", transform: "rotate(45deg)" }} />
          <span style={{ color: "#1f45e0" }}>{r.version}</span>
          <span style={{ color: "#5b657f" }}>{r.kind}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>{r.name}</div>
          <div style={{ display: "flex", fontSize: 34, marginTop: 22, color: "#4b5670", lineHeight: 1.3 }}>{r.tagline}</div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          {result ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
              <span style={{ fontSize: 64, fontWeight: 700, color: "#1f45e0" }}>{result.value}</span>
              <span style={{ fontSize: 28, color: "#4b5670" }}>{result.label}</span>
            </div>
          ) : (
            <div style={{ display: "flex", fontSize: 26, color: "#4b5670" }}>{r.stack.slice(0, 4).join(" · ")}</div>
          )}
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 2, textTransform: "uppercase", color: "#5b657f" }}>
            Taimoor Asif
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
