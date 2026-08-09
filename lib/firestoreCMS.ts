import { db } from '@/lib/firebase';
import {
  doc, setDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, onSnapshot
} from 'firebase/firestore';

// 1. Data Interfaces
export interface ProfileData {
  profileImage?: string;
  profilePhoto?: string;
  fullName: string;
  jobTitle: string;
  headline?: string;
  location: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  status?: string;
  yearsExperience: number;
  projectsDelivered: number;
  clientsCount: number;
}

export interface HeroData {
  name: string;
  title: string;
  titles: string[];
  description: string;
  location: string;
  email: string;
  phone: string;
  profilePhoto: string;
  ctaText: string;
  secondaryCtaText: string;
}

export interface AboutData {
  bio: string;
  description: string;
  whoIAm?: string;
  whoAreYou?: string;
  tellAboutYourself?: string;
  mission?: string;
  vision?: string;
  learningJourney?: string;
  whyHireYou?: string;
  whyWorkWithMe?: string;
  technologies?: string;
  currentlyLearning?: string;
  careerObjective?: string;
  shortDescription?: string;
  longDescription?: string;
  subtitle?: string;
  profilePhoto?: string;
  resumeUrl?: string;
  profileStatus?: string;
  yearsExperience: number;
  projectsCompleted: number;
  clientsCount: number;
  awardsCount: number;
  highlights: string[];
  achievements?: string[];
}

export interface SkillItem {
  id?: string;
  category: string;
  name: string;
  icon?: string;
  color?: string;
  order?: number;
}

export interface ServiceItem {
  id?: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface ProjectCategoryRecord {
  id: string; // Slug ID e.g. "college-education", "app-platform", "ai-automation"
  title: string; // Display Name e.g. "College / Education Projects"
  subtitle?: string;
  description?: string;
  icon?: string; // Lucide icon e.g. "GraduationCap", "Layout", "Bot"
  order?: number;
  createdAt?: string;
}

export interface ProjectItem {
  id?: string;
  title: string;
  description: string;
  details?: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  category: string;
  categorySlug?: string;
  featured: boolean;
  published?: boolean;
  pinned?: boolean;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  caseStudy?: {
    problem: string;
    solution: string;
    impact: string;
    architecture: string[];
  };
}

export interface ExperienceItem {
  id?: string;
  role: string;
  position?: string;
  company: string;
  employmentType?: string;
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  duration: string;
  description: string;
  responsibilities?: string[];
  achievements?: string[];
  technologies: string[];
  projectCount?: number;
  website?: string;
  currentlyWorking?: boolean;
  location?: string;
  companyLogo?: string;
  order?: number;
  visible?: boolean;
}

export interface EducationItem {
  id?: string;
  degree: string;
  department?: string;
  specialization?: string;
  college?: string;
  university?: string;
  institution: string;
  country?: string;
  state?: string;
  city?: string;
  location?: string;
  startYear?: string;
  endYear?: string;
  duration: string;
  currentlyStudying?: boolean;
  cgpa?: string;
  percentage?: string;
  grade?: string;
  description: string;
  skillsLearned?: string[];
  subjects?: string[];
  certificateUrl?: string;
  certificateImage?: string;
  certificatePdf?: string;
  logo?: string;
  instituteLogo?: string;
  order?: number;
  visible?: boolean;
}

export interface AwardItem {
  id?: string;
  title: string;
  organization: string;
  date: string;
  year?: string;
  category?: string;
  description: string;
  certificateUrl?: string;
  imageUrl?: string;
  awardImage?: string;
  certificateImage?: string;
  certificatePdf?: string;
  url?: string;
  awardLink?: string;
  badge?: string;
  featured?: boolean;
  published?: boolean;
  visible?: boolean;
  order?: number;
}

export type CertificationItem = AwardItem;

export interface BlogPostItem {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  category: string;
  publishDate: string;
  readTime: string;
  slug: string;
  published: boolean;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  likes?: number;
}

export interface SocialLinksData {
  github: string;
  linkedin: string;
  instagram: string;
  twitter?: string;
  youtube?: string;
  whatsapp?: string;
  portfolio?: string;
}

export interface ContactData {
  email: string;
  phone: string;
  location: string;
  whatsapp: string;
  address?: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
  website?: string;
  googleMapsUrl?: string;
}

export interface SeoData {
  websiteTitle: string;
  description: string;
  keywords: string[];
  ogImage: string;
  favicon?: string;
}

// 2. Default Seed Documents
export const DEFAULT_PROFILE: ProfileData = {
  profileImage: '/avatar.jpg',
  fullName: 'Abishek',
  jobTitle: 'Full Stack Developer & AI Creator',
  headline: 'Building enterprise-grade web applications & autonomous AI workflows',
  location: 'Tiruvannamalai, Tamil Nadu, India',
  email: 'snvadivelabi11@gmail.com',
  phone: '9786801597',
  resumeUrl: '#',
  status: 'Open for Select Work & AI Collaborations',
  yearsExperience: 1,
  projectsDelivered: 10,
  clientsCount: 3,
};

export const DEFAULT_HERO: HeroData = {
  name: 'Abishek',
  title: 'Full Stack Developer & AI Creator',
  titles: [
    'Full Stack Developer',
    'AI Creator & Automation Specialist',
    'Next.js 15 & React Specialist',
    'UI/UX & Performance Engineer',
  ],
  description: 'Building high-performance web applications, serverless AI automation workflows, and elegant digital products.',
  location: 'Tiruvannamalai, Tamil Nadu, India',
  email: 'snvadivelabi11@gmail.com',
  phone: '9786801597',
  profilePhoto: '/avatar.jpg',
  ctaText: 'Explore Projects',
  secondaryCtaText: 'Get In Touch',
};

export const DEFAULT_ABOUT: AboutData = {
  bio: 'Passionate Full Stack Developer and AI Creator dedicated to building elegant, high-speed applications.',
  description: 'With active development experience, I specialize in Next.js 15, TypeScript, Tailwind CSS, Python, and AI integrations.',
  whoIAm: 'Full Stack Developer & AI Creator focused on sub-second web applications.',
  whoAreYou: 'Full Stack Developer & AI Automation Specialist',
  tellAboutYourself: 'I build sub-second web platforms, autonomous AI pipelines, and linear UI systems.',
  mission: 'To craft high-speed digital products that solve complex real-world software challenges.',
  vision: 'Building sub-second Web & AI platforms engineered for global scale.',
  whyHireYou: 'Transparent communication, fast turnaround, clean type-safe code, and linear UI aesthetics.',
  whyWorkWithMe: 'Transparent communication, fast turnaround, clean type-safe code, and linear UI aesthetics.',
  technologies: 'Next.js 15, React, TypeScript, Python, Node.js, Firebase, Tailwind CSS.',
  currentlyLearning: 'Constantly mastering Next.js App Router, LLMs, and high-speed architecture.',
  careerObjective: 'Engineered high-performance full-stack web applications and AI agentic automation systems.',
  shortDescription: 'Full Stack Developer specializing in Next.js 15, React, TypeScript, and AI integrations.',
  longDescription: 'Experienced developer building enterprise applications with sub-second performance, bulletproof security, and seamless UI/UX.',
  subtitle: 'Engineering & Vision',
  profilePhoto: '/avatar.jpg',
  resumeUrl: '#',
  profileStatus: 'Open for Freelance & Full-time Roles',
  yearsExperience: 1,
  projectsCompleted: 10,
  clientsCount: 3,
  awardsCount: 1,
  highlights: [
    'Dedicated Full Stack Experience',
    'Enterprise & Web Apps Launched',
    'Excellence in AI & Web Innovation Award',
    'Sub-Second Page Load Optimization',
  ],
  achievements: [
    'Sub-Second Performance Optimization',
    '100% Type-Safe TypeScript Architecture',
  ],
};

export const DEFAULT_SOCIALS: SocialLinksData = {
  github: 'https://github.com/snvadivelabi11-boop',
  linkedin: 'https://www.linkedin.com/in/abishek-v-a984a6382',
  instagram: 'https://www.instagram.com/abishek_creator_/',
  whatsapp: 'https://wa.me/919786801597',
  twitter: 'https://twitter.com',
  youtube: 'https://youtube.com',
  portfolio: 'https://localhost:3000',
};

export const DEFAULT_CONTACT: ContactData = {
  email: 'snvadivelabi11@gmail.com',
  phone: '9786801597',
  location: 'Tiruvannamalai, Tamil Nadu, India',
  whatsapp: '+91 9786801597',
  address: 'Tiruvannamalai, Tamil Nadu, India',
  linkedin: 'https://www.linkedin.com/in/abishek-v-a984a6382',
  instagram: 'https://www.instagram.com/abishek_creator_/',
  github: 'https://github.com/snvadivelabi11-boop',
  website: 'http://localhost:3000',
};

export const DEFAULT_SEO: SeoData = {
  websiteTitle: 'Abishek — Full Stack Developer & AI Creator',
  description: 'Enterprise personal brand platform & digital portfolio of Abishek.',
  keywords: ['Abishek', 'Full Stack Developer', 'AI Creator', 'Next.js 15', 'TypeScript'],
  ogImage: '/og-image.png',
};

export const DEFAULT_PROJECT_CATEGORIES: ProjectCategoryRecord[] = [
  {
    id: 'college-education',
    title: 'College / Education Projects',
    subtitle: 'EdTech, Academic Tools & Campus Portals',
    description: 'Academic automation, campus management systems, and research tools engineered with Next.js, Python, and modern web stack.',
    icon: 'GraduationCap',
    order: 1,
  },
  {
    id: 'app-platform',
    title: 'App / Platform Projects',
    subtitle: 'Web Apps, SaaS Platforms & Commerce',
    description: 'Full-stack web applications, SaaS platforms, telemetry dashboards, and modern digital commerce storefronts.',
    icon: 'Layout',
    order: 2,
  },
  {
    id: 'ai-automation',
    title: 'AI / Automation Systems',
    subtitle: 'Autonomous AI Agents & RAG Pipelines',
    description: 'Intelligent multi-step LLM workflows, autonomous agent orchestration, and vector embedding RAG document summarizers.',
    icon: 'Bot',
    order: 3,
  },
];

// 3. Realtime Listeners
export function subscribeProfile(callback: (data: ProfileData) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback(DEFAULT_PROFILE);
    return () => {};
  }
  const docRef = doc(db, 'profile', 'main');
  return onSnapshot(docRef, (snap) => {
    callback(snap.exists() ? ({ ...DEFAULT_PROFILE, ...snap.data() } as ProfileData) : DEFAULT_PROFILE);
  }, () => callback(DEFAULT_PROFILE));
}

export function subscribeHero(callback: (data: HeroData) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback(DEFAULT_HERO);
    return () => {};
  }
  const docRef = doc(db, 'hero', 'main');
  return onSnapshot(docRef, (snap) => {
    callback(snap.exists() ? (snap.data() as HeroData) : DEFAULT_HERO);
  }, () => callback(DEFAULT_HERO));
}

export function subscribeAbout(callback: (data: AboutData) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback(DEFAULT_ABOUT);
    return () => {};
  }
  const docRef = doc(db, 'about', 'main');
  return onSnapshot(docRef, (snap) => {
    callback(snap.exists() ? ({ ...DEFAULT_ABOUT, ...snap.data() } as AboutData) : DEFAULT_ABOUT);
  }, () => callback(DEFAULT_ABOUT));
}

export function subscribeSocials(callback: (data: SocialLinksData) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback(DEFAULT_SOCIALS);
    return () => {};
  }
  const docRef = doc(db, 'socialLinks', 'main');
  return onSnapshot(docRef, (snap) => {
    callback(snap.exists() ? ({ ...DEFAULT_SOCIALS, ...snap.data() } as SocialLinksData) : DEFAULT_SOCIALS);
  }, () => callback(DEFAULT_SOCIALS));
}

export function subscribeContact(callback: (data: ContactData) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback(DEFAULT_CONTACT);
    return () => {};
  }
  const docRef = doc(db, 'contact', 'main');
  return onSnapshot(docRef, (snap) => {
    callback(snap.exists() ? ({ ...DEFAULT_CONTACT, ...snap.data() } as ContactData) : DEFAULT_CONTACT);
  }, () => callback(DEFAULT_CONTACT));
}

export function subscribeProjectCategories(callback: (categories: ProjectCategoryRecord[]) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback(DEFAULT_PROJECT_CATEGORIES);
    return () => {};
  }
  const colRef = collection(db, 'projectCategories');
  return onSnapshot(colRef, (snap) => {
    if (snap.empty) {
      callback(DEFAULT_PROJECT_CATEGORIES);
      return;
    }
    const list: ProjectCategoryRecord[] = [];
    snap.forEach((d) => {
      const data = d.data();
      list.push({
        id: d.id,
        title: data.title || d.id,
        subtitle: data.subtitle || '',
        description: data.description || '',
        icon: data.icon || 'Layers',
        order: data.order ?? 99,
        createdAt: data.createdAt,
      } as ProjectCategoryRecord);
    });
    list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    callback(list);
  }, () => callback(DEFAULT_PROJECT_CATEGORIES));
}

export async function addProjectCategoryDocument(category: Omit<ProjectCategoryRecord, 'id'> & { id?: string }): Promise<string> {
  if (db) {
    const rawId = category.id || category.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const cleanId = rawId || 'cat-' + Date.now();
    const docRef = doc(db, 'projectCategories', cleanId);
    await setDoc(docRef, {
      ...category,
      id: cleanId,
      createdAt: category.createdAt || new Date().toISOString(),
    }, { merge: true });
    return cleanId;
  }
  return category.id || 'cat-' + Date.now();
}

export async function updateProjectCategoryDocument(id: string, category: Partial<ProjectCategoryRecord>): Promise<void> {
  if (db) {
    const cleanItem = Object.fromEntries(
      Object.entries(category).filter(([, val]) => val !== undefined)
    );
    if (Object.keys(cleanItem).length > 0) {
      await updateDoc(doc(db, 'projectCategories', id), cleanItem);
    }
  }
}

export async function deleteProjectCategoryDocument(id: string): Promise<void> {
  if (db) {
    await deleteDoc(doc(db, 'projectCategories', id));
  }
}

export function subscribeProjects(callback: (projects: ProjectItem[]) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback([]);
    return () => {};
  }
  const colRef = collection(db, 'projects');
  return onSnapshot(colRef, (snap) => {
    const list: ProjectItem[] = [];
    snap.forEach((d) => list.push({ ...d.data(), id: d.id } as ProjectItem));
    callback(list);
  }, () => callback([]));
}

export async function getProjects(): Promise<ProjectItem[]> {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, 'projects'));
    const list: ProjectItem[] = [];
    snap.forEach((d) => list.push({ ...d.data(), id: d.id } as ProjectItem));
    return list;
  } catch {
    return [];
  }
}

export function subscribeSkills(callback: (skills: SkillItem[]) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback([]);
    return () => {};
  }
  const colRef = collection(db, 'skills');
  return onSnapshot(colRef, (snap) => {
    const list: SkillItem[] = [];
    snap.forEach((d) => list.push({ ...d.data(), id: d.id } as SkillItem));
    callback(list);
  }, () => callback([]));
}

export function subscribeServices(callback: (services: ServiceItem[]) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback([]);
    return () => {};
  }
  const colRef = collection(db, 'services');
  return onSnapshot(colRef, (snap) => {
    const list: ServiceItem[] = [];
    snap.forEach((d) => list.push({ ...d.data(), id: d.id } as ServiceItem));
    callback(list);
  }, () => callback([]));
}

export function subscribeExperience(callback: (experiences: ExperienceItem[]) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback([]);
    return () => {};
  }
  const colRef = collection(db, 'experience');
  return onSnapshot(colRef, (snap) => {
    const list: ExperienceItem[] = [];
    snap.forEach((d) => list.push({ ...d.data(), id: d.id } as ExperienceItem));
    callback(list);
  }, () => callback([]));
}

export function subscribeEducation(callback: (education: EducationItem[]) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback([]);
    return () => {};
  }
  const colRef = collection(db, 'education');
  return onSnapshot(colRef, (snap) => {
    const list: EducationItem[] = [];
    snap.forEach((d) => list.push({ ...d.data(), id: d.id } as EducationItem));
    callback(list);
  }, () => callback([]));
}

export function subscribeCertificates(callback: (certs: AwardItem[]) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback([]);
    return () => {};
  }
  const colRef = collection(db, 'certificates');
  return onSnapshot(colRef, (snap) => {
    const list: AwardItem[] = [];
    snap.forEach((d) => list.push({ ...d.data(), id: d.id } as AwardItem));
    callback(list);
  }, () => callback([]));
}

export function subscribeBlogs(callback: (blogs: BlogPostItem[]) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback([]);
    return () => {};
  }
  const colRef = collection(db, 'blogs');
  return onSnapshot(colRef, (snap) => {
    const list: BlogPostItem[] = [];
    snap.forEach((d) => list.push({ ...d.data(), id: d.id } as BlogPostItem));
    callback(list);
  }, () => callback([]));
}

// 4. Firestore Writer Helpers
export async function updateProfileDocument(data: ProfileData): Promise<void> {
  if (db) {
    await setDoc(doc(db, 'profile', 'main'), data, { merge: true });
    // Also sync contact email & phone across website
    await setDoc(doc(db, 'contact', 'main'), { email: data.email, phone: data.phone, location: data.location }, { merge: true });
    await setDoc(doc(db, 'hero', 'main'), { name: data.fullName, email: data.email, phone: data.phone, location: data.location }, { merge: true });
    await setDoc(doc(db, 'settings', 'site'), { personal: { name: data.fullName, email: data.email, phone: data.phone, location: data.location } }, { merge: true });
  }
}

export async function updateHeroDocument(data: HeroData): Promise<void> {
  if (db) {
    await setDoc(doc(db, 'hero', 'main'), data, { merge: true });
  }
}

export async function updateAboutDocument(data: AboutData): Promise<void> {
  if (db) {
    await setDoc(doc(db, 'about', 'main'), data, { merge: true });
  }
}

export async function updateSocialsDocument(data: SocialLinksData): Promise<void> {
  if (db) {
    await setDoc(doc(db, 'socialLinks', 'main'), data, { merge: true });
  }
}

export async function updateContactDocument(data: ContactData): Promise<void> {
  if (db) {
    await setDoc(doc(db, 'contact', 'main'), data, { merge: true });
    // Keep single-sourced email, phone, location in sync everywhere
    await setDoc(doc(db, 'profile', 'main'), { email: data.email, phone: data.phone, location: data.location }, { merge: true });
    await setDoc(doc(db, 'hero', 'main'), { email: data.email, phone: data.phone, location: data.location }, { merge: true });
    await setDoc(doc(db, 'settings', 'site'), { personal: { email: data.email, phone: data.phone, location: data.location } }, { merge: true });
  }
}

// Projects Writers
export async function addProjectDocument(project: Omit<ProjectItem, 'id'>): Promise<string> {
  if (db) {
    const ref = await addDoc(collection(db, 'projects'), project);
    return ref.id;
  }
  return 'proj-' + Date.now();
}

export async function updateProjectDocument(id: string, project: Partial<ProjectItem>): Promise<void> {
  if (db) {
    await updateDoc(doc(db, 'projects', id), project);
  }
}

export async function deleteProjectDocument(id: string): Promise<void> {
  if (db) {
    await deleteDoc(doc(db, 'projects', id));
  }
}

// Experience Writers
export async function addExperienceDocument(item: Omit<ExperienceItem, 'id'>): Promise<string> {
  if (db) {
    const ref = await addDoc(collection(db, 'experience'), item);
    return ref.id;
  }
  return 'exp-' + Date.now();
}

export async function updateExperienceDocument(id: string, item: Partial<ExperienceItem>): Promise<void> {
  if (db) {
    await updateDoc(doc(db, 'experience', id), item);
  }
}

export async function deleteExperienceDocument(id: string): Promise<void> {
  if (db) {
    await deleteDoc(doc(db, 'experience', id));
  }
}

// Education Writers
export async function addEducationDocument(item: Omit<EducationItem, 'id'>): Promise<string> {
  if (db) {
    const ref = await addDoc(collection(db, 'education'), item);
    return ref.id;
  }
  return 'edu-' + Date.now();
}

export async function updateEducationDocument(id: string, item: Partial<EducationItem>): Promise<void> {
  if (db) {
    await updateDoc(doc(db, 'education', id), item);
  }
}

export async function deleteEducationDocument(id: string): Promise<void> {
  if (db) {
    await deleteDoc(doc(db, 'education', id));
  }
}

// Award Writers
export async function addAwardDocument(item: Omit<AwardItem, 'id'>): Promise<string> {
  if (db) {
    const ref = await addDoc(collection(db, 'certificates'), item);
    return ref.id;
  }
  return 'award-' + Date.now();
}

export async function updateAwardDocument(id: string, item: Partial<AwardItem>): Promise<void> {
  if (db) {
    await updateDoc(doc(db, 'certificates', id), item);
  }
}

export async function deleteAwardDocument(id: string): Promise<void> {
  if (db) {
    await deleteDoc(doc(db, 'certificates', id));
  }
}

// Skills Writers
export async function addSkillDocument(item: Omit<SkillItem, 'id'>): Promise<string> {
  if (db) {
    const ref = await addDoc(collection(db, 'skills'), item);
    return ref.id;
  }
  return 'skill-' + Date.now();
}

export async function updateSkillDocument(id: string, item: Partial<SkillItem>): Promise<void> {
  if (db) {
    await updateDoc(doc(db, 'skills', id), item);
  }
}

export async function deleteSkillDocument(id: string): Promise<void> {
  if (db) {
    await deleteDoc(doc(db, 'skills', id));
  }
}

// Blog Writers
export async function addBlogDocument(item: Omit<BlogPostItem, 'id'>): Promise<string> {
  if (db) {
    const ref = await addDoc(collection(db, 'blogs'), item);
    return ref.id;
  }
  return 'blog-' + Date.now();
}

export async function updateBlogDocument(id: string, item: Partial<BlogPostItem>): Promise<void> {
  if (db) {
    await updateDoc(doc(db, 'blogs', id), item);
  }
}

export async function deleteBlogDocument(id: string): Promise<void> {
  if (db) {
    await deleteDoc(doc(db, 'blogs', id));
  }
}

// Services Writers
export async function addServiceDocument(item: Omit<ServiceItem, 'id'>): Promise<string> {
  if (db) {
    const ref = await addDoc(collection(db, 'services'), item);
    return ref.id;
  }
  return 'srv-' + Date.now();
}

export async function updateServiceDocument(id: string, item: Partial<ServiceItem>): Promise<void> {
  if (db) {
    await updateDoc(doc(db, 'services', id), item);
  }
}

export async function deleteServiceDocument(id: string): Promise<void> {
  if (db) {
    await deleteDoc(doc(db, 'services', id));
  }
}

// Certifications Collection Writers
export interface CertificationRecord {
  id?: string;
  name: string;
  title?: string;
  issuer: string;
  issueYear: string;
  issueDate?: string;
  category?: string;
  description?: string;
  credentialId?: string;
  credentialUrl?: string;
  certificatePdf?: string;
  certificateImage?: string;
  fileType?: string;
  order?: number;
  featured?: boolean;
  visible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function subscribeCertificationsCollection(callback: (certs: CertificationRecord[]) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback([]);
    return () => {};
  }
  const colRef = collection(db, 'certifications');
  return onSnapshot(colRef, (snap) => {
    const list: CertificationRecord[] = [];
    snap.forEach((d) => list.push({ ...d.data(), id: d.id } as CertificationRecord));
    callback(list);
  }, () => callback([]));
}

export async function addCertificationDocument(item: Omit<CertificationRecord, 'id'>): Promise<string> {
  if (db) {
    const ref = await addDoc(collection(db, 'certifications'), item);
    return ref.id;
  }
  return 'cert-' + Date.now();
}

export async function updateCertificationDocument(id: string, item: Partial<CertificationRecord>): Promise<void> {
  if (db) {
    // Strip any keys with undefined values to prevent Firestore updateDoc crashes
    const cleanItem = Object.fromEntries(
      Object.entries(item).filter(([, val]) => val !== undefined)
    );
    if (Object.keys(cleanItem).length > 0) {
      await updateDoc(doc(db, 'certifications', id), cleanItem);
    }
  }
}

export async function deleteCertificationDocument(id: string): Promise<void> {
  if (db) {
    await deleteDoc(doc(db, 'certifications', id));
  }
}

// 17. BOOKINGS REALTIME CMS ENGINE
export function subscribeBookingsCollection(callback: (list: import('@/types').Booking[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const colRef = collection(db, 'bookings');
  return onSnapshot(colRef, (snap) => {
    const list: import('@/types').Booking[] = [];
    snap.forEach((d) => list.push({ ...d.data(), id: d.id } as import('@/types').Booking));
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    callback(list);
  }, () => callback([]));
}

export async function addBookingDocument(item: Omit<import('@/types').Booking, 'id'>): Promise<string> {
  if (db) {
    const cleanItem = Object.fromEntries(
      Object.entries(item).filter(([, val]) => val !== undefined)
    );
    const ref = await addDoc(collection(db, 'bookings'), cleanItem);
    return ref.id;
  }
  return 'bk-' + Date.now();
}

export async function updateBookingDocument(id: string, item: Partial<import('@/types').Booking>): Promise<void> {
  if (db) {
    const cleanItem = Object.fromEntries(
      Object.entries(item).filter(([, val]) => val !== undefined)
    );
    if (Object.keys(cleanItem).length > 0) {
      await updateDoc(doc(db, 'bookings', id), cleanItem);
    }
  }
}

export async function deleteBookingDocument(id: string): Promise<void> {
  if (db) {
    await deleteDoc(doc(db, 'bookings', id));
  }
}
