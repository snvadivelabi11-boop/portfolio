import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Abishek — Full Stack Developer & AI Automation Engineer',
    short_name: 'Abishek',
    description:
      'Portfolio of Abishek — Full Stack Developer, AI Automation Engineer, and Software Engineer specializing in modern web technologies and AI-driven solutions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#8b5cf6',
    orientation: 'portrait-primary',
    categories: ['portfolio', 'technology', 'development'],
    lang: 'en',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
