'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, GitBranch, Folder, BookOpen, X, CheckCircle2 } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { useLiveProjects } from '@/hooks/useFirestoreCMS';

const categories = ['All', 'Web', 'AI'];

export default function Projects() {
  const { projects: liveProjects } = useLiveProjects();
  const [activeCategory, setActiveCategory] = useState('All');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<any | null>(null);

  const displayProjects = liveProjects;

  const filteredProjects =
    activeCategory === 'All'
      ? displayProjects
      : displayProjects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeading title="Featured Projects" subtitle="Real-World Software Craft" />

        {/* Category Filters */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              suppressHydrationWarning
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-lg shadow-violet-500/10'
                  : 'text-white/40 hover:text-white/80 border border-white/[0.06] hover:border-white/[0.15]'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Project Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.length === 0 ? (
              <div className="col-span-2 text-center py-16 border border-dashed border-white/10 rounded-2xl text-white/40 text-sm">
                No Data Available
              </div>
            ) : (
              filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={fadeInUp}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl overflow-hidden flex flex-col justify-between"
              >
                {/* Project Header Graphic */}
                <div className="relative h-56 bg-gradient-to-br from-violet-950/40 via-neutral-900 to-fuchsia-950/40 overflow-hidden border-b border-white/[0.06] p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-center z-10">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-violet-300 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                      {project.category} Project
                    </span>

                    <div className="flex gap-2">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-full bg-white/10 backdrop-blur-md hover:bg-violet-500/30 text-white transition-all"
                        aria-label="Live Demo"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-full bg-white/10 backdrop-blur-md hover:bg-violet-500/30 text-white transition-all"
                        aria-label="GitHub Repository"
                      >
                        <GitBranch size={16} />
                      </a>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center gap-3">
                    <Folder className="w-10 h-10 text-violet-400/60 group-hover:text-violet-400 transition-colors" />
                    <h3 className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-white/60 text-xs leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full text-[11px] font-medium bg-white/[0.04] text-white/70 border border-white/[0.08]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {project.caseStudy && (
                    <button
                      suppressHydrationWarning
                      onClick={() => setSelectedCaseStudy(project)}
                      className="w-full py-2.5 px-4 rounded-xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <BookOpen size={14} /> View Case Study
                    </button>
                  )}
                </div>
              </motion.div>
            ))
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <AnimatedButton variant="secondary" href={liveProjects[0]?.githubUrl || 'https://github.com/snvadivelabi11-boop'}>
            Explore All Repositories on GitHub
          </AnimatedButton>
        </motion.div>
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedCaseStudy && selectedCaseStudy.caseStudy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={() => setSelectedCaseStudy(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-3xl p-8 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCaseStudy(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <span className="text-xs uppercase tracking-widest text-violet-400 font-semibold">
                  Case Study
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">{selectedCaseStudy.title}</h3>
              </div>

              <div className="space-y-6 text-sm text-white/70">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <h4 className="text-xs uppercase font-bold text-red-400 mb-1">The Problem</h4>
                  <p>{selectedCaseStudy.caseStudy.problem}</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <h4 className="text-xs uppercase font-bold text-emerald-400 mb-1">The Solution</h4>
                  <p>{selectedCaseStudy.caseStudy.solution}</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <h4 className="text-xs uppercase font-bold text-violet-400 mb-1">Business Impact</h4>
                  <p>{selectedCaseStudy.caseStudy.impact}</p>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold text-white/90 mb-2">Technical Architecture</h4>
                  <ul className="grid grid-cols-2 gap-2 text-xs">
                    {selectedCaseStudy.caseStudy.architecture.map((arch: string) => (
                      <li key={arch} className="flex items-center gap-2 text-white/60">
                        <CheckCircle2 size={13} className="text-violet-400" />
                        {arch}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
