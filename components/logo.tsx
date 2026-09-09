import Link from "next/link";

export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      viewBox="166 386 692 366"
      width={Math.round(size * (692 / 366))}
      height={size}
      role="img"
      aria-label="MergeWatch logomark"
    >
      <path
        d="M 207 579.4 Q 512 274.4 817 579.4"
        fill="none"
        stroke="#16a34a"
        strokeWidth="82"
        strokeLinecap="round"
      />
      <path
        fillRule="evenodd"
        fill="#16a34a"
        d="M 404,644.4 a 108,108 0 1,0 216,0 a 108,108 0 1,0 -216,0 M 441.8,601.2 a 32.4,32.4 0 1,0 64.8,0 a 32.4,32.4 0 1,0 -64.8,0"
      />
    </svg>
  );
}

export function Wordmark() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2"
      aria-label="MergeWatch Blog home"
    >
      <LogoMark size={20} />
      <span className="text-base font-extrabold tracking-tight text-fg-secondary">
        mergewatch<span className="text-[#16a34a]">.ai</span>
      </span>
      <span className="hidden border-l border-border-default pl-2 text-sm font-medium text-fg-primary sm:inline">
        Blog
      </span>
    </Link>
  );
}
