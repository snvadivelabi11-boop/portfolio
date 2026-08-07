import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig, getAllKeywords, getCanonicalUrl } from "@/utils/seo";
import { generateHomePageSchemas } from "@/utils/schema";
import JsonLd from "@/components/seo/JsonLd";
import Analytics from "@/components/seo/Analytics";
import TelemetryProvider from "@/components/analytics/TelemetryProvider";
import CookieConsentBanner from "@/components/ui/CookieConsentBanner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  preload: true,
});

// ============================================================
// Enterprise-Level Metadata Configuration
// ============================================================
export const metadata: Metadata = {
  // Core Metadata
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: getAllKeywords(),
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  ],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,

  // Canonical & Alternate
  alternates: {
    canonical: getCanonicalUrl(),
    types: {
      "application/rss+xml": [
        {
          url: "/feed.xml",
          title: `${siteConfig.name} RSS Feed`,
        },
      ],
    },
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Full Stack Developer & AI Automation Engineer Portfolio`,
        type: "image/png",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.shortDescription,
    images: [siteConfig.ogImage],
    creator: "@abishek",
  },

  // Verification
  verification: {
    google: siteConfig.verification.google || undefined,
    other: {
      ...(siteConfig.verification.bing ? { "msvalidate.01": [siteConfig.verification.bing] } : {}),
      ...(siteConfig.verification.yandex ? { "yandex-verification": [siteConfig.verification.yandex] } : {}),
    },
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },

  // App-specific
  applicationName: siteConfig.name,
  category: "technology",

  // Additional
  other: {
    "google-site-verification": siteConfig.verification.google || "",
    "msapplication-TileColor": "#8b5cf6",
    "format-detection": "telephone=no",
  },
};

// Viewport configuration (Next.js 15+ requires separate export)
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
    { media: "(prefers-color-scheme: light)", color: "#050505" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemas = generateHomePageSchemas();

  return (
    <html lang="en" dir="ltr" className={`${inter.variable} scroll-smooth`}>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* JSON-LD Structured Data */}
        <JsonLd data={schemas} />
      </head>
      <body suppressHydrationWarning className="bg-[#050505] text-white antialiased overflow-x-hidden">
        {/* Skip to content for accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        {/* Noscript SEO fallback */}
        <noscript>
          <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
            <h1>Abishek — Full Stack Developer &amp; AI Automation Engineer</h1>
            <p>Please enable JavaScript to view the full interactive portfolio.</p>
          </div>
        </noscript>

        {children}
        <Analytics />
        <TelemetryProvider />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
