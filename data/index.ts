import {
  SkillCategory,
  ProjectCategory,
  Project,
  Service,
  Experience,
  Education,
  ContactInfo,
  NavLink,
} from '@/types';

export const projectCategories: ProjectCategory[] = [
  {
    id: 'college-education',
    title: 'College / Education Projects',
    subtitle: 'EdTech, Academic Tools & Campus Portals',
    description: 'Academic automation, campus management systems, and research tools engineered with Next.js, Python, and modern web stack.',
    icon: 'GraduationCap',
  },
  {
    id: 'app-platform',
    title: 'App / Platform Projects',
    subtitle: 'Web Apps, SaaS Platforms & Commerce',
    description: 'Full-stack web applications, SaaS platforms, telemetry dashboards, and modern digital commerce storefronts.',
    icon: 'Layout',
  },
  {
    id: 'ai-automation',
    title: 'AI / Automation Systems',
    subtitle: 'Autonomous AI Agents & RAG Pipelines',
    description: 'Intelligent multi-step LLM workflows, autonomous agent orchestration, and vector embedding RAG document summarizers.',
    icon: 'Bot',
  },
];

export const projects: Project[] = [
  {
    id: 1,
    title: 'AI Workflow Automation Hub',
    description:
      'A full-stack AI automation platform built with Next.js 15, TypeScript, OpenAI API, and Supabase. Enables users to construct custom multi-step AI prompts, automate document processing, and trigger Webhook flows.',
    image: '/projects/project1.jpg',
    technologies: ['Next.js 15', 'TypeScript', 'OpenAI API', 'Supabase', 'Tailwind CSS'],
    liveUrl: 'https://www.abishektech.online',
    githubUrl: 'https://github.com/snvadivelabi11-boop/ai-workflow-automation-hub',
    category: 'AI',
    categorySlug: 'ai-automation',
    caseStudy: {
      problem: 'Manual content processing required hours of repetitive workflow execution across multiple tools.',
      solution: 'Architected a multi-step agent pipeline using OpenAI LLM function calling and serverless workers.',
      impact: 'Reduced processing time by 85% and automated over 5,000 monthly tasks for early beta users.',
      architecture: ['Next.js App Router', 'Supabase Postgres', 'Zod Validation', 'Edge Handlers'],
    },
  },
  {
    id: 2,
    title: 'Enterprise Analytics & Visitor Monitor',
    description:
      'Real-time traffic and visitor telemetry dashboard featuring interactive charts, device/browser breakdown, live online counter, and audit log tracking.',
    image: '/projects/project2.jpg',
    technologies: ['React', 'Next.js', 'Recharts', 'PostgreSQL', 'Framer Motion'],
    liveUrl: 'https://www.abishektech.online',
    githubUrl: 'https://github.com/snvadivelabi11-boop/enterprise-visitor-telemetry',
    category: 'Web',
    categorySlug: 'app-platform',
    caseStudy: {
      problem: 'Heavy third-party analytics scripts damaged site performance and compromised visitor privacy.',
      solution: 'Built an in-house privacy-first telemetry serverless pipeline with lightweight payload size.',
      impact: 'Zero performance overhead while delivering real-time metrics with sub-10ms response time.',
      architecture: ['Next.js Server Components', 'In-memory Cache', 'Recharts Telemetry', 'CSRF Protection'],
    },
  },
  {
    id: 3,
    title: 'Modern E-Commerce Storefront',
    description:
      'Ultra-fast digital commerce storefront with instant search filtering, cart state management, checkout integration, and custom luxury dark styling.',
    image: '/projects/project3.jpg',
    technologies: ['Next.js 15', 'Tailwind CSS', 'Zustand', 'Stripe API', 'TypeScript'],
    liveUrl: 'https://www.abishektech.online',
    githubUrl: 'https://github.com/snvadivelabi11-boop/modern-ecommerce-storefront',
    category: 'Web',
    categorySlug: 'app-platform',
    caseStudy: {
      problem: 'Traditional commerce templates felt sluggish with layout shifts during image loading.',
      solution: 'Implemented strict image height reservations, optimistic UI state updates, and static regeneration.',
      impact: 'Achieved 99/100 Lighthouse performance score and sub-1s page loads.',
      architecture: ['Next.js Static Generation', 'Tailwind v4', 'Optimistic UI', 'Stripe Webhooks'],
    },
  },
  {
    id: 4,
    title: 'Intelligent AI Document Summarizer',
    description:
      'AI-powered document analysis application that ingests PDFs, extracts key takeaways, generates structured JSON summaries, and offers RAG semantic search.',
    image: '/projects/project4.jpg',
    technologies: ['Python', 'FastAPI', 'LangChain', 'Next.js', 'PostgreSQL'],
    liveUrl: 'https://www.abishektech.online',
    githubUrl: 'https://github.com/snvadivelabi11-boop/ai-document-summarizer',
    category: 'AI',
    categorySlug: 'ai-automation',
    caseStudy: {
      problem: 'Extracting structured data from long legal and technical documents was slow and prone to human oversight.',
      solution: 'Created a chunking and vector embedding search pipeline backed by OpenAI text-embedding models.',
      impact: 'Sub-second document query responses with 98% extraction accuracy.',
      architecture: ['Python FastAPI Backend', 'LangChain RAG', 'Next.js UI', 'Pgvector'],
    },
  },
  {
    id: 5,
    title: 'Campus Academic Management System',
    description:
      'Full-stack education portal for academic tracking, course registration, attendance logging, and student progress telemetry.',
    image: '/projects/project1.jpg',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Prisma'],
    liveUrl: 'https://www.abishektech.online',
    githubUrl: 'https://github.com/snvadivelabi11-boop/academic-management-portal',
    category: 'Education',
    categorySlug: 'college-education',
    caseStudy: {
      problem: 'Legacy academic portals suffered from slow database queries and fragmented user interfaces.',
      solution: 'Architected a streamlined Next.js dashboard with optimized Prisma SQL queries and real-time alerts.',
      impact: 'Improved page load speed by 70% and enabled instant attendance tracking for 1,200+ students.',
      architecture: ['Next.js App Router', 'Prisma ORM', 'PostgreSQL', 'Tailwind CSS'],
    },
  },
];

export const navLinks: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

export const personalStats = {
  yearsExperience: '',
  projectsCompleted: '10+',
  clientsCount: '',
  awardsCount: '',
  location: 'Tiruvannamalai, Tamil Nadu, India',
  email: 'snvadivelabi11@gmail.com',
  phone: '9786801597',
};

export const aboutContent = {
  whoIAm:
    'I am Abishek — a Full Stack Developer and AI Creator based in Tiruvannamalai. I engineer production-grade web applications and AI tools, helping clients transform ambitious ideas into high-performing digital systems.',
  technologies:
    'My core tech stack revolves around Next.js, React, TypeScript, Node.js, Python, PostgreSQL, Supabase, Tailwind CSS, and modern AI automation frameworks like LangChain and OpenAI APIs.',
  vision:
    'My vision is to bridge modern web engineering with cutting-edge artificial intelligence, building autonomous, elegant, and lightning-fast digital products that solve real-world challenges.',
  learningJourney:
    'Continuous learning is my core ethos. Every single day I explore emerging web standards, high-performance database architectures, LLM orchestration, and modern UI/UX design patterns.',
  whyWorkWithMe:
    'Clients choose to work with me because I combine engineering discipline with creative product design. I deliver clean, type-safe, production-ready code with zero fluff, rapid turnarounds, and relentless focus on user experience.',
};

export const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    icon: 'Monitor',
    skills: [
      { name: 'React / Next.js 15', icon: 'Code2' },
      { name: 'TypeScript', icon: 'FileCode' },
      { name: 'Tailwind CSS', icon: 'Palette' },
      { name: 'Framer Motion & GSAP', icon: 'Sparkles' },
    ],
  },
  {
    title: 'Backend',
    icon: 'Server',
    skills: [
      { name: 'Node.js & Express', icon: 'Cpu' },
      { name: 'Python & FastAPI', icon: 'Terminal' },
      { name: 'REST & GraphQL APIs', icon: 'Zap' },
      { name: 'Serverless / Edge Routes', icon: 'GitBranch' },
    ],
  },
  {
    title: 'Database',
    icon: 'Database',
    skills: [
      { name: 'PostgreSQL', icon: 'Database' },
      { name: 'MongoDB', icon: 'HardDrive' },
      { name: 'Supabase', icon: 'Zap' },
      { name: 'Prisma ORM', icon: 'Layers' },
    ],
  },
  {
    title: 'Cloud',
    icon: 'Cloud',
    skills: [
      { name: 'Vercel Deployment', icon: 'Cloud' },
      { name: 'AWS Services', icon: 'Server' },
      { name: 'Cloudflare Workers', icon: 'Zap' },
      { name: 'Docker Containers', icon: 'Container' },
    ],
  },
  {
    title: 'AI & Automation',
    icon: 'Brain',
    skills: [
      { name: 'OpenAI API & LLMs', icon: 'Bot' },
      { name: 'LangChain & Vector DBs', icon: 'Link' },
      { name: 'Python Automation', icon: 'Brain' },
      { name: 'Autonomous AI Agents', icon: 'Sparkles' },
    ],
  },
  {
    title: 'DevOps',
    icon: 'Settings',
    skills: [
      { name: 'Git & GitHub Workflows', icon: 'GitBranch' },
      { name: 'CI/CD Pipelines', icon: 'RefreshCw' },
      { name: 'Linux System Admin', icon: 'Terminal' },
      { name: 'Performance Audit & Monitoring', icon: 'Activity' },
    ],
  },
  {
    title: 'Security',
    icon: 'Shield',
    skills: [
      { name: 'JWT & Session Auth', icon: 'ShieldCheck' },
      { name: 'CSRF & XSS Prevention', icon: 'Lock' },
      { name: 'Input Validation (Zod)', icon: 'CheckCircle' },
      { name: 'Rate Limiting & OWASP', icon: 'Key' },
    ],
  },
];

export const services: Service[] = [
  {
    icon: 'Globe',
    title: 'Website Development',
    description:
      'Crafting high-speed, SEO-mastered responsive websites with Next.js 15, Tailwind CSS, and smooth micro-animations that captivate visitors.',
    features: [
      'Responsive Glassmorphism UI',
      'Core Web Vitals Optimization',
      'Enterprise SEO Architecture',
      'Modern Animations & Micro-interactions',
    ],
  },
  {
    icon: 'Cpu',
    title: 'Full Stack Development',
    description:
      'Architecting end-to-end full-stack web applications featuring type-safe backend systems, secure databases, real-time sync, and fluid frontend UX.',
    features: [
      'Next.js App Router Architecture',
      'Type-Safe Database Integration',
      'Secure User Authentication',
      'Realtime State Synchronization',
    ],
  },
  {
    icon: 'Brain',
    title: 'AI Automation',
    description:
      'Designing custom AI workflows, autonomous agent systems, and OpenAI integration to automate repetitive tasks and power intelligent applications.',
    features: [
      'OpenAI & LLM Integration',
      'Automated Data Processing',
      'Custom AI Agent Pipelines',
      'Vector Search & RAG Systems',
    ],
  },
  {
    icon: 'Zap',
    title: 'API Development',
    description:
      'Building robust, high-performance, and secure RESTful & GraphQL APIs with Zod validation, rate limiting, and comprehensive documentation.',
    features: [
      'REST & GraphQL Endpoint Design',
      'Strict Zod Input Validation',
      'Rate Limiting & Token Auth',
      'Interactive OpenAPI Documentation',
    ],
  },
  {
    icon: 'Palette',
    title: 'UI/UX Design',
    description:
      'Creating pixel-perfect, modern dark-themed user interfaces inspired by Apple, Stripe, Linear, and Vercel design languages.',
    features: [
      'Linear & Apple Aesthetic',
      'Custom Design System Tokens',
      'Interactive Prototyping',
      'WCAG AA Accessibility',
    ],
  },
  {
    icon: 'Activity',
    title: 'Performance Optimization',
    description:
      'Auditing and transforming slow applications into 100/100 Lighthouse scored engines through code splitting, bundle minimization, and edge caching.',
    features: [
      '100/100 Core Web Vitals Focus',
      'Bundle Size Reduction',
      'LCP & CLS Optimization',
      'Edge & CDN Cache Strategies',
    ],
  },
];



export const experiences: Experience[] = [
  {
    id: 1,
    role: 'Full Stack Developer & AI Creator',
    company: 'Independent & Freelance Projects',
    duration: '',
    description:
      'Architecting high-performance web applications, AI automation tools, and custom client software. Successfully delivered 10+ projects for 2-3 clients with focus on Next.js, TypeScript, and AI integrations.',
    technologies: ['Next.js 15', 'React', 'TypeScript', 'Node.js', 'Python', 'AI Automation', 'Supabase'],
  },
];

export const education: Education[] = [
  {
    id: 1,
    degree: 'Bachelor Degree in Computer Science / Technology',
    institution: 'Higher Education Institute',
    duration: '',
    description:
      'Comprehensive study in software engineering, database management systems, data structures, algorithms, and web technologies.',
  },
];

export const realAwards = [
  {
    id: 1,
    title: 'Excellence in AI & Web Innovation Award',
    issuer: 'Regional Developer Tech Showcase',
    year: '',
    description: 'Awarded for outstanding technical execution in full-stack web development and AI workflow automation.',
  },
];

export const contactInfo: ContactInfo = {
  email: personalStats.email,
  phone: personalStats.phone,
  location: personalStats.location,
  socials: [
    { name: 'GitHub — Open Source Profile', url: 'https://github.com/snvadivelabi11-boop', icon: 'GitBranch' },
    { name: 'LinkedIn — Professional Profile', url: 'https://www.linkedin.com/in/abishek-v-a984a6382', icon: 'Link' },
    { name: 'Instagram — Creator Profile', url: 'https://www.instagram.com/abishek_creator_/', icon: 'Instagram' },
  ],
};
