import { Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/lib/site";

// Same wordmark treatment as the mergewatch.ai nav (MergeWatchLogo.tsx).
// next/font self-hosts the 800 glyphs at build time, so there is no runtime
// Google Fonts request.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
});

const BRAND_GREEN = "#16A34A";
const WORDMARK_GRAY = "#767C87";

export function LogoMark({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="166 386 692 366"
      width={Math.round(size * (692 / 366))}
      height={size}
      role="img"
      aria-label="MergeWatch logomark"
      className={className}
    >
      <path
        d="M 207 579.4 Q 512 274.4 817 579.4"
        fill="none"
        stroke={BRAND_GREEN}
        strokeWidth="82"
        strokeLinecap="round"
      />
      <path
        fillRule="evenodd"
        fill={BRAND_GREEN}
        d="M 404,644.4 a 108,108 0 1,0 216,0 a 108,108 0 1,0 -216,0 M 441.8,601.2 a 32.4,32.4 0 1,0 64.8,0 a 32.4,32.4 0 1,0 -64.8,0"
      />
    </svg>
  );
}

export function Wordmark() {
  return (
    <a
      href={site.product}
      className="inline-flex shrink-0 items-center gap-2"
      aria-label="MergeWatch home"
    >
      <LogoMark size={20} className="shrink-0" />
      <span
        className={`whitespace-nowrap text-xl tracking-tight ${jakarta.className}`}
        style={{
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: WORDMARK_GRAY,
        }}
      >
        mergewatch<span style={{ color: BRAND_GREEN }}>.ai</span>
      </span>
    </a>
  );
}
