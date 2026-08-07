export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Engineering' | 'AI' | 'Architecture' | 'Performance';
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  likes: number;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'building-scalable-ai-automation-pipelines-nextjs-15',
    title: 'Building Scalable AI Automation Pipelines with Next.js 15 & OpenAI',
    excerpt:
      'Learn how to architect asynchronous, resilient AI automation workflows using Next.js 15 App Router server actions, Edge handlers, and LangChain.',
    category: 'AI',
    readTime: '6 min read',
    publishedAt: '2025-01-15',
    author: {
      name: 'Abishek',
      role: 'Full Stack Developer & AI Creator',
      avatar: 'A',
    },
    tags: ['Next.js 15', 'OpenAI', 'AI Automation', 'TypeScript', 'Server Actions'],
    likes: 42,
    featured: true,
    content: `
# Building Scalable AI Automation Pipelines with Next.js 15 & OpenAI

Artificial intelligence is rapidly shifting from passive text generation to **autonomous workflow execution**. In this post, I explore how we can leverage **Next.js 15 App Router** and **OpenAI function calling** to build production-ready automation engines.

---

## The Architecture Overview

When building AI pipelines, traditional synchronous HTTP request models often hit gateway timeouts. We solve this by decoupling execution into three layers:

1. **Trigger Layer**: Next.js Server Components & Route Handlers with Zod input validation.
2. **Orchestration Layer**: LangChain agent loops with structured tool invocation.
3. **Storage & Audit Layer**: PostgreSQL (via Supabase / Prisma) logging every agent decision step for security and observability.

\`\`\`typescript
import { OpenAI } from 'openai';
import { z } from 'zod';

const TaskSchema = z.object({
  prompt: z.string().min(5),
  maxSteps: z.number().default(5),
});

export async function executeAutomation(input: unknown) {
  const { prompt, maxSteps } = TaskSchema.parse(input);
  // Autonomous execution pipeline logic
  return { status: 'completed', stepsExecuted: maxSteps };
}
\`\`\`

---

## Performance & Optimization

- **Streaming Responses**: Utilize Server-Sent Events (SSE) or React Server Components streaming to render partial agent thoughts instantly.
- **Rate Limiting**: Protect backend API endpoints using token bucket rate limiters to prevent runaway OpenAI billing spikes.
- **Fail-Safe Fallbacks**: Always provide deterministic retry limits to ensure agent loops never enter infinite state recursion.

---

## Conclusion

By combining Next.js 15's streaming architecture with type-safe agent execution, developers can deliver AI tools that feel instantaneous, reliable, and deeply integrated into enterprise workflows.
    `,
  },
  {
    id: 'post-2',
    slug: 'achieving-100-100-lighthouse-core-web-vitals-nextjs',
    title: 'Achieving 100/100 Core Web Vitals in Next.js 15: A Practical Guide',
    excerpt:
      'A deep dive into LCP, CLS, and INP optimizations. How to eliminate layout shifts, optimize font loading, and minimize client-side bundle weight.',
    category: 'Performance',
    readTime: '8 min read',
    publishedAt: '2025-01-28',
    author: {
      name: 'Abishek',
      role: 'Full Stack Developer & AI Creator',
      avatar: 'A',
    },
    tags: ['Performance', 'Core Web Vitals', 'Next.js', 'CSS', 'Lighthouse'],
    likes: 38,
    featured: false,
    content: `
# Achieving 100/100 Core Web Vitals in Next.js 15

Web performance directly correlates with user conversion rates and search engine rankings. In this technical walkthrough, we break down exact techniques to achieve a perfect 100 score across all Lighthouse metrics.

---

## 1. Cumulative Layout Shift (CLS) Elimination

Layout shifts ruin user experience. To guarantee **CLS = 0**:

- Always define explicit width/height ratios or aspect-ratio CSS utilities for image containers.
- Reserve static font fallback height using \`next/font\` CSS variable loading.
- Avoid dynamically prepending un-sized elements above the fold.

---

## 2. Largest Contentful Paint (LCP) Acceleration

- **Preconnect Critical Origins**: Add \`preconnect\` tags for font & analytics domains.
- **Image Priority**: Use \`priority\` props on hero images so they load before deferred JavaScript scripts.
- **AVIF / WebP Formats**: Configure Next.js \`images.formats: ['image/avif', 'image/webp']\` for 40% compression improvements.

---

## Summary

Performance is an ongoing engineering discipline, not a one-off task. By enforcing automated Lighthouse audits in CI/CD, we maintain sub-second speed consistently.
    `,
  },
  {
    id: 'post-3',
    slug: 'enterprise-security-best-practices-modern-web-apps',
    title: 'Enterprise Security Architecture for Modern Web Applications',
    excerpt:
      'Protecting web applications against OWASP Top 10 vulnerabilities. A guide to CSRF prevention, XSS escaping, rate limiting, and strict CSP headers.',
    category: 'Architecture',
    readTime: '7 min read',
    publishedAt: '2025-02-02',
    author: {
      name: 'Abishek',
      role: 'Full Stack Developer & AI Creator',
      avatar: 'A',
    },
    tags: ['Security', 'OWASP', 'TypeScript', 'Headers', 'Zod'],
    likes: 29,
    featured: false,
    content: `
# Enterprise Security Architecture for Modern Web Applications

Security must be designed into application architecture from day one. In this article, I discuss key security defensive mechanisms implemented across full-stack TypeScript projects.

---

## Defense in Depth

1. **Strict Input Sanitization**: Validate every incoming payload at edge routes using Zod schemas before touch points reach the database.
2. **Content Security Policy (CSP)**: Restrict inline script execution and enforce strict origin directives.
3. **HTTP Strict Transport Security (HSTS)**: Mandate HTTPS with 2-year max-age header configurations.

\`\`\`typescript
// Zod input validation
const ContactSchema = z.object({
  email: z.string().email(),
  message: z.string().max(2000),
});
\`\`\`

---

## Conclusion

Security is about defense in depth. Combining strong typing, Zod schema validation, secure headers, and strict authentication ensures enterprise resilience.
    `,
  },
];
