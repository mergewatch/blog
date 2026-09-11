import { ImageResponse } from "next/og";

export const alt = "MergeWatch Blog — Building trust into every pull request";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// See app/og/[type]/[slug]/route.tsx — pinned so the root layout's
// revalidate=300 (#21) cannot reach this image.
export const revalidate = false;
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        color: "#e6edf3",
        background: "#0f0f0f",
        backgroundImage:
          "linear-gradient(#1e1e1e 1px,transparent 1px),linear-gradient(90deg,#1e1e1e 1px,transparent 1px)",
        backgroundSize: "40px 40px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        <span style={{ color: "#00ff88" }}>MW</span>
        <span>mergewatch.ai / blog</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            maxWidth: 1000,
            fontSize: 70,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
          }}
        >
          Building trust into every pull request.
        </div>
        <div style={{ marginTop: 28, color: "#989898", fontSize: 28 }}>
          Engineering · Product · Research
        </div>
      </div>
    </div>,
    size,
  );
}
