'use client';

import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';
import { useLiveSettings } from '@/hooks/useFirestoreCMS';
import { personalStats } from '@/data';

export default function PrivacyPolicy() {
  const { settings } = useLiveSettings();
  const activeEmail = settings?.personal?.email || personalStats.email;
  const activePhone = settings?.personal?.phone || personalStats.phone;
  const activeLocation = settings?.personal?.location || personalStats.location;

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
          <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="text-xs text-white/40">Last Updated: February 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-xs text-white/70 leading-relaxed border-t border-white/[0.08] pt-8">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">1. Introduction</h2>
            <p>
              Abishek Digital (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects your privacy and is committed to protecting visitor personal data. This Privacy Policy explains how information is collected, used, and safeguarded when visiting abishek.dev.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">2. Information We Collect</h2>
            <p>
              We collect minimal information necessary to deliver high-quality web experiences and respond to inquiries:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Contact Information</strong>: Name, email address, phone number, and message content submitted via the contact form.</li>
              <li><strong>Review Submissions</strong>: Name, role, company, review content, and star ratings submitted through the review form.</li>
              <li><strong>Anonymous Telemetry</strong>: Device type, browser type, generalized geolocation (country/city), and referrer source for visitor analytics.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">3. How We Use Information</h2>
            <p>
              Information collected is used strictly for responding to client inquiries, moderating user reviews, analyzing website telemetry, and optimizing Core Web Vitals performance. We never sell or lease personal data to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">4. Cookies &amp; Tracking</h2>
            <p>
              We use minimal session cookies for admin authentication and privacy-friendly telemetry scripts (such as GA4 and Microsoft Clarity) to monitor application uptime and usability.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">5. Contact Information</h2>
            <p>
              For privacy inquiries or data requests, please contact Abishek directly at <a href={`mailto:${activeEmail}`} className="underline text-violet-400 font-bold">{activeEmail}</a> or phone <strong className="font-bold">+91 {activePhone}</strong> ({activeLocation}).
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
