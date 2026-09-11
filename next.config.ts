import type { NextConfig } from "next";

function normalizeBasePath(value: string | undefined): string {
  if (!value || value === "/") return "";
  return `/${value.replace(/^\/+|\/+$/g, "")}`;
}

const basePath = normalizeBasePath(
  process.env.NEXT_PUBLIC_BASE_PATH ?? "/blog",
);

const nextConfig: NextConfig = {
  basePath,
  // Bake DEPLOYMENT_ENV into the build. Pages revalidate at runtime (#24), and
  // Amplify's SSR runtime does not receive console environment variables, so a
  // production page rebuilt after deploy read it as unset and turned noindex.
  // An unset value at build time still fails closed to noindex.
  env: { DEPLOYMENT_ENV: process.env.DEPLOYMENT_ENV ?? "" },
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
