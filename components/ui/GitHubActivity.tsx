'use client';

import { motion } from 'framer-motion';
import { GitBranch, GitCommit, GitPullRequest } from 'lucide-react';

export default function GitHubActivity() {
  // 52-week contribution heat grid simulation
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <GitBranch size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">GitHub Open Source Telemetry</h3>
            <p className="text-xs text-white/40">Continuous Open Source &amp; Software Commits</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-violet-300 font-mono">
          <span className="flex items-center gap-1"><GitCommit size={14} /> 450+ Commits</span>
          <span className="flex items-center gap-1"><GitPullRequest size={14} /> 30+ Pull Requests</span>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[650px]">
          <div className="flex justify-between text-[10px] text-white/40 font-mono mb-2 px-1">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>

          <div className="grid grid-flow-col grid-rows-7 gap-1">
            {Array.from({ length: 364 }).map((_, i) => {
              // Activity intensity pattern
              const intensity = (i * 7) % 13;
              let bg = 'bg-white/[0.04]';
              if (intensity > 9) bg = 'bg-violet-500';
              else if (intensity > 6) bg = 'bg-violet-600/80';
              else if (intensity > 3) bg = 'bg-violet-800/50';

              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.5 }}
                  className={`w-2.5 h-2.5 rounded-sm ${bg} transition-colors`}
                  title={`Commit Activity — Day ${i + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
