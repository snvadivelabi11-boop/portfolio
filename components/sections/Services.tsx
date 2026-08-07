'use client';

import { motion } from 'framer-motion';
import { Globe, Cpu, Brain, Zap, Palette, Activity, ArrowUpRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { useLiveServices } from '@/hooks/useFirestoreCMS';

const serviceIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  Cpu,
  Brain,
  Zap,
  Palette,
  Activity,
};

export default function Services() {
  const { services: liveServices } = useLiveServices();
  const servicesList = liveServices;
  return (
    <section id="services" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading title="Services &amp; Offerings" subtitle="End-to-End Solutions" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {servicesList.map((service, index) => {
            const ServiceIcon = serviceIconMap[service.icon] || Globe;
            return (
              <motion.div
                key={service.title}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-8 overflow-hidden transition-all duration-500 hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/10 flex flex-col justify-between"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/[0.05] via-transparent to-fuchsia-600/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 group-hover:scale-110 group-hover:bg-violet-500/20 transition-all duration-300">
                      <ServiceIcon className="w-6 h-6" />
                    </div>
                    <span className="text-4xl font-extrabold text-white/[0.05] font-mono group-hover:text-violet-400/20 transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-white/70">
                        <ArrowUpRight size={13} className="text-violet-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
