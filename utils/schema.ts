import { siteConfig } from './seo';

// ============================================================
// JSON-LD Structured Data Generators
// Schema.org compliant structured data for SEO
// ============================================================

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteConfig.url}/#person`,
    name: siteConfig.author.name,
    url: siteConfig.url,
    email: siteConfig.author.email,
    jobTitle: siteConfig.author.jobTitle,
    description: siteConfig.author.description,
    image: `${siteConfig.url}/og-image.png`,
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
      siteConfig.social.instagram,
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.state,
      addressCountry: siteConfig.location.countryCode,
    },
    knowsAbout: [
      'Full Stack Development',
      'Artificial Intelligence',
      'Machine Learning',
      'React',
      'Next.js',
      'TypeScript',
      'Python',
      'Node.js',
      'UI/UX Design',
      'Cloud Computing',
      'DevOps',
      'API Development',
    ],
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      '@id': `${siteConfig.url}/#person`,
    },
    inLanguage: siteConfig.language,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: `${siteConfig.name} — Software Development`,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    founder: {
      '@id': `${siteConfig.url}/#person`,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: siteConfig.author.email,
      contactType: 'customer service',
      availableLanguage: ['English'],
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.state,
      addressCountry: siteConfig.location.countryCode,
    },
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
      siteConfig.social.instagram,
    ],
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateServiceSchema(
  name: string,
  description: string,
  category: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteConfig.url}/#service-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    description,
    provider: {
      '@id': `${siteConfig.url}/#person`,
    },
    serviceType: category,
    areaServed: {
      '@type': 'Country',
      name: siteConfig.location.country,
    },
  };
}

export function generateProjectSchema(
  name: string,
  description: string,
  url: string,
  technologies: string[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url,
    author: {
      '@id': `${siteConfig.url}/#person`,
    },
    keywords: technologies.join(', '),
    dateCreated: new Date().toISOString().split('T')[0],
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateProfilePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${siteConfig.url}/#profilepage`,
    name: `${siteConfig.name} — Portfolio`,
    url: siteConfig.url,
    description: siteConfig.description,
    mainEntity: {
      '@id': `${siteConfig.url}/#person`,
    },
    dateCreated: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: siteConfig.language,
  };
}

// Generate all schemas for the homepage
export function generateHomePageSchemas() {
  return [
    generatePersonSchema(),
    generateWebsiteSchema(),
    generateOrganizationSchema(),
    generateProfilePageSchema(),
    generateBreadcrumbSchema([
      { name: 'Home', url: siteConfig.url },
    ]),
    generateFAQSchema([
      {
        question: 'What services does Abishek offer?',
        answer:
          'Abishek offers Full Stack Web Development, AI Automation, UI/UX Design, and API Development services using modern technologies like Next.js, React, TypeScript, Python, and machine learning frameworks.',
      },
      {
        question: 'What technologies does Abishek specialize in?',
        answer:
          'Abishek specializes in Next.js, React, TypeScript, Node.js, Python, TensorFlow, PostgreSQL, MongoDB, Docker, AWS, and various AI/ML frameworks.',
      },
      {
        question: 'How can I hire Abishek for a project?',
        answer:
          `You can reach out to Abishek through the contact form on this website, via email at ${siteConfig.author.email}, or connect on LinkedIn and GitHub.`,
      },
      {
        question: 'Where is Abishek located?',
        answer:
          'Abishek is based in Tiruvannamalai, Tamil Nadu, India, and is available for remote work worldwide.',
      },
    ]),
  ];
}
