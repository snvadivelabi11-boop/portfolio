'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/[0.05] to-fuchsia-500/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
