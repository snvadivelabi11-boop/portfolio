import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface VisitorProfile {
  visitorId: string;
  firstVisit: string;
  lastVisit: string;
  totalVisits: number;
  sessionCount: number;
  device: string;
  browser: string;
  os: string;
  screenSize: string;
  language: string;
  timezone: string;
  referral: string;
  landingPage: string;
  pagesVisited: string[];
  hasBookedMeeting: boolean;
  hasSubmittedContact: boolean;
  aiChatStarted: boolean;
  aiChatMessagesCount: number;
  country?: string;
}

const VISITOR_COOKIE_KEY = 'abishek_vis_id_v2';

// 1. Get or Generate Persistent Anonymous Visitor ID
export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'server-side';

  let id = localStorage.getItem(VISITOR_COOKIE_KEY);
  if (!id) {
    id = `vis-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(VISITOR_COOKIE_KEY, id);
    document.cookie = `${VISITOR_COOKIE_KEY}=${id}; path=/; max-age=31536000; SameSite=Lax`;
  }
  return id;
}

// 2. Parse User Agent Environment Details
export function getBrowserInfo() {
  if (typeof window === 'undefined') return { device: 'Desktop', browser: 'Unknown', os: 'Unknown' };

  const ua = navigator.userAgent;
  let device = 'Desktop';
  if (/mobile/i.test(ua)) device = 'Mobile';
  if (/ipad|tablet/i.test(ua)) device = 'Tablet';

  let browser = 'Chrome';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edg')) browser = 'Edge';

  let os = 'Windows';
  if (ua.includes('Macintosh')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return { device, browser, os };
}

// 3. Upsert Visitor Telemetry Record in Firestore
export async function trackVisitorSession(currentPath: string): Promise<VisitorProfile | null> {
  if (typeof window === 'undefined') return null;

  const visitorId = getOrCreateVisitorId();
  const { device, browser, os } = getBrowserInfo();
  const screenSize = `${window.innerWidth}x${window.innerHeight}`;
  const language = navigator.language || 'en-US';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const referral = document.referrer ? new URL(document.referrer).hostname : 'Direct';
  const now = new Date().toISOString();

  let profile: VisitorProfile = {
    visitorId,
    firstVisit: now,
    lastVisit: now,
    totalVisits: 1,
    sessionCount: 1,
    device,
    browser,
    os,
    screenSize,
    language,
    timezone,
    referral,
    landingPage: currentPath,
    pagesVisited: [currentPath],
    hasBookedMeeting: false,
    hasSubmittedContact: false,
    aiChatStarted: false,
    aiChatMessagesCount: 0,
  };

  if (db) {
    try {
      const visitorRef = doc(db, 'visitors', visitorId);
      const docSnap = await getDoc(visitorRef);

      if (docSnap.exists()) {
        const existing = docSnap.data() as VisitorProfile;
        const updatedPages = Array.from(new Set([...(existing.pagesVisited || []), currentPath]));

        profile = {
          ...existing,
          lastVisit: now,
          totalVisits: (existing.totalVisits || 1) + 1,
          pagesVisited: updatedPages,
        };

        await updateDoc(visitorRef, {
          lastVisit: now,
          totalVisits: profile.totalVisits,
          pagesVisited: updatedPages,
        });
      } else {
        await setDoc(visitorRef, profile);
      }
    } catch {
      // Fallback telemetry store
    }
  }

  return profile;
}

// 4. Update Conversion Event Attributes
export async function updateVisitorConversion(
  event: 'booked_meeting' | 'submitted_contact' | 'ai_chat_start' | 'ai_message'
): Promise<void> {
  if (typeof window === 'undefined' || !db) return;

  const visitorId = getOrCreateVisitorId();
  const visitorRef = doc(db, 'visitors', visitorId);

  try {
    const docSnap = await getDoc(visitorRef);
    if (!docSnap.exists()) return;

    const existing = docSnap.data() as VisitorProfile;
    const updates: Partial<VisitorProfile> = {};

    if (event === 'booked_meeting') updates.hasBookedMeeting = true;
    if (event === 'submitted_contact') updates.hasSubmittedContact = true;
    if (event === 'ai_chat_start') updates.aiChatStarted = true;
    if (event === 'ai_message') updates.aiChatMessagesCount = (existing.aiChatMessagesCount || 0) + 1;

    await updateDoc(visitorRef, updates);
  } catch {
    // Ignore error
  }
}

// 5. Export Analytics Dataset to CSV String
// 6. Calculate Enterprise Lead Score & Classification
export function calculateLeadScore(profile: VisitorProfile): {
  score: number;
  category: 'Hot Lead' | 'Warm Lead' | 'Cold Lead';
} {
  let score = 5; // Base score for visiting homepage

  if (profile.pagesVisited?.some((p) => p.includes('/projects'))) score += 20;
  if (profile.aiChatStarted) score += 30;
  if (profile.hasSubmittedContact) score += 60;
  if (profile.hasBookedMeeting) score += 100;

  let category: 'Hot Lead' | 'Warm Lead' | 'Cold Lead' = 'Cold Lead';
  if (score >= 80) category = 'Hot Lead';
  else if (score >= 30) category = 'Warm Lead';

  return { score, category };
}

export function convertProfilesToCSV(profiles: VisitorProfile[]): string {
  const headers = [
    'Visitor ID',
    'First Visit',
    'Last Visit',
    'Total Visits',
    'Device',
    'Browser',
    'OS',
    'Timezone',
    'Referral',
    'Lead Score',
    'Lead Category',
    'Booked Meeting',
    'Contact Form',
    'AI Chat Started',
  ];

  const rows = profiles.map((p) => {
    const { score, category } = calculateLeadScore(p);
    return [
      p.visitorId,
      p.firstVisit,
      p.lastVisit,
      p.totalVisits,
      p.device,
      p.browser,
      p.os,
      p.timezone,
      p.referral,
      score,
      category,
      p.hasBookedMeeting ? 'Yes' : 'No',
      p.hasSubmittedContact ? 'Yes' : 'No',
      p.aiChatStarted ? 'Yes' : 'No',
    ];
  });

  return [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
}
