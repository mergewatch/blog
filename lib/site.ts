export const PRODUCTION_ORIGIN = "https://mergewatch.ai";

export function normalizeBasePath(
  value = process.env.NEXT_PUBLIC_BASE_PATH ?? "/blog",
) {
  if (!value || value === "/") return "";
  return `/${value.replace(/^\/+|\/+$/g, "")}`;
}

export const basePath = normalizeBasePath();
export const isProduction = process.env.DEPLOYMENT_ENV === "production";
export const canonicalRoot = `${PRODUCTION_ORIGIN}${basePath}`;

export function canonicalUrl(path = "") {
  const clean = path === "/" ? "" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return `${canonicalRoot}${clean}`;
}

export function appPath(path = "") {
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}`;
}

export const site = {
  name: "MergeWatch Blog",
  shortName: "MergeWatch",
  description:
    "Technical notes, product updates, and research from the team building open-source AI pull request review.",
  github: "https://github.com/mergewatch/mergewatch.ai",
  product: "https://mergewatch.ai/",
  pricing: "https://mergewatch.ai/pricing",
  openSource: "https://mergewatch.ai/open-source",
  signin: "https://mergewatch.ai/signin",
  docs: "https://docs.mergewatch.ai",
} as const;
