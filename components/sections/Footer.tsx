'use client';

import { motion } from 'framer-motion';
import { ArrowUp, GitBranch, Link as LinkIcon, MessageCircle, Camera } from 'lucide-react';
import Link from 'next/link';
import { contactInfo, navLinks } from '@/data';
import { useLiveSettings, useLiveContact } from '@/hooks/useFirestoreCMS';

const socialIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  GitBranch,
  Link: LinkIcon,
  MessageCircle,
  Camera,
};

export default function Footer() {
  const { settings } = useLiveSettings();
  const { contact } = useLiveContact();
  const activeName = settings?.personal?.name || 'Abishek';
  const activeEmail = settings?.personal?.email || contact.email || 'SNVADIVEL11@gmail.com';
  const activePhone = settings?.personal?.phone || contact.phone || '9786801597';
  const activeLocation = settings?.personal?.location || contact.location || 'Tiruvannamalai, Tamil Nadu, India';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/[0.08] bg-neutral-950/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                {activeName} Digital
              </span>
              <span className="text-white/40">.</span>
            </Link>
            <p className="text-white/50 text-xs mt-4 leading-relaxed max-w-sm">
              Full Stack Developer &amp; AI Creator based in Tiruvannamalai. Building enterprise web platforms, autonomous AI automations, and pixel-perfect design systems.
            </p>
            <div className="mt-4 text-xs text-violet-300/80 font-mono space-y-1">
              <div>Email: <a href={`mailto:${activeEmail}`} className="hover:underline">{activeEmail}</a></div>
              <div>Phone: +91 {activePhone}</div>
              <div>Location: {activeLocation}</div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Navigation</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {navLinks.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="text-white/40 hover:text-violet-400 transition-colors"
                >
                  {label}
                </a>
              ))}
              <Link href="/projects" className="text-white/40 hover:text-violet-400 transition-colors">
                Projects
              </Link>
              <Link href="/blog" className="text-white/40 hover:text-violet-400 transition-colors">
                Blog
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Legal</h4>
            <div className="flex gap-2.5 mb-4">
              {contactInfo.socials.map(({ name, url, icon }) => {
                const Icon = socialIcons[icon] || GitBranch;
                return (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white hover:border-violet-500/30 transition-all"
                    aria-label={name}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <Link href="/privacy" className="text-white/40 hover:text-violet-400 transition-colors">
                  Privacy Policy
                </Link>
              </div>
              <div>
                <Link href="/terms" className="text-white/40 hover:text-violet-400 transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.06]">
          <p className="text-xs text-white/40 flex items-center gap-1">
            © {new Date().getFullYear()} Abishek Digital. All Rights Reserved.
          </p>
          <motion.button
            suppressHydrationWarning
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white hover:border-violet-500/30 transition-all"
            aria-label="Back to top"
          >
            <ArrowUp size={16} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
