'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calendar, FileText, GitBranch, Link as LinkIcon } from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import Link from 'next/link';
import { navLinks } from '@/data';
import BookMeetingModal from '@/components/modals/BookMeetingModal';
import ResumeModal from '@/components/modals/ResumeModal';
import { useLiveSettings } from '@/hooks/useFirestoreCMS';

export default function Navbar() {
  const { settings } = useLiveSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    setActiveSection(href);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-neutral-950/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl shadow-black/40'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/#home"
            className="text-2xl font-extrabold tracking-tight flex items-center gap-2 group"
          >
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              Abishek Tech
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:animate-ping" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] px-3 py-1.5 rounded-full backdrop-blur-md">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={() => handleNavClick(href)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors duration-300 ${
                  activeSection === href ? 'text-white bg-white/10' : 'text-white/60 hover:text-white'
                }`}
              >
                {label}
              </a>
            ))}

            <Link
              href="/blog"
              className="px-3.5 py-1.5 text-xs font-medium rounded-full text-white/60 hover:text-white transition-colors"
            >
              Blog
            </Link>
          </div>

          {/* Actions: Meeting & Resume */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setIsResumeOpen(true)}
              className="px-3.5 py-2 rounded-full text-xs font-medium border border-white/[0.12] text-white/80 hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5"
            >
              <FileText size={14} /> Resume
            </button>

            <button
              onClick={() => setIsMeetingOpen(true)}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <Calendar size={14} /> Book Meeting
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden relative z-50 p-2 text-white/70 hover:text-white"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 top-20 bg-neutral-950/95 backdrop-blur-2xl z-40 p-6 flex flex-col justify-between overflow-y-auto max-h-[calc(100vh-5rem)]"
            >
              <div className="flex flex-col gap-4 text-center">
                {navLinks.map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => handleNavClick(href)}
                    className="text-lg font-medium text-white/70 hover:text-white transition-colors py-1"
                  >
                    {label}
                  </a>
                ))}
                <Link
                  href="/blog"
                  onClick={() => setIsMobileOpen(false)}
                  className="text-lg font-medium text-violet-300 py-1"
                >
                  Blog Articles
                </Link>
              </div>

              <div className="flex flex-col gap-3 pb-8">
                <button
                  onClick={() => { setIsMobileOpen(false); setIsResumeOpen(true); }}
                  className="w-full py-3 rounded-xl border border-white/10 text-white text-xs font-semibold"
                >
                  View Resume
                </button>
                <button
                  onClick={() => { setIsMobileOpen(false); setIsMeetingOpen(true); }}
                  className="w-full py-3 rounded-xl bg-violet-600 text-white text-xs font-semibold"
                >
                  Book Discovery Meeting
                </button>

                <div className="flex justify-center gap-4 pt-2 border-t border-white/[0.08]">
                  <a href={settings?.socials?.github || "https://github.com/snvadivelabi11-boop"} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-white/10 text-white/60 hover:text-white" aria-label="GitHub — Open Source Profile">
                    <GitBranch size={16} />
                  </a>
                  <a href={settings?.socials?.linkedin || "https://www.linkedin.com/in/abishek-v-a984a6382"} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-white/10 text-white/60 hover:text-white" aria-label="LinkedIn — Professional Profile">
                    <LinkIcon size={16} />
                  </a>
                  <a href={settings?.socials?.instagram || "https://www.instagram.com/abishek_creator_/"} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-white/10 text-white/60 hover:text-white" aria-label="Instagram — Creator Profile">
                    <InstagramIcon size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Modals */}
      <BookMeetingModal isOpen={isMeetingOpen} onClose={() => setIsMeetingOpen(false)} />
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>
  );
}
