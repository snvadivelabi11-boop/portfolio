'use client';

import { motion } from 'framer-motion';
import { Monitor, Server, Database, Cloud, Brain, Settings, ShieldCheck, Code2, FileCode, Palette, Sparkles, Cpu, Terminal, Zap, GitBranch, HardDrive, Layers, Container, Bot, Link as LinkIcon, RefreshCw, Activity, Shield, Lock, CheckCircle, Key } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlassCard from '@/components/ui/GlassCard';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { useLiveSkills } from '@/hooks/useFirestoreCMS';

const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Monitor,
  Server,
  Database,
  Cloud,
  Brain,
  Settings,
  Shield,
  ShieldCheck,
};

const skillIconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Code2, FileCode, Palette, Sparkles, Cpu, Terminal, Zap, GitBranch,
  HardDrive, Layers, Cloud, Container, Bot, Link: LinkIcon, RefreshCw, Activity,
  ShieldCheck, Lock, CheckCircle, Key, Server, Database, Brain,
};

export default function Skills() {
  const { skills: liveSkills } = useLiveSkills();

  // Group live skills by category if present
  const categories = liveSkills.length > 0
    ? Object.entries(
        liveSkills.reduce<Record<string, { title: string; icon: string; skills: { name: string; icon?: string }[] }>>((acc, s) => {
          const cat = s.category || 'General';
          if (!acc[cat]) {
            acc[cat] = { title: cat, icon: 'Code2', skills: [] };
          }
          acc[cat].skills.push({ name: s.name, icon: s.icon || 'Code2' });
          return acc;
        }, {})
      ).map(([, value]) => value)
    : [];

  return (
    <section id="skills" className="relative py-20 sm:py-28 lg:py-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeading title="Skills &amp; Expertise" subtitle="Comprehensive Technical Capabilities" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          {categories.length === 0 ? (
            <div className="col-span-4 text-center py-12 border border-dashed border-white/10 rounded-2xl text-white/40 text-xs italic">
              No skills added yet. Add via Admin CMS.
            </div>
          ) : (
            categories.map((category) => {
            const CategoryIcon = categoryIconMap[category.icon] || Code2;
            return (
              <motion.div key={category.title} variants={fadeInUp}>
                <GlassCard className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
                      <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                        <CategoryIcon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-wide">{category.title}</h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => {
                        const SkillIcon = skillIconMap[skill.icon || 'Code2'] || Code2;
                        return (
                          <div
                            key={skill.name}
                            className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-violet-500/30 hover:bg-violet-500/[0.06] transition-all flex items-center gap-2 text-xs font-semibold text-white/90 group"
                          >
                            <SkillIcon size={14} className="text-violet-400 group-hover:scale-110 transition-transform" />
                            <span>{skill.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })
          )}
        </motion.div>
      </div>
    </section>
  );
}
