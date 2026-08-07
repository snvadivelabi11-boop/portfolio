import type { Metadata } from "next";
import { siteConfig, getAllKeywords, getCanonicalUrl } from "@/utils/seo";
import { generateServiceSchema } from "@/utils/schema";
import JsonLd from "@/components/seo/JsonLd";
import PageContent from "@/components/layout/PageContent";

// ============================================================
// Page-Level Metadata (Server Component)
// ============================================================
export const metadata: Metadata = {
  title: "Abishek | Full Stack Developer, AI Automation Engineer & Software Engineer",
  description:
    "Abishek is a Full Stack Developer, AI Automation Engineer, and Software Engineer based in San Francisco, CA. Specializing in Next.js, React, TypeScript, Python, AI/ML, and enterprise web applications. Explore projects, skills, and services.",
  keywords: getAllKeywords(),
  alternates: {
    canonical: getCanonicalUrl(),
  },
  openGraph: {
    title: "Abishek | Full Stack Developer & AI Automation Engineer",
    description:
      "Explore the portfolio of Abishek — a Full Stack Developer and AI Automation Engineer crafting exceptional digital experiences with Next.js, React, TypeScript, and AI.",
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
    title: "Abishek | Full Stack Developer & AI Automation Engineer",
    description:
      "Full Stack Developer & AI Creator crafting exceptional digital experiences with modern technology.",
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
