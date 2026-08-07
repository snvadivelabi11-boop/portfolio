"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Certificates from "@/components/sections/Certificates";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import VisitorTracker from "@/components/analytics/VisitorTracker";
import AiChatWidget from "@/components/ai/AiChatWidget";
import GitHub from "@/components/sections/GitHub";

const FloatingParticles = dynamic(
  () => import("@/components/ui/FloatingParticles"),
  { ssr: false }
);

export default function PageContent() {
  return (
    <div className="relative min-h-screen">
      <VisitorTracker />
      <FloatingParticles />
      <Navbar />

      <main id="main-content" role="main">
        <Hero />

        <article>
          <About />
        </article>

        <section aria-label="Skills and Expertise">
          <Skills />
        </section>

        <section aria-label="Services Offered">
          <Services />
        </section>

        <section aria-label="Featured Projects">
          <Projects />
        </section>

        <section aria-label="GitHub Open Source Activity">
          <GitHub />
        </section>

        <section aria-label="Work Experience and Education">
          <Experience />
        </section>

        <section aria-label="Verified Certifications & Credentials">
          <Certificates />
        </section>

        <section aria-label="Client Reviews">
          <Testimonials />
        </section>

        <section aria-label="Contact Information">
          <Contact />
        </section>
      </main>

      <Footer />
      <AiChatWidget />
    </div>
  );
}
