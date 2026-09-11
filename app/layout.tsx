import type { Metadata } from "next";
import { Analytics } from "@/components/analytics";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { PRODUCTION_ORIGIN, canonicalRoot, site } from "@/lib/site";
import { robotsMetadata, serializeJsonLd } from "@/lib/metadata";
import "./globals.css";

// #21: Amplify serves prerendered page output with s-maxage=31536000 (a year),
// and the /blog rewrite makes the DASHBOARD's CDN cache that response. Deploying
// this app invalidates only this app's distribution, so published posts do not
// appear and DELETED posts stay reachable — while every deploy reports success.
//
// Three levers were tried and measured: next.config headers() (discarded on
// prerendered pages), amplify.yml customHeaders (no effect), and this one —
// which was dismissed earlier on an invalid local test, because `next start`
// never emits the s-maxage header at all, so nothing could have changed.
//
// revalidate is the adapter's documented ISR lever, so it is the one mechanism
// aimed at the layer that actually sets the header. Verify on development by
// measuring the response; if it does not move, revert rather than stack a
// fourth config that reads correctly and does nothing.
export const revalidate = 300;

export const metadata: Metadata = {
  metadataBase: new URL(PRODUCTION_ORIGIN),
  title: {
    default: "MergeWatch Blog — Engineering, Product & Research",
    template: "%s — MergeWatch Blog",
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: canonicalRoot },
  icons: { icon: "/icon.svg" },
  openGraph: {
    type: "website",
    url: canonicalRoot,
    siteName: site.name,
    title: "MergeWatch Blog",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "MergeWatch Blog",
    description: site.description,
  },
  robots: robotsMetadata,
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://mergewatch.ai/#organization",
    name: "MergeWatch",
    url: "https://mergewatch.ai",
    logo: "https://mergewatch.ai/icon.svg",
    sameAs: [site.github],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${canonicalRoot}/#website`,
    name: site.name,
    url: canonicalRoot,
    publisher: { "@id": "https://mergewatch.ai/#organization" },
  },
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${canonicalRoot}/#blog`,
    name: site.name,
    url: canonicalRoot,
    publisher: { "@id": "https://mergewatch.ai/#organization" },
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
