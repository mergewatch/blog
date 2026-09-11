import { ImageResponse } from "next/og";
import {
  contentTypes,
  getAllContent,
  getContent,
  type ContentType,
} from "@/lib/content";

export const runtime = "nodejs";

/**
 * Prerender every OG image at build time (#13).
 *
 * As a dynamic route this returned 500 on Amplify — `ImageResponse` streams,
 * and Amplify's SSR adapter fails to pipe a streamed response ("failed to pipe
 * response"). It failed at the origin as well as through the /blog proxy, so
 * it was never a proxy problem.
 *
 * Nothing here needs a request: the content set is known at build time, there
 * are no external fonts and no network calls. Rendering these at build time
 * removes the streaming path entirely rather than working around it, and every
 * other page on this site is already prerendered.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllContent()
    .filter((item) => contentTypes.includes(item.type))
    .map((item) => ({ type: item.type, slug: item.slug }));
}

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
        {/* Satori requires an explicit display on any element with more than
            one child. This has three — author, the separator, reading time —
            and without it ImageResponse throws, which is why this route
            returned 500 on every host. */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 28,
            color: "#989898",
            fontSize: 24,
          }}
        >
          <span>{item.author}</span>
          <span>·</span>
          <span>{item.readingTime}</span>
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
