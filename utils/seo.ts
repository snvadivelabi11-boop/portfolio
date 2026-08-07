// ============================================================
// SEO Configuration — Enterprise-Level SEO Architecture
// Authentic Personal Brand for Abishek
// ============================================================

import { getSiteSettings } from '@/lib/siteSettings';

export const siteConfig = {
  name: 'Abishek',
  title: 'Abishek | Full Stack Developer & AI Creator',
  description:
    'Abishek is a Full Stack Developer & AI Creator based in Tiruvannamalai. Specializing in Next.js, React, TypeScript, Python, AI Automation, API Development, and UI/UX Design.',
  shortDescription:
    'Full Stack Developer & AI Creator crafting exceptional digital experiences.',
  url: 'https://abishek.dev',
  ogImage: '/og-image.png',
  locale: 'en_US',
  language: 'en',
  author: {
    name: 'Abishek',
    email: 'SNVADIVEL11@gmail.com',
    phone: '9786801597',
    url: 'https://abishek.dev',
    jobTitle: 'Full Stack Developer & AI Creator',
    description:
      'Full Stack Developer and AI Creator from Tiruvannamalai with expertise in modern web development, Next.js, React, TypeScript, AI Automation, and API development.',
  },
  social: {
    github: 'https://github.com/snvadivelabi11-boop',
    linkedin: 'https://www.linkedin.com/in/abishek-v-a984a6382',
    twitter: '',
    instagram: 'https://www.instagram.com/abishek_creator_/',
  },
  location: {
    city: 'Tiruvannamalai',
    state: 'Tamil Nadu',
    country: 'India',
    countryCode: 'IN',
  },
  stats: {
    experience: '',
    projectsCompleted: '',
    clients: '',
    awards: '',
  },
  keywords: {
    primary: [
      'Abishek',
      'Abishek Portfolio',
      'Abishek Developer',
      'Full Stack Developer',
      'AI Developer',
      'AI Automation Engineer',
      'Next.js Developer',
      'React Developer',
      'Web Developer',
      'Software Engineer',
    ],
    secondary: [
      'Portfolio Website',
      'Modern Portfolio',
      'Enterprise Portfolio',
      'Professional Developer',
      'AI Engineer',
      'Frontend Developer',
      'Backend Developer',
      'TypeScript Developer',
      'UI UX Developer',
    ],
    long_tail: [
      'Full Stack Developer Tiruvannamalai',
      'AI Creator Tamil Nadu India',
      'Next.js React Developer India',
      'AI Automation Engineer Portfolio',
      'Freelance Full Stack Developer',
    ],
  },
  verification: {
    google: '',
    bing: '',
    yandex: '',
  },
  analytics: {
    googleAnalyticsId: '',
    clarityId: '',
  },
} as const;

export type SiteConfig = typeof siteConfig;

export function getAllKeywords(): string[] {
  return [
    ...siteConfig.keywords.primary,
    ...siteConfig.keywords.secondary,
    ...siteConfig.keywords.long_tail,
  ];
}

export function getCanonicalUrl(path: string = ''): string {
  return `${siteConfig.url}${path}`;
}

export async function getDynamicSiteConfig() {
  const live = await getSiteSettings();
  return {
    ...siteConfig,
    author: {
      ...siteConfig.author,
      email: live?.personal?.email || siteConfig.author.email,
      phone: live?.personal?.phone || siteConfig.author.phone,
      name: live?.personal?.name || siteConfig.author.name,
      jobTitle: live?.personal?.title || siteConfig.author.jobTitle,
    },
    social: {
      github: live?.socials?.github || siteConfig.social.github,
      linkedin: live?.socials?.linkedin || siteConfig.social.linkedin,
      instagram: live?.socials?.instagram || siteConfig.social.instagram,
      twitter: live?.socials?.twitter || siteConfig.social.twitter,
    },
  };
}
