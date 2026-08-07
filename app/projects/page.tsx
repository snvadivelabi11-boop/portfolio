'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, GitBranch, Folder, BookOpen, ArrowLeft, X, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';
import SectionHeading from '@/components/ui/SectionHeading';
import { projects } from '@/data';
import { Project } from '@/types';

const categories = ['All', 'Web', 'AI'];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
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
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>

        <SectionHeading title="Production Projects &amp; Case Studies" subtitle="Engineering Portfolio" />

        {/* Search & Filter Controls */}
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
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-lg shadow-violet-500/10'
                    : 'text-white/40 hover:text-white/80 border border-white/[0.06]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -6 }}
              className="group rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-56 bg-gradient-to-br from-violet-950/40 via-neutral-900 to-fuchsia-950/40 overflow-hidden p-6 flex flex-col justify-between border-b border-white/[0.06]">
                <div className="flex justify-between items-center z-10">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-violet-300 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                    {project.category}
                  </span>
                  <div className="flex gap-2">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-white/10 text-white hover:bg-violet-500/30 transition-all"
                      aria-label="Live Demo"
                    >
                      <ExternalLink size={16} />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-white/10 text-white hover:bg-violet-500/30 transition-all"
                      aria-label="GitHub Repository"
                    >
                      <GitBranch size={16} />
                    </a>
                  </div>
                </div>

                <div className="relative z-10 flex items-center gap-3">
                  <Folder className="w-10 h-10 text-violet-400" />
                  <h3 className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors">
                    {project.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-white/60 leading-relaxed mb-6">
                    {project.description}
                  </p>

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

                {project.caseStudy && (
                  <button
                    onClick={() => setSelectedCaseStudy(project)}
                    className="w-full py-2.5 px-4 rounded-xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <BookOpen size={14} /> Read Case Study &amp; Architecture
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

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
                    {selectedCaseStudy.caseStudy.architecture.map((arch) => (
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
