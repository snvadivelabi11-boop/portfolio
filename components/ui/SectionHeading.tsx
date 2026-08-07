'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/utils/animations';

interface SectionHeadingProps {
  title: string;
  subtitle: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ title, subtitle, align = 'center' }: SectionHeadingProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      <span className="inline-block text-sm font-semibold tracking-[0.2em] uppercase text-violet-400 mb-4">
        {subtitle}
      </span>
      <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">
        {title}
      </h2>
      <div className="mt-6 mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={align === 'center' ? {} : { marginLeft: 0 }} />
    </motion.div>
  );
}
