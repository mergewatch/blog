import { ImageResponse } from "next/og";
import { getContent, type ContentType } from "@/lib/content";

export const runtime = "nodejs";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string; slug: string }> },
) {
  const { type, slug } = await params;
  const item = ["posts", "changelog", "labs"].includes(type)
    ? getContent(type as ContentType, slug)
    : undefined;
  if (!item) return new Response("Not found", { status: 404 });
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
          gap: 14,
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        <span style={{ color: "#00ff88" }}>MW</span>
        <span>mergewatch.ai / blog</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            color: "#00ff88",
            fontSize: 20,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
          }}
        >
          {item.category}
        </div>
        <div
          style={{
            maxWidth: 1050,
            marginTop: 18,
            fontSize: item.title.length > 55 ? 58 : 70,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
          }}
        >
          {item.title}
        </div>
        <div style={{ marginTop: 28, color: "#989898", fontSize: 24 }}>
          {item.author} · {item.readingTime}
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
