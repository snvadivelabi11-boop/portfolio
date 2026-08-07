'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, ThumbsUp, ArrowLeft, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';
import SectionHeading from '@/components/ui/SectionHeading';
import { blogPosts as defaultBlogPosts } from '@/data/blogs';
import { useLiveBlogs } from '@/hooks/useFirestoreCMS';

const categories = ['All', 'Engineering', 'AI', 'Architecture', 'Performance'];

export default function BlogCatalog() {
  const { blogs: liveBlogs } = useLiveBlogs();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const postsList = liveBlogs.length > 0 ? liveBlogs : defaultBlogPosts;

  const filteredPosts = postsList.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Back to Portfolio Home
          </Link>
        </div>

        <SectionHeading title="Engineering Insights &amp; Articles" subtitle="Abishek Tech Blog" />

        {/* Search & Category Filter */}
        <div className="max-w-3xl mx-auto mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by keyword, tech stack, or topic..."
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

        {/* Blog Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <motion.article
              key={post.id}
              whileHover={{ y: -6 }}
              className="group rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl p-6 flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-white/40 mb-4">
                  <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-semibold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {post.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-white/60 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-white/40 flex items-center gap-1 font-mono">
                  <ThumbsUp size={12} className="text-violet-400" /> {post.likes} Likes
                </span>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-violet-400 font-semibold flex items-center gap-1 group-hover:text-violet-300 transition-colors"
                >
                  Read Article <ArrowUpRight size={14} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
