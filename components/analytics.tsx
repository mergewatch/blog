import { GoogleAnalytics } from "@next/third-parties/google";

export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id || process.env.DEPLOYMENT_ENV !== "production") return null;
  return <GoogleAnalytics gaId={id} />;
}
