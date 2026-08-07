export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface Skill {
  name: string;
  category?: string;
  icon?: string;
  color?: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  category: string;
  caseStudy?: {
    problem: string;
    solution: string;
    impact: string;
    architecture: string[];
  };
}

export interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  duration: string;
  description: string;
  technologies: string[];
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  duration: string;
  description: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  avatar?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  socials: SocialLink[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  status?: 'New' | 'Read' | 'Replied';
}

export interface Booking {
  id: string;
  bookingId?: string;
  name: string;
  email: string;
  phone: string;
  purpose?: string;
  company?: string;
  serviceSelected?: string;
  meetingType?: string;
  message?: string;
  date?: string;
  preferredDate?: string;
  time?: string;
  preferredTime?: string;
  timezone?: string;
  projectBudget?: string;
  projectDescription?: string;
  status: 'New' | 'Pending' | 'Contacted' | 'Scheduled' | 'Completed' | 'Approved' | 'Rejected';
  googleMeetLink?: string;
  calendarIcsData?: string;
  createdAt: string;
  updatedAt?: string;
  unread?: boolean;
}

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface VisitorLog {
  id: string;
  timestamp: string;
  path: string;
  ipHash: string;
  userAgent: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os?: string;
  page?: string;
  country: string;
  city: string;
  referer: string;
}

export interface AnalyticsStats {
  onlineVisitors: number;
  totalVisitors: number;
  pageViewsToday: number;
  totalBookings: number;
  pendingBookingsCount: number;
  deviceBreakdown: { device: string; count: number }[];
  browserBreakdown: { browser: string; count: number }[];
  topCountries: { country: string; count: number }[];
  recentVisitors: VisitorLog[];
  trafficSources: { source: string; count: number }[];
}
