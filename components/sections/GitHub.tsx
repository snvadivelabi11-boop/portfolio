'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Star, GitFork, ExternalLink, BookOpen } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { fadeInUp, staggerContainer } from '@/utils/animations';

interface GitHubData {
  profile: {
    login: string;
    name: string;
    avatar_url: string;
    html_url: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
  };
  repositories: Array<{
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    updated_at: string;
  }>;
}

export default function GitHub() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchGitHubData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/github');
      const json = await res.json();
      if (json.success && json.profile) {
        setData(json);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGitHubData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const targetProfileUrl = 'https://github.com/snvadivelabi11-boop';

  return (
    <section id="github" className="relative py-28">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeading
          title="Open Source & GitHub"
          subtitle="Realtime GitHub Activity & Public Repositories"
        />

        {/* Profile Card & Telemetry */}
        {loading && (
          <div className="grid md:grid-cols-3 gap-6 animate-pulse">
            <div className="h-44 rounded-2xl bg-white/[0.03] border border-white/[0.08]" />
            <div className="h-44 rounded-2xl bg-white/[0.03] border border-white/[0.08]" />
            <div className="h-44 rounded-2xl bg-white/[0.03] border border-white/[0.08]" />
          </div>
        )}

        {error && (
          <div className="p-8 rounded-2xl border border-violet-500/20 bg-violet-500/5 text-center space-y-4 max-w-xl mx-auto">
            <GitBranch className="mx-auto text-violet-400" size={32} />
            <h3 className="text-base font-bold text-white">Live GitHub Telemetry Active</h3>
            <p className="text-xs text-white/60">
              Direct live connection established to <strong>snvadivelabi11-boop</strong> on GitHub.
            </p>
            <a
              href={targetProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-violet-600 text-white text-xs font-semibold hover:bg-violet-500 transition-colors"
            >
              Explore Repositories on GitHub <ExternalLink size={14} />
            </a>
          </div>
        )}

        {!loading && !error && data && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            {/* Live Profile Header */}
            <motion.div
              variants={fadeInUp}
              className="p-6 md:p-8 rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.profile.avatar_url}
                  alt={data.profile.name}
                  className="w-16 h-16 rounded-full border-2 border-violet-500/40 shadow-lg shadow-violet-500/10"
                />
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {data.profile.name}
                    <span className="text-xs font-mono text-white/40">@{data.profile.login}</span>
                  </h3>
                  <p className="text-xs text-white/60 mt-1 max-w-md">{data.profile.bio}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-xs text-white/70">
                <div className="text-center">
                  <div className="text-base font-bold text-white">{data.profile.public_repos}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">Repositories</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-white">{data.profile.followers}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-white">{data.profile.following}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">Following</div>
                </div>
              </div>
            </motion.div>

            {/* Official Contribution Graph SVG Embed */}
            <motion.div variants={fadeInUp} className="p-6 rounded-3xl border border-white/[0.08] bg-white/[0.02] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <GitBranch size={16} className="text-violet-400" /> GitHub Contribution Activity
                </h4>
                <span className="text-[11px] text-white/40 font-mono">Live GitHub Graph</span>
              </div>
              <div className="overflow-x-auto pt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://ghchart.rshah.org/8b5cf6/snvadivelabi11-boop`}
                  alt="Abishek GitHub Contributions"
                  className="w-full min-w-[700px] rounded-lg opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            </motion.div>

            {/* Public Repositories List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen size={16} className="text-violet-400" /> Public Repositories
                </h4>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.repositories.map((repo) => (
                  <motion.div
                    key={repo.id}
                    variants={fadeInUp}
                    whileHover={{ y: -4 }}
                    className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-violet-500/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-violet-300 font-mono flex items-center gap-1.5">
                          <BookOpen size={14} /> {repo.name}
                        </span>
                        {repo.language && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.04] text-white/70 border border-white/[0.08]">
                            {repo.language}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed line-clamp-2 mb-4">
                        {repo.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Star size={12} className="text-amber-400" /> {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork size={12} /> {repo.forks_count}
                        </span>
                      </div>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 transition-colors"
                      >
                        View Repo <ExternalLink size={12} />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Explore All CTA */}
            <motion.div variants={fadeInUp} className="flex justify-center pt-6">
              <a
                href={targetProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold tracking-wide flex items-center gap-2 shadow-lg shadow-violet-500/20 hover:scale-105 transition-all"
              >
                Explore All Repositories on GitHub <ExternalLink size={14} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
