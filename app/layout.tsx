import type { Metadata } from "next";
import { Analytics } from "@/components/analytics";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { canonicalRoot, canonicalUrl, site } from "@/lib/site";
import { robotsMetadata, serializeJsonLd } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(canonicalRoot),
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
    images: [
      {
        url: canonicalUrl("opengraph-image"),
        width: 1200,
        height: 630,
        alt: "MergeWatch Blog",
      },
    ],
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
