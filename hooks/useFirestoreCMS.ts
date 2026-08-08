'use client';

import { useState, useEffect } from 'react';
import {
  ProfileData, HeroData, AboutData, SocialLinksData, ContactData, ProjectItem, ProjectCategoryRecord, SkillItem, ServiceItem, ExperienceItem, EducationItem, CertificationItem,
  DEFAULT_PROFILE, DEFAULT_HERO, DEFAULT_ABOUT, DEFAULT_SOCIALS, DEFAULT_CONTACT, DEFAULT_PROJECT_CATEGORIES,
  subscribeProfile, subscribeHero, subscribeAbout, subscribeSocials, subscribeContact, subscribeProjectCategories, subscribeProjects, subscribeSkills, subscribeServices, subscribeExperience,
  subscribeEducation, subscribeCertificates
} from '@/lib/firestoreCMS';

export function useLiveProjectCategories() {
  const [categories, setCategories] = useState<ProjectCategoryRecord[]>(DEFAULT_PROJECT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeProjectCategories((list) => {
      setCategories(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { categories, loading };
}
import { SiteSettings, DEFAULT_SITE_SETTINGS, subscribeSiteSettings } from '@/lib/siteSettings';

export function useLiveProfile() {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeProfile((data) => {
      setProfile(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { profile, loading };
}

export function useLiveSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeSiteSettings((data) => {
      console.log('[Live Firestore CMS] Realtime SiteSettings Received:', data.personal?.email);
      setSettings(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { settings, loading };
}

export function useLiveHero() {
  const [hero, setHero] = useState<HeroData>(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeHero((data) => {
      setHero(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { hero, loading };
}

export function useLiveAbout() {
  const [about, setAbout] = useState<AboutData>(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeAbout((data) => {
      setAbout(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { about, loading };
}

export function useLiveSocials() {
  const [socials, setSocials] = useState<SocialLinksData>(DEFAULT_SOCIALS);

  useEffect(() => {
    const unsub = subscribeSocials((data) => setSocials(data));
    return () => unsub();
  }, []);

  return { socials };
}

export function useLiveContact() {
  const [contact, setContact] = useState<ContactData>(DEFAULT_CONTACT);

  useEffect(() => {
    const unsub = subscribeContact((data) => setContact(data));
    return () => unsub();
  }, []);

  return { contact };
}

export function useLiveProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeProjects((list) => {
      setProjects(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { projects, loading };
}

export function useLiveSkills() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeSkills((list) => {
      setSkills(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { skills, loading };
}

export function useLiveServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeServices((list) => {
      setServices(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { services, loading };
}

export function useLiveExperience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeExperience((list) => {
      setExperiences(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { experiences, loading };
}

export function useLiveMedia() {
  const [mediaItems, setMediaItems] = useState<import('@/lib/mediaStorage').MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('@/lib/mediaStorage').then(({ subscribeMediaAssets }) => {
      const unsub = subscribeMediaAssets((items) => {
        setMediaItems(items);
        setLoading(false);
      });
      return () => unsub();
    });
  }, []);

  return { mediaItems, loading };
}

export function useLiveEducation() {
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeEducation((list) => {
      setEducation(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { education, loading };
}

export function useLiveCertificates() {
  const [certificates, setCertificates] = useState<CertificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeCertificates((list) => {
      setCertificates(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { certificates, loading };
}

export function useLiveBlogs() {
  const [blogs, setBlogs] = useState<import('@/lib/firestoreCMS').BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('@/lib/firestoreCMS').then(({ subscribeBlogs }) => {
      const unsub = subscribeBlogs((list) => {
        setBlogs(list);
        setLoading(false);
      });
      return () => unsub();
    });
  }, []);

  return { blogs, loading };
}

export function useLiveCertificationsCollection() {
  const [certifications, setCertifications] = useState<import('@/lib/firestoreCMS').CertificationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('@/lib/firestoreCMS').then(({ subscribeCertificationsCollection }) => {
      const unsub = subscribeCertificationsCollection((list) => {
        setCertifications(list);
        setLoading(false);
      });
      return () => unsub();
    });
  }, []);

  return { certifications, loading };
}

export function useLiveBookings() {
  const [bookings, setBookings] = useState<import('@/types').Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('@/lib/firestoreCMS').then(({ subscribeBookingsCollection }) => {
      const unsub = subscribeBookingsCollection((list) => {
        setBookings(list);
        setLoading(false);
      });
      return () => unsub();
    });
  }, []);

  return { bookings, loading };
}

