import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, addDoc, collection, onSnapshot } from 'firebase/firestore';

export interface SocialLinksSettings {
  github: string;
  linkedin: string;
  instagram: string;
  twitter?: string;
  youtube?: string;
  whatsapp?: string;
}

export interface PersonalInfoSettings {
  name: string;
  title: string;
  shortBio: string;
  aboutDescription: string;
  location: string;
  phone: string;
  email: string;
  profileImage: string;
  resumeUrl: string;
}

export interface FeatureTogglesSettings {
  enableContactForm: boolean;
  enableBooking: boolean;
  enableAiAssistant: boolean;
  enableReviews: boolean;
}

export interface SeoSettings {
  websiteTitle: string;
  description: string;
  keywords: string[];
  ogImage: string;
}

export interface SiteSettings {
  personal: PersonalInfoSettings;
  socials: SocialLinksSettings;
  features: FeatureTogglesSettings;
  seo: SeoSettings;
  updatedAt: string;
  updatedBy?: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  personal: {
    name: 'Abishek',
    title: 'Full Stack Developer & AI Creator',
    shortBio: 'Architecting high-speed web apps & AI automation workflows.',
    aboutDescription: 'Dedicated Full Stack Developer & AI Creator building production software.',
    location: 'Tiruvannamalai, Tamil Nadu, India',
    phone: '9786801597',
    email: 'SNVADIVEL11@gmail.com',
    profileImage: '/avatar.jpg',
    resumeUrl: '#resume',
  },
  socials: {
    github: 'https://github.com/snvadivelabi11-boop',
    linkedin: 'https://www.linkedin.com/in/abishek-v-a984a6382',
    instagram: 'https://www.instagram.com/abishek_creator_/',
    twitter: '',
    youtube: '',
    whatsapp: 'https://wa.me/919786801597',
  },
  features: {
    enableContactForm: true,
    enableBooking: true,
    enableAiAssistant: true,
    enableReviews: true,
  },
  seo: {
    websiteTitle: 'Abishek — Full Stack Developer & AI Creator',
    description: 'Enterprise personal brand platform & digital portfolio of Abishek.',
    keywords: ['Abishek', 'Full Stack Developer', 'AI Creator', 'Next.js 15', 'TypeScript'],
    ogImage: '/og-image.png',
  },
  updatedAt: new Date().toISOString(),
};

// 1. Get Current Site Settings
export async function getSiteSettings(): Promise<SiteSettings> {
  if (db) {
    try {
      const docRef = doc(db, 'settings', 'site');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as SiteSettings;
      }
    } catch {
      // Fallback
    }
  }
  return DEFAULT_SITE_SETTINGS;
}

// 2. Update Site Settings with Version Backup Snapshot
export async function updateSiteSettings(
  newSettings: Partial<SiteSettings>,
  adminEmail: string = 'SNVADIVEL11@gmail.com'
): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const updated: SiteSettings = {
    ...current,
    ...newSettings,
    personal: { ...current.personal, ...(newSettings.personal || {}) },
    socials: { ...current.socials, ...(newSettings.socials || {}) },
    features: { ...current.features, ...(newSettings.features || {}) },
    seo: { ...current.seo, ...(newSettings.seo || {}) },
    updatedAt: new Date().toISOString(),
    updatedBy: adminEmail,
  };

  if (db) {
    try {
      console.log(`[Firestore Write] Initiating settings update by ${adminEmail}...`);

      // Create Automatic Backup Snapshot History
      await addDoc(collection(db, 'settings_history'), {
        snapshot: current,
        timestamp: new Date().toISOString(),
        updatedBy: adminEmail,
      });

      // Update Main Settings Doc
      const docRef = doc(db, 'settings', 'site');
      await setDoc(docRef, updated, { merge: true });

      console.log(`[Firestore Write] Successfully updated settings/site document in Firestore.`);
    } catch (err) {
      console.error(`[Firestore Write Error] Failed to write settings to Firestore:`, err);
      throw err;
    }
  }

  return updated;
}

// 3. Realtime Listener Subscription
export function subscribeSiteSettings(callback: (settings: SiteSettings) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback(DEFAULT_SITE_SETTINGS);
    return () => {};
  }

  try {
    const docRef = doc(db, 'settings', 'site');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as SiteSettings);
      } else {
        callback(DEFAULT_SITE_SETTINGS);
      }
    });
  } catch {
    callback(DEFAULT_SITE_SETTINGS);
    return () => {};
  }
}
