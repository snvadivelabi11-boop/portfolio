'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function AnimatedButton({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
}: AnimatedButtonProps) {
  const baseStyles =
    'relative inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm tracking-wide overflow-hidden transition-all duration-300 w-full sm:w-auto text-center';

  const variants = {
    primary:
      'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105',
    secondary:
      'border border-white/[0.15] text-white/90 hover:bg-white/[0.05] hover:border-white/[0.25] hover:scale-105',
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    const isExternal = href.startsWith('http');
    return (
      <motion.a
        href={href}
        target={isExternal ? '_blank' : '_self'}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        whileTap={{ scale: 0.97 }}
        className={combinedStyles}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      </motion.a>
    );
  }

  return (
    <motion.button
      suppressHydrationWarning
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={combinedStyles}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
