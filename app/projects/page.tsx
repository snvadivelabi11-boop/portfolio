'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ExternalLink,
  GitBranch,
  Folder,
  BookOpen,
  ArrowLeft,
  X,
  CheckCircle2,
  GraduationCap,
  Layout,
  Bot,
  Layers,
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';
import SectionHeading from '@/components/ui/SectionHeading';
import { projectCategories, projects as defaultProjects } from '@/data';
import { useLiveProjects } from '@/hooks/useFirestoreCMS';

const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  GraduationCap,
  Layout,
  Bot,
};

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<any | null>(null);

  const { projects: liveProjects } = useLiveProjects();
  const allProjects = liveProjects.length > 0 ? liveProjects : defaultProjects;

  const getCategorySlug = (p: { category?: string; categorySlug?: string }) => {
    if (p.categorySlug) return p.categorySlug;
    const catLower = (p.category || '').toLowerCase();
    if (catLower.includes('ai')) return 'ai-automation';
    if (catLower.includes('edu') || catLower.includes('college')) return 'college-education';
    return 'app-platform';
  };

  const filteredProjects = allProjects.filter((project) => {
    const pSlug = getCategorySlug(project);
    const matchesCategory = selectedCategorySlug === 'all' || pSlug === selectedCategorySlug;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>

        <SectionHeading title="Production Projects &amp; Case Studies" subtitle="Category &amp; Software Explorer" />

        {/* Categories Quick Select Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
          {projectCategories.map((cat) => {
            const IconComp = categoryIcons[cat.icon] || Layers;
            const count = allProjects.filter((p) => getCategorySlug(p) === cat.id).length;
            const isSelected = selectedCategorySlug === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategorySlug((prev) => (prev === cat.id ? 'all' : cat.id))}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-violet-500/20 border-violet-500/50 text-white shadow-lg shadow-violet-500/10'
                    : 'bg-white/[0.02] hover:bg-white/[0.04] border-white/[0.08] text-white/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                    <IconComp size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white">{cat.title}</div>
                    <div className="text-[10px] text-white/40">{count} Projects</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Search & Category Filter Controls */}
        <div className="max-w-3xl mx-auto mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by name, description, or technology..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white text-xs placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategorySlug('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedCategorySlug === 'all'
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-lg shadow-violet-500/10'
                  : 'text-white/40 hover:text-white/80 border border-white/[0.06]'
              }`}
            >
              All Projects ({allProjects.length})
            </button>
            {projectCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategorySlug(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategorySlug === cat.id
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-lg shadow-violet-500/10'
                    : 'text-white/40 hover:text-white/80 border border-white/[0.06]'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -4 }}
              className="group rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl p-6 flex flex-col justify-between space-y-4 transition-all shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                      <Folder size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-[10px] font-mono text-white/40 uppercase">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-violet-500/30 text-white transition-all"
                        aria-label="Live Demo"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-violet-500/30 text-white transition-all"
                        aria-label="GitHub Repository"
                      >
                        <GitBranch size={15} />
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
                      className="px-3 py-1 rounded-full text-[11px] font-medium bg-white/[0.04] text-white/70 border border-white/[0.08]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {project.caseStudy && (
                <button
                  onClick={() => setSelectedCaseStudy(project)}
                  className="w-full py-2.5 px-4 rounded-xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all mt-4"
                >
                  <BookOpen size={14} /> Read Case Study &amp; Architecture
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </main>

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
                  Technical Case Study
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

      <Footer />
    </div>
  );
}
