import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import {
  DEFAULT_PROFILE,
  DEFAULT_HERO,
  DEFAULT_ABOUT,
  DEFAULT_CONTACT,
  DEFAULT_SOCIALS,
  DEFAULT_PROJECT_CATEGORIES,
} from '@/lib/firestoreCMS';

export async function getLiveSystemPrompt(): Promise<string> {
  let profile = DEFAULT_PROFILE;
  let hero = DEFAULT_HERO;
  let about = DEFAULT_ABOUT;
  let contact = DEFAULT_CONTACT;
  let socials = DEFAULT_SOCIALS;
  let projects: Array<{ title: string; description: string; category: string; technologies: string[]; liveUrl?: string; githubUrl?: string }> = [];
  let categories = DEFAULT_PROJECT_CATEGORIES;
  let skills: Array<{ name: string; category: string }> = [];
  let services: Array<{ title: string; description: string; features?: string[] }> = [];
  let experiences: Array<{ role: string; company: string; duration: string; description: string }> = [];
  let education: Array<{ degree: string; institution: string; duration: string }> = [];
  let awards: Array<{ title: string; organization: string; year?: string }> = [];
  let reviews: Array<{ name: string; role?: string; company?: string; content: string; rating: number }> = [];

  if (db) {
    try {
      // 1. Fetch Profile & Hero
      const profileSnap = await getDoc(doc(db, 'profile', 'main')).catch(() => null);
      if (profileSnap?.exists()) profile = { ...DEFAULT_PROFILE, ...profileSnap.data() };

      const heroSnap = await getDoc(doc(db, 'hero', 'main')).catch(() => null);
      if (heroSnap?.exists()) hero = { ...DEFAULT_HERO, ...heroSnap.data() };

      const aboutSnap = await getDoc(doc(db, 'about', 'main')).catch(() => null);
      if (aboutSnap?.exists()) about = { ...DEFAULT_ABOUT, ...aboutSnap.data() };

      const contactSnap = await getDoc(doc(db, 'contact', 'main')).catch(() => null);
      if (contactSnap?.exists()) contact = { ...DEFAULT_CONTACT, ...contactSnap.data() };

      const socialsSnap = await getDoc(doc(db, 'socialLinks', 'main')).catch(() => null);
      if (socialsSnap?.exists()) socials = { ...DEFAULT_SOCIALS, ...socialsSnap.data() };

      // 2. Fetch Projects
      const projectsSnap = await getDocs(collection(db, 'projects')).catch(() => null);
      if (projectsSnap && !projectsSnap.empty) {
        projects = [];
        projectsSnap.forEach((d) => {
          const data = d.data();
          if (data.published !== false && data.archived !== true) {
            projects.push({
              title: data.title || 'Untitled Project',
              description: data.description || '',
              category: data.category || 'Software',
              technologies: Array.isArray(data.technologies) ? data.technologies : [],
              liveUrl: data.liveUrl || '',
              githubUrl: data.githubUrl || '',
            });
          }
        });
      }

      // 3. Fetch Categories
      const categoriesSnap = await getDocs(collection(db, 'projectCategories')).catch(() => null);
      if (categoriesSnap && !categoriesSnap.empty) {
        categories = [];
        categoriesSnap.forEach((d) => {
          const data = d.data();
          categories.push({
            id: d.id,
            title: data.title || d.id,
            subtitle: data.subtitle || '',
            description: data.description || '',
            icon: data.icon || 'Layers',
          });
        });
      }

      // 4. Fetch Skills
      const skillsSnap = await getDocs(collection(db, 'skills')).catch(() => null);
      if (skillsSnap && !skillsSnap.empty) {
        skills = [];
        skillsSnap.forEach((d) => {
          const data = d.data();
          if (data.name) skills.push({ name: data.name, category: data.category || 'General' });
        });
      }

      // 5. Fetch Services
      const servicesSnap = await getDocs(collection(db, 'services')).catch(() => null);
      if (servicesSnap && !servicesSnap.empty) {
        services = [];
        servicesSnap.forEach((d) => {
          const data = d.data();
          if (data.title) services.push({ title: data.title, description: data.description || '', features: data.features || [] });
        });
      }

      // 6. Fetch Experience & Education
      const expSnap = await getDocs(collection(db, 'experience')).catch(() => null);
      if (expSnap && !expSnap.empty) {
        experiences = [];
        expSnap.forEach((d) => {
          const data = d.data();
          if (data.role) experiences.push({ role: data.role, company: data.company || '', duration: data.duration || '', description: data.description || '' });
        });
      }

      const eduSnap = await getDocs(collection(db, 'education')).catch(() => null);
      if (eduSnap && !eduSnap.empty) {
        education = [];
        eduSnap.forEach((d) => {
          const data = d.data();
          if (data.degree) education.push({ degree: data.degree, institution: data.institution || '', duration: data.duration || '' });
        });
      }

      // 7. Fetch Certificates & Awards
      const certSnap = await getDocs(collection(db, 'certificates')).catch(() => null);
      if (certSnap && !certSnap.empty) {
        awards = [];
        certSnap.forEach((d) => {
          const data = d.data();
          if (data.title) awards.push({ title: data.title, organization: data.organization || '', year: data.year || data.date || '' });
        });
      }

      // 8. Fetch Approved Reviews ONLY
      const reviewsSnap = await getDocs(collection(db, 'reviews')).catch(() => null);
      if (reviewsSnap && !reviewsSnap.empty) {
        reviews = [];
        reviewsSnap.forEach((d) => {
          const data = d.data();
          if (data.status === 'approved') {
            reviews.push({
              name: data.name || 'Anonymous Client',
              role: data.role || '',
              company: data.company || '',
              content: data.content || '',
              rating: data.rating || 5,
            });
          }
        });
      }
    } catch (err) {
      console.warn('[Live AI Context] Firestore query fallback to default CMS data:', err);
    }
  }

  // Format live values cleanly
  const activeName = profile.fullName || hero.name || 'Abishek';
  const activeTitle = profile.jobTitle || hero.title || 'Full Stack Developer & AI Creator';
  const activeLocation = profile.location || contact.location || 'Tiruvannamalai, Tamil Nadu, India';
  const activeEmail = profile.email || contact.email || 'snvadivelabi11@gmail.com';
  const activePhone = profile.phone || contact.phone || '9786801597';
  const activeGithub = contact.github || socials.github || 'https://github.com/snvadivelabi11-boop';
  const activeLinkedin = contact.linkedin || socials.linkedin || 'https://www.linkedin.com/in/abishek-v-a984a6382';
  const activeInstagram = contact.instagram || socials.instagram || 'https://www.instagram.com/abishek_creator_/';

  // Skills string grouped by category
  const skillsText = skills.length > 0
    ? skills.map((s) => `${s.name} (${s.category})`).join(', ')
    : 'React, Next.js 15, TypeScript, Tailwind CSS, Node.js, Python, PostgreSQL, Supabase, AI Agents';

  // Services string
  const servicesText = services.length > 0
    ? services.map((s) => `- ${s.title}: ${s.description}`).join('\n')
    : '- Web & AI Engineering: Full stack web applications and autonomous AI pipelines.';

  // Projects string
  const projectsText = projects.length > 0
    ? projects.map((p) => `- ${p.title} [Category: ${p.category}]: ${p.description}. Tech: ${p.technologies.join(', ')}. Live: ${p.liveUrl || 'N/A'}. Repo: ${p.githubUrl || 'N/A'}`).join('\n')
    : 'No active projects found in database.';

  // Reviews string
  const reviewsText = reviews.length > 0
    ? reviews.map((r) => `- "${r.content}" — ${r.name} (${r.role || 'Client'}${r.company ? `, ${r.company}` : ''}) [Rating: ${r.rating}/5]`).join('\n')
    : 'No client reviews currently published.';

  // Experience string
  const expText = experiences.length > 0
    ? experiences.map((e) => `- ${e.role} at ${e.company} (${e.duration}): ${e.description}`).join('\n')
    : 'Independent Full Stack Developer & AI Creator.';

  return `You are ${activeName}'s AI Technical Assistant on this live portfolio website.

YOUR SINGLE SOURCE OF TRUTH (CURRENT LIVE FIRESTORE DATA):
- Full Name: ${activeName}
- Title / Role: ${activeTitle}
- Headline: ${profile.headline || hero.description || ''}
- Years of Experience: ${profile.yearsExperience || 1} years
- Projects Delivered: ${profile.projectsDelivered || projects.length}
- Location: ${activeLocation}
- Email: ${activeEmail}
- Phone / WhatsApp: +91 ${activePhone}
- Official GitHub: ${activeGithub}
- LinkedIn Profile: ${activeLinkedin}
- Instagram Profile: ${activeInstagram}
- Profile Status: ${profile.status || 'Open for Select Work & AI Collaborations'}

BIOGRAPHY & ABOUT:
${about.bio || about.description || 'Full Stack Developer and AI Creator dedicated to building high-speed web platforms.'}

PROJECT CATEGORIES:
${categories.map((c) => `- ${c.title} (${c.id}): ${c.description}`).join('\n')}

CURRENT PUBLISHED PROJECTS (${projects.length}):
${projectsText}

TECHNICAL SKILLS:
${skillsText}

PROFESSIONAL SERVICES:
${servicesText}

EXPERIENCE & WORK HISTORY:
${expText}

APPROVED CLIENT REVIEWS (${reviews.length}):
${reviewsText}

STRICT DATA RULES:
1. You MUST answer questions about ${activeName} using ONLY the LIVE FIRESTORE DATA provided above.
2. Do NOT invent, hallucinate, or guess personal details, contact information, or projects.
3. If information is missing from the live data, answer naturally: "I couldn't find that specific detail in the current website data."
4. If asked for contact details, always provide the current live email (${activeEmail}), phone (+91 ${activePhone}), location (${activeLocation}), GitHub, and LinkedIn.

LANGUAGE RULES:
- Detect the user's language automatically.
- Reply in the exact same language used by the user.
- Tanglish → Tanglish (Tamil written in English letters).
  Example:
  User: "ennaku react kathukanum"
  AI: "Sure! React kathukkarathukku first JSX, Components, Props, State la start pannunga..."
- Tamil → Tamil (தமிழ்).
- English → English.
- Hindi → Hindi (हिंदी / Hinglish).
- Do NOT translate unless the user explicitly asks.
- Never force English if another language is detected.
- Keep responses natural, concise, friendly, and senior-engineer-level.

BOOKING CALL TRIGGER:
If the user asks to "Book Meeting", "Book Call", "Schedule Call", "Meeting போடனும்", "கால் புக் பண்ணனும்", or "Call schedule karna hai", guide them to book a meeting and include the tag "[ACTION:OPEN_BOOKING_MODAL]" in your response so the platform opens the booking modal automatically.`;
}

// Synchronous fallback for legacy callers & unit tests
export function getSystemPrompt(): string {
  return `You are Abishek's AI Technical Assistant on this live portfolio website.

AUTHENTIC PORTFOLIO DATA FOR ABISHEK:
- Name: Abishek
- Title: Full Stack Developer & AI Creator
- Location: Tiruvannamalai, Tamil Nadu, India
- Email: snvadivelabi11@gmail.com
- Phone: +91 9786801597
- GitHub: https://github.com/snvadivelabi11-boop
- LinkedIn: https://www.linkedin.com/in/abishek-v-a984a6382
- Instagram: https://www.instagram.com/abishek_creator_/

LANGUAGE RULES:
- Detect the user's language automatically and reply in the exact same language (Tanglish, Tamil, English, Hindi).

BOOKING CALL TRIGGER:
If the user asks to "Book Meeting", "Book Call", "Schedule Call", "Meeting போடனும்", "கால் புக் பண்ணனும்", or "Call schedule karna hai", guide them to book a call and include the tag "[ACTION:OPEN_BOOKING_MODAL]" in your response.`;
}
