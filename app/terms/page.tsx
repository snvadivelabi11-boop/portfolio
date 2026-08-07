import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | Abishek Digital',
  description: 'Terms of service agreement for Abishek Digital.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400">
            <FileCheck size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Terms of Service</h1>
            <p className="text-xs text-white/40">Last Updated: February 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-xs text-white/70 leading-relaxed border-t border-white/[0.08] pt-8">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">1. Engagement &amp; Services</h2>
            <p>
              Abishek Digital provides full-stack software engineering, Next.js web development, AI workflow automation, API development, and UI/UX design services under mutually agreed statement of work (SOW) contracts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">2. Intellectual Property</h2>
            <p>
              Unless specified otherwise in a custom contract, all deliverables, clean source code, and design tokens created for clients upon final payment become the sole property of the client.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">3. Review Moderation &amp; Acceptable Use</h2>
            <p>
              Visitors submitting reviews or contacting Abishek Digital agree to provide accurate information and refrain from submitting harmful, defamatory, or malicious code payloads. Reviews undergo administrative approval prior to publication.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">4. Governing Law</h2>
            <p>
              These terms are governed by the laws of India, with primary location of operations in Tiruvannamalai, Tamil Nadu.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
