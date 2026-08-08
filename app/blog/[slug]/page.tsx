import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, ThumbsUp, Calendar } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';
import JsonLd from '@/components/seo/JsonLd';
import { blogPosts } from '@/data/blogs';
import { siteConfig } from '@/utils/seo';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    return { title: 'Article Not Found' };
  }

  return {
    title: `${post.title} | Abishek Digital Blog`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [siteConfig.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt.includes('T') ? post.publishedAt : `${post.publishedAt}T00:00:00+05:30`,
    dateModified: post.publishedAt.includes('T') ? post.publishedAt : `${post.publishedAt}T00:00:00+05:30`,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/og-image.png`,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <JsonLd data={articleSchema} />
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Back to Blog Articles
          </Link>
        </div>

        {/* Meta Header */}
        <header className="mb-10 pb-8 border-b border-white/[0.08]">
          <div className="flex flex-wrap items-center gap-3 text-xs mb-4">
            <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-semibold uppercase tracking-wider font-mono">
              {post.category}
            </span>
            <span className="text-white/40 flex items-center gap-1">
              <Calendar size={12} /> {new Date(post.publishedAt).toLocaleDateString()}
            </span>
            <span className="text-white/40 flex items-center gap-1">
              <Clock size={12} /> {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-white shadow-lg">
              {post.author.avatar}
            </div>
            <div>
              <div className="text-xs font-bold text-white">{post.author.name}</div>
              <div className="text-[11px] text-white/40">{post.author.role}</div>
            </div>
          </div>
        </header>

        {/* Body Content */}
        <article className="prose prose-invert prose-violet max-w-none space-y-6 text-sm text-white/80 leading-relaxed font-sans">
          <div className="p-6 rounded-2xl border border-violet-500/20 bg-violet-500/[0.03] text-violet-200 font-medium leading-relaxed">
            {post.excerpt}
          </div>

          <div className="whitespace-pre-line">
            {post.content}
          </div>
        </article>

        {/* Tags & Actions */}
        <footer className="mt-12 pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full text-[11px] font-medium bg-white/[0.04] text-white/60 border border-white/[0.08]">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-violet-300 flex items-center gap-1">
              <ThumbsUp size={14} /> {post.likes} Likes
            </span>
          </div>
        </footer>
      </main>

      <Footer />
    </div>
  );
}
