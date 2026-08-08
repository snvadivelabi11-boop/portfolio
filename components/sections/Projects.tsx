'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Layout,
  Bot,
  Code2,
  Cpu,
  Database,
  Globe,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  GitBranch,
  Folder,
  BookOpen,
  X,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import Link from 'next/link';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { useLiveProjects, useLiveProjectCategories } from '@/hooks/useFirestoreCMS';
import { ProjectCategoryRecord } from '@/lib/firestoreCMS';

const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  GraduationCap,
  Layout,
  Bot,
  Code2,
  Cpu,
  Database,
  Globe,
  Sparkles,
  Layers,
};

export default function Projects() {
  const { projects: liveProjects } = useLiveProjects();
  const { categories: liveCategories } = useLiveProjectCategories();
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategoryRecord | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<any | null>(null);

  // Helper to resolve project category slug
  const getCategorySlug = (p: { category?: string; categorySlug?: string }) => {
    if (p.categorySlug) return p.categorySlug;
    const catLower = (p.category || '').toLowerCase();
    if (catLower.includes('ai')) return 'ai-automation';
    if (catLower.includes('edu') || catLower.includes('college')) return 'college-education';
    return 'app-platform';
  };

  // Projects filtered by selected category
  const categoryProjects = selectedCategory
    ? liveProjects.filter((p) => getCategorySlug(p) === selectedCategory.id)
    : [];

  return (
    <section id="projects" className="relative py-20 sm:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeading title="Featured Projects" subtitle="Category &amp; Software Portfolio" />

        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            /* ============================================================ */
            /* 1. MAIN CATEGORIES GRID (Compact 3-Column Layout)           */
            /* ============================================================ */
            <motion.div
              key="categories-grid"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveCategories.map((cat) => {
                  const IconComponent = (cat.icon && categoryIcons[cat.icon]) ? categoryIcons[cat.icon] : Layers;
                  const count = liveProjects.filter((p) => getCategorySlug(p) === cat.id).length;

                  return (
                    <motion.div
                      key={cat.id}
                      variants={fadeInUp}
                      whileHover={{ y: -6 }}
                      onClick={() => setSelectedCategory(cat)}
                      className="group relative rounded-3xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-2xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-lg hover:shadow-violet-500/10 hover:border-violet-500/30"
                    >
                      <div>
                        {/* Header Badge & Count */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 group-hover:bg-violet-500/20 transition-all">
                            <IconComponent size={24} />
                          </div>
                          <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-violet-300 font-semibold">
                            {count} {count === 1 ? 'Project' : 'Projects'}
                          </span>
                        </div>

                        {/* Category Title & Subtitle */}
                        <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors mb-2">
                          {cat.title}
                        </h3>
                        <p className="text-xs text-white/50 leading-relaxed mb-6">
                          {cat.description}
                        </p>
                      </div>

                      {/* Footer CTA */}
                      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-violet-300 group-hover:text-violet-200">
                        <span>View Projects</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="text-center pt-6">
                <AnimatedButton variant="secondary" href="https://github.com/snvadivelabi11-boop">
                  Explore All Repositories on GitHub
                </AnimatedButton>
              </div>
            </motion.div>
          ) : (
            /* ============================================================ */
            /* 2. CATEGORY DETAIL VIEW (Compact Individual Projects)       */
            /* ============================================================ */
            <motion.div
              key="category-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Category Detail Navigation Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.08]">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-white/80 hover:text-white transition-all"
                >
                  <ArrowLeft size={14} /> Back to All Categories
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/40 font-mono">
                    Category: <strong className="text-violet-300">{selectedCategory.title}</strong>
                  </span>
                  <Link
                    href={`/projects/${selectedCategory.id}`}
                    className="text-[11px] font-semibold text-violet-400 hover:underline flex items-center gap-1"
                  >
                    Direct Link <ExternalLink size={12} />
                  </Link>
                </div>
              </div>

              {/* Category Header */}
              <div className="p-6 sm:p-8 rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/20 via-neutral-900 to-fuchsia-950/20">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                  {selectedCategory.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/60 max-w-2xl leading-relaxed">
                  {selectedCategory.description}
                </p>
              </div>

              {/* Compact Individual Projects Grid */}
              {categoryProjects.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-3xl space-y-2">
                  <Folder size={32} className="mx-auto text-white/30" />
                  <p className="text-white/60 font-semibold text-sm">No projects found in this category.</p>
                  <p className="text-white/40 text-xs">Check back soon for new software releases.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={fadeInUp}
                      whileHover={{ y: -4 }}
                      className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] p-6 flex flex-col justify-between space-y-4 transition-all shadow-md"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-2.5">
                            <Folder size={20} className="text-violet-400 flex-shrink-0" />
                            <h4 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                              {project.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/10 hover:bg-violet-500/30 text-white transition-all"
                                aria-label="Live Demo"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/10 hover:bg-violet-500/30 text-white transition-all"
                                aria-label="GitHub Repo"
                              >
                                <GitBranch size={14} />
                              </a>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-white/60 leading-relaxed">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.04] text-white/70 border border-white/[0.08]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {project.caseStudy && (
                        <button
                          onClick={() => setSelectedCaseStudy(project)}
                          className="w-full py-2 px-3 rounded-xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <BookOpen size={13} /> View Technical Architecture
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Technical Case Study Modal */}
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
                  Technical Architecture Case Study
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">{selectedCaseStudy.title}</h3>
              </div>

              <div className="space-y-6 text-sm text-white/70">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <h4 className="text-xs uppercase font-bold text-red-400 mb-1">Problem Statement</h4>
                  <p className="text-xs">{selectedCaseStudy.caseStudy.problem}</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <h4 className="text-xs uppercase font-bold text-emerald-400 mb-1">Solution Implemented</h4>
                  <p className="text-xs">{selectedCaseStudy.caseStudy.solution}</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <h4 className="text-xs uppercase font-bold text-violet-400 mb-1">Business Impact</h4>
                  <p className="text-xs">{selectedCaseStudy.caseStudy.impact}</p>
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
