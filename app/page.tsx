import type { Metadata } from "next";
import { siteConfig, getAllKeywords, getCanonicalUrl } from "@/utils/seo";
import { generateServiceSchema } from "@/utils/schema";
import JsonLd from "@/components/seo/JsonLd";
import PageContent from "@/components/layout/PageContent";

// ============================================================
// Page-Level Metadata (Server Component)
// ============================================================
export const metadata: Metadata = {
  title: "Abishek | Full Stack Developer, React & Next.js Engineer",
  description:
    "Explore the portfolio of Abishek — a Full Stack Developer & AI Creator building modern web applications, Next.js & React systems, and AI automations.",
  keywords: getAllKeywords(),
  alternates: {
    canonical: getCanonicalUrl(),
  },
  openGraph: {
    title: "Abishek | Full Stack Developer, React & Next.js Engineer",
    description:
      "Explore the portfolio of Abishek — a Full Stack Developer & AI Creator building modern web applications, Next.js & React systems, and AI automations.",
    url: siteConfig.url,
    type: "website",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Abishek — Full Stack Developer & AI Automation Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abishek | Full Stack Developer, React & Next.js Engineer",
    description:
      "Explore the portfolio of Abishek — a Full Stack Developer & AI Creator building modern web applications, Next.js & React systems, and AI automations.",
    images: [siteConfig.ogImage],
  },
};

export default function Home() {
  // Generate service schemas for structured data
  const serviceSchemas = [
    generateServiceSchema(
      "Web Development",
      "Building high-performance, scalable web applications with modern frameworks like Next.js, React, and TypeScript for exceptional user experiences.",
      "Web Development"
    ),
    generateServiceSchema(
      "AI Automation",
      "Leveraging artificial intelligence and machine learning to automate workflows, enhance decision-making, and create intelligent systems that scale.",
      "AI Development"
    ),
    generateServiceSchema(
      "UI/UX Design",
      "Crafting pixel-perfect interfaces with intuitive user experiences that convert visitors into loyal customers using modern design tools.",
      "Design"
    ),
    generateServiceSchema(
      "API Development",
      "Designing robust, secure, and well-documented RESTful and GraphQL APIs that power modern applications and enable seamless integrations.",
      "Software Development"
    ),
  ];

  return (
    <>
      {/* Service Structured Data */}
      <JsonLd data={serviceSchemas} />
      <PageContent />
    </>
  );
}
