'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, GitBranch, Link as LinkIcon, Mail, MapPin, Sparkles } from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { useLiveHero, useLiveSocials, useLiveSettings } from '@/hooks/useFirestoreCMS';
import gsap from 'gsap';

export default function Hero() {
  const { hero } = useLiveHero();
  const { socials } = useLiveSocials();
  const { settings } = useLiveSettings();
  const [titleIndex, setTitleIndex] = useState(0);
  const titles = useMemo(() => {
    return hero.titles && hero.titles.length > 0 ? hero.titles : ['Full Stack Developer', 'AI Creator'];
  }, [hero.titles]);
  const [displayedText, setDisplayedText] = useState(titles[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const orbRef = useRef<HTMLDivElement>(null);

  const activeEmail = settings?.personal?.email || hero.email || 'snvadivelabi11@gmail.com';
  const activeGithub = settings?.socials?.github || socials.github;
  const activeLinkedin = settings?.socials?.linkedin || socials.linkedin;
  const activeInstagram = settings?.socials?.instagram || socials.instagram;

  const socialLinks = [
    { icon: GitBranch, href: activeGithub, label: 'GitHub — Open Source Profile' },
    { icon: LinkIcon, href: activeLinkedin, label: 'LinkedIn — Professional Profile' },
    { icon: InstagramIcon, href: activeInstagram, label: 'Instagram — Creator Profile' },
    { icon: Mail, href: `mailto:${activeEmail}`, label: 'Email — Direct Inquiries' },
  ];

  // Typing effect
  useEffect(() => {
    const currentFullText = titles[titleIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(currentFullText.substring(0, displayedText.length + 1));
        if (displayedText.length === currentFullText.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayedText(currentFullText.substring(0, displayedText.length - 1));
        if (displayedText.length === 0) {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % titles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, titleIndex, titles]);

  // GSAP subtle mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (orbRef.current) {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 40;
        const yPos = (clientY / window.innerHeight - 0.5) * 40;
        gsap.to(orbRef.current, {
          x: xPos,
          y: yPos,
          duration: 1.5,
          ease: 'power2.out',
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const activeName = settings?.personal?.name || hero.name || 'Abishek';
  const activeDescription = hero.description || 'Building enterprise-grade web applications, autonomous AI automations, and pixel-perfect design systems with linear precision.';
  const activeLocation = settings?.personal?.location || hero.location || 'Tiruvannamalai, IN';

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated gradient background with GSAP mouse reactivity */}
      <div ref={orbRef} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-fuchsia-600/15 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Modern subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Status badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 backdrop-blur-md text-xs font-medium text-violet-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Available for Select Work &amp; AI Projects
          </span>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md text-xs font-medium text-white/60">
            <MapPin size={13} className="text-violet-400" />
            {activeLocation}
          </span>
        </motion.div>

        {/* Main Name Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-[0.98] mb-6 break-words"
        >
          <span className="block text-white">Hi, I&apos;m</span>
          <span className="block mt-2 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            {activeName}
          </span>
        </motion.h1>

        {/* Typing Animation Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="min-h-12 flex items-center justify-center mb-6 sm:mb-8"
        >
          <span className="text-lg sm:text-2xl md:text-3xl font-semibold text-white/90 leading-snug">
            {displayedText}
            <span className="animate-pulse text-violet-400">|</span>
          </span>
        </motion.div>

        {/* Value Proposition */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm sm:text-lg md:text-xl text-white/60 font-normal max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
        >
          {activeDescription}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12 w-full sm:w-auto"
        >
          <AnimatedButton variant="primary" href="#projects">
            <Sparkles size={16} /> Explore My Work
          </AnimatedButton>
          <AnimatedButton variant="secondary" href="#contact">
            Get In Touch
          </AnimatedButton>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex justify-center gap-4"
        >
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/50 hover:text-white hover:border-violet-500/40 hover:bg-violet-500/10 transition-all duration-300"
              aria-label={label}
            >
              <Icon size={18} />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Down Arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.a
          href="#about"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-2 rounded-full border border-white/10 text-white/30 hover:text-white/70 transition-colors"
          aria-label="Scroll to About section"
        >
          <ArrowDown size={18} />
        </motion.a>
      </motion.div>
    </section>
  );
}
