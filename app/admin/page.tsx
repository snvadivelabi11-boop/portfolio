'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Activity, CheckCircle2, XCircle, Trash2, LogOut, ArrowLeft, RefreshCw, BarChart2,
  MessageSquare, Star, Calendar, Folder, BookOpen, Settings, Save, Plus,
  Award as AwardIcon, Briefcase, GraduationCap, Code2, Cpu, User, Phone,
  Share2, Image as ImageIcon, Copy, ShieldCheck, Search, Eye, Mail
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnalyticsStats, Review, ContactMessage, Booking } from '@/types';
import {
  useLiveProfile, useLiveHero, useLiveAbout, useLiveSocials, useLiveContact, useLiveProjects,
  useLiveSkills, useLiveServices, useLiveExperience, useLiveEducation, useLiveCertificates,
  useLiveCertificationsCollection, useLiveBlogs, useLiveMedia, useLiveBookings
} from '@/hooks/useFirestoreCMS';
import {
  updateProfileDocument, updateHeroDocument, updateAboutDocument, updateSocialsDocument,
  updateContactDocument, addProjectDocument, updateProjectDocument, deleteProjectDocument,
  addExperienceDocument, updateExperienceDocument, deleteExperienceDocument,
  addEducationDocument, updateEducationDocument, deleteEducationDocument,
  addAwardDocument, updateAwardDocument, deleteAwardDocument,
  addCertificationDocument, updateCertificationDocument, deleteCertificationDocument,
  addSkillDocument, updateSkillDocument, deleteSkillDocument,
  addServiceDocument, updateServiceDocument, deleteServiceDocument,
  addBlogDocument, updateBlogDocument, deleteBlogDocument,
  updateBookingDocument, deleteBookingDocument,
  ProjectItem
} from '@/lib/firestoreCMS';
import { subscribeAdminAuthState, logoutAdminFromFirebase } from '@/lib/adminAuth';
import { uploadMediaAsset, deleteMediaAsset } from '@/lib/mediaStorage';

export default function AdminDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    const unsub = subscribeAdminAuthState((state) => {
      if (!state.loading) {
        if (state.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.replace('/admin/login');
        }
      }
    });
    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, [router]);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'about' | 'experience' | 'education' | 'awards' | 'certifications' | 'skills' | 'projects' | 'services' | 'blog' | 'contact' | 'socials' | 'media' | 'settings' | 'bookings' | 'messages' | 'reviews'
  >('overview');

  // Live Firestore Hooks
  const { profile } = useLiveProfile();
  const { hero } = useLiveHero();
  const { about } = useLiveAbout();
  const { socials } = useLiveSocials();
  const { contact } = useLiveContact();
  const { projects } = useLiveProjects();
  const { skills } = useLiveSkills();
  const { services } = useLiveServices();
  const { experiences } = useLiveExperience();
  const { education } = useLiveEducation();
  const { certificates: awards } = useLiveCertificates();
  const { certifications } = useLiveCertificationsCollection();
  const { blogs } = useLiveBlogs();
  const { mediaItems } = useLiveMedia();
  const { bookings: liveBookings } = useLiveBookings();

  // Local States
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [copiedMessageEmailId, setCopiedMessageEmailId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Combined Bookings list (prefers realtime listener)
  const allBookings: Booking[] = liveBookings.length > 0 ? liveBookings : bookings;

  // Local States for Bookings Management
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'All' | 'New' | 'Contacted' | 'Scheduled' | 'Completed' | 'Rejected'>('All');
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<Booking | null>(null);

  // Forms
  const [profileForm, setProfileForm] = useState(profile);
  const [aboutForm, setAboutForm] = useState(about);
  const [heroForm, setHeroForm] = useState(hero);
  const [contactForm, setContactForm] = useState(contact);
  const [socialsForm, setSocialsForm] = useState(socials);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfileForm(profile);
  }, [profile]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAboutForm(about);
  }, [about]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeroForm(hero);
  }, [hero]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContactForm(contact);
  }, [contact]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocialsForm(socials);
  }, [socials]);

  // Media Manager Upload
  const [uploadCategory, setUploadCategory] = useState<'profile' | 'resume' | 'projects' | 'certificates' | 'blogs' | 'logos'>('profile');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const resStats = await fetch('/api/analytics/stats');
      setStats(await resStats.json());

      const resReviews = await fetch('/api/admin/reviews');
      const dataReviews = await resReviews.json();
      if (dataReviews.success) setReviews(dataReviews.reviews);

      const resMessages = await fetch('/api/admin/messages');
      const dataMessages = await resMessages.json();
      if (dataMessages.success) setMessages(dataMessages.messages);

      const resBookings = await fetch('/api/admin/bookings');
      const dataBookings = await resBookings.json();
      if (dataBookings.success) setBookings(dataBookings.bookings);
    } catch {
      // Gracefully handled
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchDashboardData();
      import('@/lib/store').then(({ subscribeMessages }) => {
        const unsub = subscribeMessages((liveMsgs) => setMessages(liveMsgs));
        return () => unsub();
      });
    }
  }, [isAuthenticated, fetchDashboardData]);

  const handleLogout = async () => {
    try {
      await logoutAdminFromFirebase();
    } catch (err) {
      console.error('[Logout Error]:', err);
    }
    setIsAuthenticated(false);
    router.replace('/admin/login');
  };

  const notifySuccess = (msg: string) => {
    setStatusMsg(`✓ ${msg}`);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleUpdateMessageStatus = async (id: string, status: 'New' | 'Read' | 'Replied') => {
    try {
      await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status, read: status !== 'New' } : m))
      );
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, status, read: status !== 'New' } : null));
      }
      notifySuccess(`Message marked as ${status}`);
    } catch {
      console.error('Failed to update message status');
    }
  };

  const handleCopyMessageEmail = (email: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopiedMessageEmailId(id);
      setTimeout(() => setCopiedMessageEmailId(null), 2000);
    }
  };

  // ──── Save Handlers ────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileDocument(profileForm);
      notifySuccess('Profile saved live to Firestore! Email & Phone single-sourced across site.');
    } catch (err) {
      setErrorMsg(`Error saving Profile: ${String(err)}`);
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAboutDocument(aboutForm);
      notifySuccess('About Questions & Biography updated live in Firestore!');
    } catch (err) {
      setErrorMsg(`Error saving About CMS: ${String(err)}`);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateContactDocument(contactForm);
      notifySuccess('Contact info updated single-sourced across site!');
    } catch (err) {
      setErrorMsg(`Error saving Contact: ${String(err)}`);
    }
  };

  const handleSaveSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSocialsDocument(socialsForm);
      notifySuccess('Social profile links updated live in Firestore!');
    } catch (err) {
      setErrorMsg(`Error saving Socials: ${String(err)}`);
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateHeroDocument(heroForm);
      notifySuccess('Hero & Settings updated live in Firestore!');
    } catch (err) {
      setErrorMsg(`Error saving Hero: ${String(err)}`);
    }
  };

  // ──── Collection Handlers ────
  const handleAddExperience = async () => {
    await addExperienceDocument({
      company: '',
      role: '',
      employmentType: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      currentlyWorking: false,
      location: '',
      duration: '',
      description: '',
      technologies: [],
      visible: true,
    });
    notifySuccess('New Experience added! Fill in all fields including Start & End Year.');
  };

  const handleDeleteExp = async (id: string) => {
    await deleteExperienceDocument(id);
    notifySuccess('Experience removed!');
  };

  const handleAddEducation = async () => {
    await addEducationDocument({
      degree: '',
      department: '',
      institution: '',
      university: '',
      country: '',
      state: '',
      city: '',
      startYear: '',
      endYear: '',
      duration: '',
      currentlyStudying: false,
      cgpa: '',
      grade: '',
      description: '',
      visible: true,
    });
    notifySuccess('New Education added! Fill in all fields including Start & End Year.');
  };

  const handleDeleteEdu = async (id: string) => {
    await deleteEducationDocument(id);
    notifySuccess('Education record removed!');
  };

  const handleAddAward = async () => {
    await addAwardDocument({
      title: '',
      organization: '',
      date: '',
      year: '',
      category: '',
      description: '',
      featured: true,
      visible: true,
    });
    notifySuccess('New Award added! Fill in all fields including Award Year.');
  };

  const handleDeleteAward = async (id: string) => {
    await deleteAwardDocument(id);
    notifySuccess('Award removed!');
  };

  const handleAddCertification = async () => {
    await addCertificationDocument({
      name: '',
      issuer: '',
      issueYear: '',
      credentialId: '',
      credentialUrl: '',
    });
    notifySuccess('New Certification added! Fill in all fields including Issue Year.');
  };

  const handleDeleteCertification = async (id: string) => {
    await deleteCertificationDocument(id);
    notifySuccess('Certification record removed!');
  };

  const handleAddSkill = async () => {
    await addSkillDocument({
      category: 'Frontend',
      name: 'New Skill',
      icon: 'Code2',
    });
    notifySuccess('New Skill added! Fill in skill details.');
  };

  const handleDeleteSkill = async (id: string) => {
    await deleteSkillDocument(id);
    notifySuccess('Skill removed!');
  };

  const handleAddService = async () => {
    await addServiceDocument({
      title: '',
      description: '',
      icon: 'Globe',
      features: [],
    });
    notifySuccess('New Service added! Fill in all fields.');
  };

  const handleDeleteService = async (id: string) => {
    await deleteServiceDocument(id);
    notifySuccess('Service removed!');
  };

  const handleAddProject = async () => {
    await addProjectDocument({
      title: '',
      description: '',
      image: '',
      technologies: [],
      liveUrl: '',
      githubUrl: '',
      category: 'Web',
      featured: false,
      published: false,
    });
    notifySuccess('New Project added! Fill in all fields.');
  };

  const handleDuplicateProject = async (p: ProjectItem) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...data } = p;
    await addProjectDocument({ ...data, title: `${p.title} (Copy)` });
    notifySuccess(`Duplicated "${p.title}"!`);
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProjectDocument(id);
    notifySuccess('Project deleted!');
  };

  const handleAddBlog = async () => {
    await addBlogDocument({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: [],
      publishDate: '',
      readTime: '',
      slug: `blog-post-${Date.now()}`,
      published: false,
    });
    notifySuccess('New Blog draft created! Fill in all fields.');
  };

  const handleDeleteBlog = async (id: string) => {
    await deleteBlogDocument(id);
    notifySuccess('Blog post deleted!');
  };


  const handleDeleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(null);
        }
        notifySuccess('Message permanently deleted from Firestore!');
      } else {
        setErrorMsg('Failed to delete message from Firestore.');
      }
    } catch {
      setErrorMsg('Network error deleting message.');
    }
  };

  const handleUpdateReviewStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
        notifySuccess(`Review marked as ${status}!`);
      } else {
        setErrorMsg('Failed to update review status.');
      }
    } catch {
      setErrorMsg('Network error updating review status.');
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        notifySuccess('Review permanently deleted from Firestore!');
      } else {
        setErrorMsg('Failed to delete review from Firestore.');
      }
    } catch {
      setErrorMsg('Network error deleting review.');
    }
  };

  const handleUploadMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    setIsUploadingMedia(true);
    try {
      const asset = await uploadMediaAsset(
        uploadFile,
        uploadCategory,
        process.env.ADMIN_EMAIL || 'SNVADIVEL11@gmail.com'
      );
      notifySuccess(`Successfully uploaded ${asset.name} to Cloudinary CDN!`);
      setUploadFile(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(`Upload failed: ${msg}`);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (id: string, storagePath?: string) => {
    try {
      await deleteMediaAsset(id, storagePath);
      notifySuccess('Deleted asset from Cloudinary CDN & Firestore!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(`Delete failed: ${msg}`);
    }
  };

  const handleProfilePhotoUpload = async (file: File) => {
    try {
      setIsUploadingMedia(true);
      const asset = await uploadMediaAsset(
        file,
        'profile',
        process.env.ADMIN_EMAIL || 'SNVADIVEL11@gmail.com'
      );
      setProfileForm((prev) => ({
        ...prev,
        profilePhoto: asset.url,
        profileImage: asset.url,
      }));
      notifySuccess('Profile Photo uploaded to Cloudinary CDN & synced across site!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(`Profile photo upload failed: ${msg}`);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleResumeUpload = async (file: File) => {
    try {
      setIsUploadingMedia(true);
      const asset = await uploadMediaAsset(
        file,
        'resume',
        process.env.ADMIN_EMAIL || 'SNVADIVEL11@gmail.com'
      );
      setProfileForm((prev) => ({ ...prev, resumeUrl: asset.url }));
      notifySuccess('Resume PDF uploaded to Cloudinary CDN & synced!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(`Resume PDF upload failed: ${msg}`);
    } finally {
      setIsUploadingMedia(false);
    }
  };


  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center space-y-3">
        <RefreshCw size={28} className="animate-spin text-violet-400" />
        <p className="text-xs text-white/50 font-mono">Verifying Firebase Admin Authentication...</p>
      </div>
    );
  }

  const unreadBookingsCount = allBookings.filter((b: Booking) => b.status === 'New' || b.status === 'Pending' || b.unread).length;
  const unreadMessagesCount = messages.filter((m: ContactMessage) => m.status === 'New' || (!m.status && !m.read)).length;

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart2 },
    { id: 'messages', label: `Messages (${messages.length})`, icon: Mail, badge: unreadMessagesCount },
    { id: 'bookings', label: `Booking Requests (${allBookings.length})`, icon: Calendar, badge: unreadBookingsCount },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'about', label: 'About', icon: User },
    { id: 'experience', label: `Experience (${experiences.length})`, icon: Briefcase },
    { id: 'education', label: `Education (${education.length})`, icon: GraduationCap },
    { id: 'awards', label: `Awards (${awards.length})`, icon: AwardIcon },
    { id: 'certifications', label: `Certifications (${certifications.length})`, icon: ShieldCheck },
    { id: 'skills', label: `Skills (${skills.length})`, icon: Code2 },
    { id: 'projects', label: `Projects (${projects.length})`, icon: Folder },
    { id: 'services', label: `Services (${services.length})`, icon: Cpu },
    { id: 'blog', label: `Blog (${blogs.length})`, icon: BookOpen },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'socials', label: 'Social Links', icon: Share2 },
    { id: 'media', label: `Media (${mediaItems.length})`, icon: ImageIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Top Header */}
      <header className="border-b border-white/[0.08] bg-neutral-950/90 backdrop-blur-2xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white/50 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-sm sm:text-base font-bold tracking-tight">
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Abishek Digital
              </span>{' '}
              Enterprise CMS
            </h1>
            <span className="hidden sm:flex text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Realtime Sync Active
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              disabled={isLoading}
              className="p-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/60 hover:text-white transition-all text-xs flex items-center gap-1.5"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-all text-xs flex items-center gap-1.5"
            >
              <LogOut size={14} /> Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main CMS Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 flex flex-col md:flex-row gap-6">
        {/* Mobile/Desktop Responsive Navigation Bar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-20 bg-neutral-900/60 border border-white/[0.08] rounded-2xl p-3 space-y-1 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1 md:gap-1 max-h-[85vh]">
            <div className="text-[10px] uppercase font-mono font-semibold text-white/40 px-3 py-1.5 hidden md:block">
              CMS Navigation
            </div>
            {menuItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-lg shadow-violet-500/10'
                      : 'text-white/50 hover:text-white/90 hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} className={isActive ? 'text-violet-400' : 'text-white/40'} />
                    {tab.label}
                  </div>
                  {tab.badge && tab.badge > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse">
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* Notifications */}
          {statusMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} /> {statusMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold flex items-center gap-2">
              <XCircle size={16} /> {errorMsg}
            </div>
          )}

          {/* 1. DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart2 size={18} className="text-violet-400" /> Admin Overview &amp; Realtime Activity
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/50">Online Visitors</span>
                    <Activity size={18} className="text-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">{stats?.onlineVisitors || 1}</div>
                  <div className="text-[11px] text-emerald-400 mt-1">Realtime session active</div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/50">Pending Bookings</span>
                    <Calendar size={18} className="text-amber-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    {allBookings.filter((b) => b.status === 'New' || b.status === 'Pending').length}
                  </div>
                  <div className="text-[11px] text-amber-300 mt-1">Awaiting approval</div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/50">Contact Inbox</span>
                    <MessageSquare size={18} className="text-violet-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">{messages.length}</div>
                  <div className="text-[11px] text-violet-300 mt-1">Realtime msgs</div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/50">CMS Projects</span>
                    <Folder size={18} className="text-fuchsia-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">{projects.length}</div>
                  <div className="text-[11px] text-fuchsia-300 mt-1">Published in Firestore</div>
                </div>
              </div>
            </div>
          )}

          {/* 1.5 BOOKINGS MANAGEMENT PANEL */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 text-xs">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar size={18} className="text-violet-400" /> Booking Requests Management ({allBookings.length})
                  </h2>
                  <p className="text-xs text-white/50">Realtime visitor consultation requests stored in Firestore database.</p>
                </div>
                {unreadBookingsCount > 0 && (
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-400" /> {unreadBookingsCount} Unread Request{unreadBookingsCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Status Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                  <div className="text-white/50 text-[10px]">Total Requests</div>
                  <div className="text-lg font-bold text-white mt-0.5">{allBookings.length}</div>
                </div>
                <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/10">
                  <div className="text-amber-300/80 text-[10px]">New / Pending</div>
                  <div className="text-lg font-bold text-amber-300 mt-0.5">
                    {allBookings.filter((b: Booking) => b.status === 'New' || b.status === 'Pending').length}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/10">
                  <div className="text-blue-300/80 text-[10px]">Contacted</div>
                  <div className="text-lg font-bold text-blue-300 mt-0.5">
                    {allBookings.filter((b: Booking) => b.status === 'Contacted').length}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl border border-violet-500/20 bg-violet-500/10">
                  <div className="text-violet-300/80 text-[10px]">Scheduled</div>
                  <div className="text-lg font-bold text-violet-300 mt-0.5">
                    {allBookings.filter((b: Booking) => b.status === 'Scheduled' || b.status === 'Approved').length}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                  <div className="text-emerald-300/80 text-[10px]">Completed</div>
                  <div className="text-lg font-bold text-emerald-300 mt-0.5">
                    {allBookings.filter((b: Booking) => b.status === 'Completed').length}
                  </div>
                </div>
              </div>

              {/* Toolbar: Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center p-3 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search by Name, Email, Phone, or Booking ID..."
                    value={bookingSearchQuery}
                    onChange={(e) => setBookingSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-violet-500/50"
                  />
                </div>

                <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                  {(['All', 'New', 'Contacted', 'Scheduled', 'Completed', 'Rejected'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setBookingStatusFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                        bookingStatusFilter === filter
                          ? 'bg-violet-600 text-white shadow-md'
                          : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings Data Table */}
              {(() => {
                const filtered = allBookings.filter((b: Booking) => {
                  const matchesStatus =
                    bookingStatusFilter === 'All'
                      ? true
                      : bookingStatusFilter === 'Scheduled'
                      ? b.status === 'Scheduled' || b.status === 'Approved'
                      : bookingStatusFilter === 'New'
                      ? b.status === 'New' || b.status === 'Pending'
                      : b.status === bookingStatusFilter;

                  const q = bookingSearchQuery.toLowerCase().trim();
                  const matchesSearch =
                    !q ||
                    (b.bookingId && b.bookingId.toLowerCase().includes(q)) ||
                    (b.name && b.name.toLowerCase().includes(q)) ||
                    (b.email && b.email.toLowerCase().includes(q)) ||
                    (b.phone && b.phone.toLowerCase().includes(q)) ||
                    (b.serviceSelected && b.serviceSelected.toLowerCase().includes(q)) ||
                    (b.purpose && b.purpose.toLowerCase().includes(q));

                  return matchesStatus && matchesSearch;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl space-y-2">
                      <Calendar size={32} className="mx-auto text-white/30" />
                      <p className="text-white/60 font-semibold">No booking requests found.</p>
                      <p className="text-white/40 text-[11px]">Submissions from visitors will automatically appear here in realtime.</p>
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-neutral-900/60">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/[0.08] bg-white/[0.03] text-white/50 text-[11px] font-mono uppercase">
                          <th className="p-3.5">Booking ID</th>
                          <th className="p-3.5">Visitor Contact</th>
                          <th className="p-3.5">Service / Purpose</th>
                          <th className="p-3.5">Preferred Date &amp; Time</th>
                          <th className="p-3.5">Budget</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06]">
                        {filtered.map((b: Booking) => {
                          const displayId = b.bookingId || b.id || 'N/A';
                          const displayService = b.serviceSelected || b.purpose || 'Strategy Consultation';
                          const displayDate = b.preferredDate || b.date || 'TBD';
                          const displayTime = b.preferredTime || b.time || '10:00 AM';

                          const statusColors: Record<string, string> = {
                            New: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
                            Pending: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
                            Contacted: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
                            Scheduled: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
                            Approved: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
                            Completed: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
                            Rejected: 'bg-red-500/10 text-red-300 border-red-500/20',
                          };

                          return (
                            <tr key={b.id || displayId} className="hover:bg-white/[0.02] transition-colors">
                              <td className="p-3.5 font-mono text-[11px] text-violet-300 font-semibold">
                                {displayId}
                              </td>
                              <td className="p-3.5">
                                <div className="font-bold text-white">{b.name}</div>
                                <div className="text-white/50 text-[11px]">{b.email}</div>
                                <div className="text-white/40 text-[10px]">{b.phone} {b.company ? `• ${b.company}` : ''}</div>
                              </td>
                              <td className="p-3.5 text-white/80 max-w-[200px] truncate">
                                {displayService}
                              </td>
                              <td className="p-3.5 text-white/70">
                                <div className="font-semibold text-white">{displayDate}</div>
                                <div className="text-[11px] text-violet-300/80">{displayTime} ({b.timezone || 'IST'})</div>
                              </td>
                              <td className="p-3.5 font-mono text-emerald-300 font-semibold">
                                {b.projectBudget || '$2,500+'}
                              </td>
                              <td className="p-3.5">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${statusColors[b.status] || statusColors.New}`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="p-3.5">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      setSelectedBookingDetail(b);
                                      if (b.unread && b.id) {
                                        updateBookingDocument(b.id, { unread: false });
                                      }
                                    }}
                                    className="p-1.5 rounded-lg bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 border border-violet-500/20"
                                    title="View Details"
                                  >
                                    <Eye size={14} />
                                  </button>

                                  <select
                                    value={b.status}
                                    onChange={async (e) => {
                                      const newStatus = e.target.value as Booking['status'];
                                      if (b.id) {
                                        await updateBookingDocument(b.id, {
                                          status: newStatus,
                                          unread: false,
                                          updatedAt: new Date().toISOString(),
                                        });
                                        notifySuccess(`Updated ${b.name}'s booking status to ${newStatus}`);
                                      }
                                    }}
                                    className="px-2 py-1 rounded-lg bg-neutral-900 border border-white/10 text-[11px] text-white focus:outline-none"
                                  >
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Rejected">Rejected</option>
                                  </select>

                                  <button
                                    onClick={async () => {
                                      if (b.id) {
                                        await deleteBookingDocument(b.id);
                                        notifySuccess('Deleted booking request from Firestore');
                                      }
                                    }}
                                    className="p-1.5 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/20"
                                    title="Delete Booking"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          )}

          {/* 2. PROFILE CMS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <User size={18} className="text-violet-400" /> Profile CMS
                  </h2>
                  <p className="text-xs text-white/50">Edit full name, job title, single-source contact info, resume, and experience metrics.</p>
                </div>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-2">
                  <Save size={15} /> Save Profile
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-4">
                  <h3 className="text-sm font-bold text-white">Personal Identity</h3>
                  <div>
                    <label className="block text-white/60 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.fullName || ''}
                      onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={profileForm.jobTitle || ''}
                      onChange={(e) => setProfileForm((p) => ({ ...p, jobTitle: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">Headline</label>
                    <textarea
                      rows={2}
                      value={profileForm.headline || ''}
                      onChange={(e) => setProfileForm((p) => ({ ...p, headline: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">Profile Photo Upload (Cloudinary CDN)</label>
                    <div className="flex items-center gap-3">
                      {(profileForm.profilePhoto || profileForm.profileImage) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profileForm.profilePhoto || profileForm.profileImage}
                          alt="Profile Preview"
                          className="w-12 h-12 rounded-xl object-cover border border-white/20"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleProfilePhotoUpload(file);
                        }}
                        className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">Location</label>
                    <input
                      type="text"
                      value={profileForm.location || ''}
                      onChange={(e) => setProfileForm((p) => ({ ...p, location: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                    />
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-4">
                  <h3 className="text-sm font-bold text-white">Contact &amp; Key Stats (Single Source)</h3>
                  <div>
                    <label className="block text-white/60 mb-1">Email Address (Updates Everywhere)</label>
                    <input
                      type="email"
                      value={profileForm.email || ''}
                      onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">Phone Number (Updates Everywhere)</label>
                    <input
                      type="text"
                      value={profileForm.phone || ''}
                      onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">Resume File / URL (Cloudinary CDN)</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={profileForm.resumeUrl || ''}
                        onChange={(e) => setProfileForm((p) => ({ ...p, resumeUrl: e.target.value }))}
                        className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono"
                        placeholder="https://firebasestorage.googleapis.com/..."
                      />
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleResumeUpload(file);
                        }}
                        className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs w-full"
                      />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 space-y-2">
                    <div className="text-xs font-bold text-violet-300 flex items-center justify-between">
                      <span>Live Calculated Statistics</span>
                      <span className="text-[10px] font-mono bg-violet-500/20 px-2 py-0.5 rounded text-violet-200">Auto-Synced</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-neutral-900/80 border border-white/10">
                        <div className="font-bold text-white text-sm">{projects.length}</div>
                        <div className="text-[10px] text-white/50">Projects</div>
                      </div>
                      <div className="p-2 rounded-lg bg-neutral-900/80 border border-white/10">
                        <div className="font-bold text-white text-sm">{certifications.length}</div>
                        <div className="text-[10px] text-white/50">Certs</div>
                      </div>
                      <div className="p-2 rounded-lg bg-neutral-900/80 border border-white/10">
                        <div className="font-bold text-white text-sm">{awards.length}</div>
                        <div className="text-[10px] text-white/50">Awards</div>
                      </div>
                      <div className="p-2 rounded-lg bg-neutral-900/80 border border-white/10">
                        <div className="font-bold text-white text-sm">{experiences.length}</div>
                        <div className="text-[10px] text-white/50">Experience</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* 3. ABOUT CMS */}
          {activeTab === 'about' && (
            <form onSubmit={handleSaveAbout} className="space-y-6 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <User size={18} className="text-violet-400" /> About Questions &amp; Biography CMS
                  </h2>
                  <p className="text-xs text-white/50">Answer questions to update the About section content dynamically.</p>
                </div>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-2">
                  <Save size={15} /> Save About CMS
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-4">
                  <h3 className="text-sm font-bold text-white">Questions &amp; Biography</h3>
                  <div>
                    <label className="block text-white/60 mb-1">Who are you?</label>
                    <input
                      type="text"
                      value={aboutForm.whoAreYou || aboutForm.whoIAm || ''}
                      onChange={(e) => setAboutForm((a) => ({ ...a, whoAreYou: e.target.value, whoIAm: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">Tell about yourself</label>
                    <textarea
                      rows={3}
                      value={aboutForm.tellAboutYourself || aboutForm.bio || ''}
                      onChange={(e) => setAboutForm((a) => ({ ...a, tellAboutYourself: e.target.value, bio: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">What is your mission?</label>
                    <textarea
                      rows={2}
                      value={aboutForm.mission || ''}
                      onChange={(e) => setAboutForm((a) => ({ ...a, mission: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">What is your vision?</label>
                    <textarea
                      rows={2}
                      value={aboutForm.vision || ''}
                      onChange={(e) => setAboutForm((a) => ({ ...a, vision: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                    />
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-4">
                  <h3 className="text-sm font-bold text-white">Value &amp; Learning Journey</h3>
                  <div>
                    <label className="block text-white/60 mb-1">Why should clients hire you?</label>
                    <textarea
                      rows={3}
                      value={aboutForm.whyHireYou || aboutForm.whyWorkWithMe || ''}
                      onChange={(e) => setAboutForm((a) => ({ ...a, whyHireYou: e.target.value, whyWorkWithMe: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">What technologies do you use?</label>
                    <textarea
                      rows={2}
                      value={aboutForm.technologies || ''}
                      onChange={(e) => setAboutForm((a) => ({ ...a, technologies: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">What are you currently learning?</label>
                    <textarea
                      rows={2}
                      value={aboutForm.currentlyLearning || aboutForm.learningJourney || ''}
                      onChange={(e) => setAboutForm((a) => ({ ...a, currentlyLearning: e.target.value, learningJourney: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                    />
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* 4. EXPERIENCE CMS */}
          {activeTab === 'experience' && (
            <div className="space-y-6 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Briefcase size={18} className="text-violet-400" /> Work Experience Manager ({experiences.length})
                  </h2>
                  <p className="text-xs text-white/50">Manage work history, company details, employment type, and manual start/end years.</p>
                </div>
                <button onClick={handleAddExperience} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-2">
                  <Plus size={15} /> Add Experience
                </button>
              </div>

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 flex-1">
                        <input
                          type="text"
                          defaultValue={exp.role}
                          onBlur={(e) => updateExperienceDocument(exp.id!, { role: e.target.value })}
                          className="font-bold text-white text-sm bg-transparent border-b border-transparent hover:border-violet-500 focus:outline-none w-full"
                          placeholder="Role / Title"
                        />
                        <div className="flex flex-wrap gap-2 text-violet-400 items-center">
                          <input
                            type="text"
                            defaultValue={exp.company}
                            onBlur={(e) => updateExperienceDocument(exp.id!, { company: e.target.value })}
                            className="bg-transparent border-b border-transparent hover:border-violet-500 focus:outline-none font-semibold"
                            placeholder="Company Name"
                          />
                          <span>•</span>
                          <input
                            type="text"
                            defaultValue={exp.employmentType || 'Full-time'}
                            onBlur={(e) => updateExperienceDocument(exp.id!, { employmentType: e.target.value })}
                            className="bg-transparent border-b border-transparent hover:border-violet-500 focus:outline-none"
                            placeholder="Employment Type"
                          />
                        </div>
                      </div>
                      <button onClick={() => handleDeleteExp(exp.id!)} className="p-1.5 text-white/40 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] text-white/40 mb-0.5">Start Year (Manual)</label>
                        <input
                          type="text"
                          defaultValue={exp.startYear || ''}
                          onBlur={(e) => updateExperienceDocument(exp.id!, { startYear: e.target.value })}
                          placeholder="e.g. 2020"
                          className="w-full p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 mb-0.5">End Year (Manual)</label>
                        <input
                          type="text"
                          defaultValue={exp.endYear || ''}
                          onBlur={(e) => updateExperienceDocument(exp.id!, { endYear: e.target.value })}
                          placeholder="e.g. 2024 or Present"
                          className="w-full p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 mb-0.5">Location</label>
                        <input
                          type="text"
                          defaultValue={exp.location || ''}
                          onBlur={(e) => updateExperienceDocument(exp.id!, { location: e.target.value })}
                          placeholder="Location / Remote"
                          className="w-full p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs"
                        />
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      defaultValue={exp.description}
                      onBlur={(e) => updateExperienceDocument(exp.id!, { description: e.target.value })}
                      placeholder="Role responsibilities..."
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. EDUCATION CMS */}
          {activeTab === 'education' && (
            <div className="space-y-6 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <GraduationCap size={18} className="text-fuchsia-400" /> Education Manager ({education.length})
                  </h2>
                  <p className="text-xs text-white/50">Manage degrees, specialization, institutions, and manual start/end years.</p>
                </div>
                <button onClick={handleAddEducation} className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold flex items-center gap-2">
                  <Plus size={15} /> Add Education
                </button>
              </div>

              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          defaultValue={edu.degree}
                          onBlur={(e) => updateEducationDocument(edu.id!, { degree: e.target.value })}
                          className="font-bold text-white text-sm bg-transparent border-b border-transparent hover:border-fuchsia-500 focus:outline-none w-full"
                          placeholder="Degree Name"
                        />
                        <input
                          type="text"
                          defaultValue={edu.institution}
                          onBlur={(e) => updateEducationDocument(edu.id!, { institution: e.target.value })}
                          className="block text-fuchsia-400 font-semibold mt-1 bg-transparent border-b border-transparent hover:border-fuchsia-500 focus:outline-none w-full"
                          placeholder="Institution / University Name"
                        />
                      </div>
                      <button onClick={() => handleDeleteEdu(edu.id!)} className="p-1.5 text-white/40 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] text-white/40 mb-0.5">Start Year (Manual)</label>
                        <input
                          type="text"
                          defaultValue={edu.startYear || ''}
                          onBlur={(e) => updateEducationDocument(edu.id!, { startYear: e.target.value })}
                          placeholder="e.g. 2020"
                          className="w-full p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 mb-0.5">End Year (Manual)</label>
                        <input
                          type="text"
                          defaultValue={edu.endYear || ''}
                          onBlur={(e) => updateEducationDocument(edu.id!, { endYear: e.target.value })}
                          placeholder="e.g. 2024"
                          className="w-full p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 mb-0.5">Grade / CGPA</label>
                        <input
                          type="text"
                          defaultValue={edu.grade || edu.cgpa || ''}
                          onBlur={(e) => updateEducationDocument(edu.id!, { grade: e.target.value, cgpa: e.target.value })}
                          placeholder="e.g. 8.8 CGPA"
                          className="w-full p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs"
                        />
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      defaultValue={edu.description}
                      onBlur={(e) => updateEducationDocument(edu.id!, { description: e.target.value })}
                      placeholder="Academic details..."
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. AWARDS CMS */}
          {activeTab === 'awards' && (
            <div className="space-y-6 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <AwardIcon size={18} className="text-amber-400" /> Honors &amp; Awards CMS ({awards.length})
                  </h2>
                  <p className="text-xs text-white/50">Manage technical awards, competitions, and manual award years.</p>
                </div>
                <button onClick={handleAddAward} className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold flex items-center gap-2">
                  <Plus size={15} /> Add Award
                </button>
              </div>

              <div className="space-y-4">
                {awards.map((award) => (
                  <div key={award.id} className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          defaultValue={award.title}
                          onBlur={(e) => updateAwardDocument(award.id!, { title: e.target.value })}
                          className="font-bold text-white text-sm bg-transparent border-b border-transparent hover:border-amber-500 focus:outline-none w-full"
                          placeholder="Award Title"
                        />
                        <input
                          type="text"
                          defaultValue={award.organization}
                          onBlur={(e) => updateAwardDocument(award.id!, { organization: e.target.value })}
                          className="block text-amber-300 font-semibold mt-1 bg-transparent border-b border-transparent hover:border-amber-500 focus:outline-none w-full"
                          placeholder="Organization"
                        />
                      </div>
                      <button onClick={() => handleDeleteAward(award.id!)} className="p-1.5 text-white/40 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="w-48">
                      <label className="block text-[10px] text-white/40 mb-0.5">Award Year (Manual)</label>
                      <input
                        type="text"
                        defaultValue={award.year || award.date || ''}
                        onBlur={(e) => updateAwardDocument(award.id!, { year: e.target.value, date: e.target.value })}
                        placeholder="e.g. 2024"
                        className="w-full p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white font-mono text-xs"
                      />
                    </div>

                    <textarea
                      rows={2}
                      defaultValue={award.description}
                      onBlur={(e) => updateAwardDocument(award.id!, { description: e.target.value })}
                      placeholder="Award description..."
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. CERTIFICATIONS CMS */}
          {activeTab === 'certifications' && (
            <div className="space-y-6 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-400" /> Certifications Manager ({certifications.length})
                  </h2>
                  <p className="text-xs text-white/50">Manage professional cloud, architecture, and developer credentials.</p>
                </div>
                <button onClick={handleAddCertification} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-2">
                  <Plus size={15} /> Add Certification
                </button>
              </div>

              <div className="space-y-4">
                {certifications.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl text-white/40">
                    <ShieldCheck size={32} className="mx-auto mb-2 text-white/20" />
                    <h3 className="text-sm font-bold text-white">No Certifications Recorded</h3>
                    <p className="text-xs text-white/40 mt-1">Click &ldquo;+ Add Certification&rdquo; to insert new professional credentials.</p>
                  </div>
                ) : (
                  certifications.map((cert) => (
                    <div key={cert.id} className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-[10px] text-white/40 mb-0.5">Certificate Title *</label>
                            <input
                              type="text"
                              defaultValue={cert.name || cert.title || ''}
                              onBlur={(e) => updateCertificationDocument(cert.id!, { name: e.target.value, title: e.target.value })}
                              className="w-full p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm font-bold"
                              placeholder="e.g. AWS Certified Solutions Architect"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] text-white/40 mb-0.5">Issued By / Organization</label>
                              <input
                                type="text"
                                defaultValue={cert.issuer || ''}
                                onBlur={(e) => updateCertificationDocument(cert.id!, { issuer: e.target.value })}
                                className="w-full p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs"
                                placeholder="e.g. Amazon Web Services"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-white/40 mb-0.5">Category</label>
                              <input
                                type="text"
                                defaultValue={cert.category || ''}
                                onBlur={(e) => updateCertificationDocument(cert.id!, { category: e.target.value })}
                                className="w-full p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs"
                                placeholder="e.g. Cloud &amp; DevOps"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] text-white/40 mb-0.5">Completion Year (Manual)</label>
                              <input
                                type="text"
                                defaultValue={cert.issueYear || ''}
                                onBlur={(e) => updateCertificationDocument(cert.id!, { issueYear: e.target.value })}
                                className="w-full p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs"
                                placeholder="e.g. 2024"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-white/40 mb-0.5">Issue Date (Manual)</label>
                              <input
                                type="text"
                                defaultValue={cert.issueDate || ''}
                                onBlur={(e) => updateCertificationDocument(cert.id!, { issueDate: e.target.value })}
                                className="w-full p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs"
                                placeholder="e.g. March 2024"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] text-white/40 mb-0.5">Certificate Description</label>
                            <textarea
                              rows={2}
                              defaultValue={cert.description || ''}
                              onBlur={(e) => updateCertificationDocument(cert.id!, { description: e.target.value })}
                              className="w-full p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 text-xs"
                              placeholder="Brief description of technical skills validated by this certificate..."
                            />
                          </div>
                          {/* Admin Certificate Centered Preview Frame */}
                          <div className="w-full h-40 rounded-xl bg-white/95 border border-white/20 p-2 flex items-center justify-center overflow-hidden relative shadow-inner">
                            {cert.certificateImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={cert.certificateImage}
                                alt="Admin Certificate Preview"
                                className="max-w-full h-auto max-h-full object-contain rounded"
                              />
                            ) : (
                              <div className="text-center text-neutral-500 font-medium text-xs">
                                <ImageIcon size={24} className="mx-auto mb-1 opacity-50" />
                                No Certificate Uploaded
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-[10px] text-white/40 mb-0.5">Certificate Image (Cloudinary CDN)</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                defaultValue={cert.certificateImage || cert.credentialUrl || ''}
                                onBlur={(e) => updateCertificationDocument(cert.id!, { certificateImage: e.target.value, credentialUrl: e.target.value })}
                                className="w-full p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs font-mono"
                                placeholder="https://res.cloudinary.com/..."
                              />
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;

                                  console.log(file);

                                  try {
                                    setIsUploadingMedia(true);
                                    const asset = await uploadMediaAsset(file, 'certificates');

                                    console.log(asset);
                                    console.log(asset.url);

                                    if (!asset || !asset.url) {
                                      throw new Error('Cloudinary upload failed: missing secure_url');
                                    }

                                    const certificatePdf = asset.url;
                                    console.log(certificatePdf);

                                    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');

                                    await updateCertificationDocument(cert.id!, {
                                      title: cert.title || cert.name || 'Certificate',
                                      issuer: cert.issuer || '',
                                      category: cert.category || '',
                                      issueYear: cert.issueYear || '',
                                      description: cert.description || '',
                                      certificatePdf: certificatePdf,
                                      certificateImage: certificatePdf,
                                      credentialUrl: certificatePdf,
                                      fileType: isPdf ? 'pdf' : 'image',
                                    });

                                    notifySuccess(`Certificate file ${file.name} uploaded to Cloudinary CDN!`);
                                  } catch (err: unknown) {
                                    const msg = err instanceof Error ? err.message : String(err);
                                    console.error('[Certificate Upload Error]:', msg);
                                    setErrorMsg(`Certificate upload failed: ${msg}`);
                                  } finally {
                                    setIsUploadingMedia(false);
                                  }
                                }}
                                className="p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-6 pt-1 text-xs text-white/70">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                defaultChecked={cert.visible !== false}
                                onChange={(e) => updateCertificationDocument(cert.id!, { visible: e.target.checked })}
                                className="rounded bg-white/10 border-white/20 text-emerald-500"
                              />
                              Visible on Portfolio
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                defaultChecked={cert.featured || false}
                                onChange={(e) => updateCertificationDocument(cert.id!, { featured: e.target.checked })}
                                className="rounded bg-white/10 border-white/20 text-emerald-500"
                              />
                              Featured
                            </label>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteCertification(cert.id!)} className="p-2 text-white/40 hover:text-red-400">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 8. SKILLS CMS */}
          {activeTab === 'skills' && (
            <div className="space-y-6 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Code2 size={18} className="text-violet-400" /> Skills Manager ({skills.length})
                  </h2>
                  <p className="text-xs text-white/50">Manage technical skills and category groupings.</p>
                </div>
                <button onClick={handleAddSkill} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-2">
                  <Plus size={15} /> Add Skill
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-2 flex-1">
                        <div>
                          <label className="block text-[10px] text-white/40 mb-0.5">Skill Name *</label>
                          <input
                            type="text"
                            defaultValue={skill.name}
                            onBlur={(e) => updateSkillDocument(skill.id!, { name: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] font-bold text-white text-xs focus:outline-none focus:border-violet-500/50"
                            placeholder="e.g. Next.js 15"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-white/40 mb-0.5">Category</label>
                            <input
                              type="text"
                              defaultValue={skill.category || 'Frontend'}
                              onBlur={(e) => updateSkillDocument(skill.id!, { category: e.target.value })}
                              className="w-full p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs"
                              placeholder="e.g. Frontend"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-white/40 mb-0.5">Lucide Icon</label>
                            <input
                              type="text"
                              defaultValue={skill.icon || 'Code2'}
                              onBlur={(e) => updateSkillDocument(skill.id!, { icon: e.target.value })}
                              className="w-full p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-violet-300 font-mono text-xs"
                              placeholder="e.g. Code2"
                            />
                          </div>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteSkill(skill.id!)} className="p-2 text-white/40 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. PROJECTS CMS */}
          {activeTab === 'projects' && (
            <div className="space-y-6 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Folder size={18} className="text-violet-400" /> Projects CMS ({projects.length})
                  </h2>
                  <p className="text-xs text-white/50">Full CRUD management for software project cards.</p>
                </div>
                <button onClick={handleAddProject} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-2">
                  <Plus size={15} /> Add Project
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {projects.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <input
                          type="text"
                          defaultValue={p.title}
                          onBlur={(e) => updateProjectDocument(p.id!, { title: e.target.value })}
                          className="font-bold text-white text-sm bg-transparent border-b border-transparent hover:border-violet-500 focus:outline-none"
                        />
                        <span className="text-[10px] font-mono text-violet-300 block mt-0.5">Category: {p.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDuplicateProject(p)} className="p-1 text-white/40 hover:text-violet-400" title="Duplicate">
                          <Copy size={14} />
                        </button>
                        <button onClick={() => handleDeleteProject(p.id!)} className="p-1 text-white/40 hover:text-red-400" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      defaultValue={p.description}
                      onBlur={(e) => updateProjectDocument(p.id!, { description: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 focus:outline-none"
                    />
                    <div>
                      <label className="block text-[10px] text-white/40 mb-0.5">Project Image (Cloudinary CDN / URL)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          defaultValue={p.image || ''}
                          onBlur={(e) => updateProjectDocument(p.id!, { image: e.target.value })}
                          className="w-full p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs font-mono"
                          placeholder="https://..."
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                setIsUploadingMedia(true);
                                const asset = await uploadMediaAsset(file, 'projects');
                                await updateProjectDocument(p.id!, { image: asset.url });
                                notifySuccess('Project image uploaded to Cloudinary CDN!');
                              } catch (err: unknown) {
                                const msg = err instanceof Error ? err.message : String(err);
                                setErrorMsg(`Project image upload failed: ${msg}`);
                              } finally {
                                setIsUploadingMedia(false);
                              }
                            }
                          }}
                          className="p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. SERVICES CMS */}
          {activeTab === 'services' && (
            <div className="space-y-6 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Cpu size={18} className="text-indigo-400" /> Services CMS ({services.length})
                  </h2>
                  <p className="text-xs text-white/50">Manage professional service packages and features.</p>
                </div>
                <button onClick={handleAddService} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2">
                  <Plus size={15} /> Add Service
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {services.map((srv) => (
                  <div key={srv.id} className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-2">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        defaultValue={srv.title}
                        onBlur={(e) => updateServiceDocument(srv.id!, { title: e.target.value })}
                        className="font-bold text-white bg-transparent border-b border-transparent hover:border-indigo-500 focus:outline-none"
                      />
                      <button onClick={() => handleDeleteService(srv.id!)} className="p-1 text-white/40 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      defaultValue={srv.description}
                      onBlur={(e) => updateServiceDocument(srv.id!, { description: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. BLOG CMS */}
          {activeTab === 'blog' && (
            <div className="space-y-6 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <BookOpen size={18} className="text-fuchsia-400" /> Blog Articles CMS ({blogs.length})
                  </h2>
                  <p className="text-xs text-white/50">Manage engineering blog posts and technical guides.</p>
                </div>
                <button onClick={handleAddBlog} className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold flex items-center gap-2">
                  <Plus size={15} /> Add Article
                </button>
              </div>

              <div className="space-y-3">
                {blogs.map((b) => (
                  <div key={b.id} className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex justify-between items-center">
                    <div className="space-y-1">
                      <input
                        type="text"
                        defaultValue={b.title}
                        onBlur={(e) => updateBlogDocument(b.id!, { title: e.target.value })}
                        className="font-bold text-white text-sm bg-transparent border-b border-transparent hover:border-fuchsia-500 focus:outline-none"
                      />
                      <div className="text-white/50 text-[11px]">{b.category} | {b.readTime}</div>
                    </div>
                    <button onClick={() => handleDeleteBlog(b.id!)} className="p-1.5 text-white/40 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. CONTACT CMS */}
          {activeTab === 'contact' && (
            <form onSubmit={handleSaveContact} className="space-y-6 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Phone size={18} className="text-violet-400" /> Contact Details CMS (Single Source of Truth)
                  </h2>
                  <p className="text-xs text-white/50">Updating primary email or phone here updates every location across the entire site automatically.</p>
                </div>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-2">
                  <Save size={15} /> Save Contact Info
                </button>
              </div>

              <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-4 max-w-xl">
                <div>
                  <label className="block text-white/60 mb-1">Primary Email (Single Source)</label>
                  <input
                    type="email"
                    value={contactForm.email || ''}
                    onChange={(e) => setContactForm((c) => ({ ...c, email: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">Primary Phone (Single Source)</label>
                  <input
                    type="text"
                    value={contactForm.phone || ''}
                    onChange={(e) => setContactForm((c) => ({ ...c, phone: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">WhatsApp Link / Number</label>
                  <input
                    type="text"
                    value={contactForm.whatsapp || ''}
                    onChange={(e) => setContactForm((c) => ({ ...c, whatsapp: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">Location / Address</label>
                  <input
                    type="text"
                    value={contactForm.location || ''}
                    onChange={(e) => setContactForm((c) => ({ ...c, location: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                  />
                </div>
              </div>
            </form>
          )}

          {/* 13. SOCIAL LINKS CMS */}
          {activeTab === 'socials' && (
            <form onSubmit={handleSaveSocials} className="space-y-6 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Share2 size={18} className="text-violet-400" /> Social Links CMS
                  </h2>
                  <p className="text-xs text-white/50">Manage GitHub, LinkedIn, Instagram, Twitter, YouTube, and Portfolio URLs.</p>
                </div>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-2">
                  <Save size={15} /> Save Social Links
                </button>
              </div>

              <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-4 max-w-xl">
                <div>
                  <label className="block text-white/60 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={socialsForm.github || ''}
                    onChange={(e) => setSocialsForm((s) => ({ ...s, github: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={socialsForm.linkedin || ''}
                    onChange={(e) => setSocialsForm((s) => ({ ...s, linkedin: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">Instagram URL</label>
                  <input
                    type="text"
                    value={socialsForm.instagram || ''}
                    onChange={(e) => setSocialsForm((s) => ({ ...s, instagram: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">Twitter URL</label>
                  <input
                    type="text"
                    value={socialsForm.twitter || ''}
                    onChange={(e) => setSocialsForm((s) => ({ ...s, twitter: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">YouTube URL</label>
                  <input
                    type="text"
                    value={socialsForm.youtube || ''}
                    onChange={(e) => setSocialsForm((s) => ({ ...s, youtube: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono"
                  />
                </div>
              </div>
            </form>
          )}

          {/* 14. MEDIA CMS */}
          {activeTab === 'media' && (
            <div className="space-y-6 text-xs">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon size={18} className="text-violet-400" /> Cloudinary Media Library ({mediaItems.length})
              </h2>

              <form onSubmit={handleUploadMedia} className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-4">
                <h3 className="font-bold text-white text-sm">Upload New Media Asset</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as typeof uploadCategory)}
                    className="p-2.5 rounded-xl bg-neutral-900 border border-white/[0.08] text-white"
                  >
                    <option value="profile">Profile Photo</option>
                    <option value="resume">Resume PDF</option>
                    <option value="projects">Project Image</option>
                    <option value="certificates">Certificate PDF/Image</option>
                    <option value="blogs">Blog Cover</option>
                    <option value="logos">Logo Asset</option>
                  </select>
                  <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                  />
                  <button type="submit" disabled={isUploadingMedia} className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-white">
                    {isUploadingMedia ? 'Uploading...' : 'Upload to Storage'}
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {mediaItems.map((item: any) => (
                  <div key={item.id} className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-2">
                    <div className="font-bold text-white truncate">{item.name}</div>
                    <div className="text-[10px] font-mono text-violet-400">{item.category}</div>
                    <button onClick={() => handleDeleteMedia(item.id, item.storagePath)} className="text-red-400 hover:underline text-[11px]">
                      Delete Asset
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 15. SETTINGS CMS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveHero} className="space-y-6 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Settings size={18} className="text-violet-400" /> Hero &amp; Website CMS Settings
                  </h2>
                  <p className="text-xs text-white/50">Edit hero title, description, and primary CTA buttons.</p>
                </div>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-2">
                  <Save size={15} /> Save Hero Settings
                </button>
              </div>

              <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-4 max-w-xl">
                <div>
                  <label className="block text-white/60 mb-1">Name</label>
                  <input
                    type="text"
                    value={heroForm.name || ''}
                    onChange={(e) => setHeroForm((h) => ({ ...h, name: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">Hero Description</label>
                  <textarea
                    rows={3}
                    value={heroForm.description || ''}
                    onChange={(e) => setHeroForm((h) => ({ ...h, description: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                  />
                </div>
              </div>
            </form>
          )}

          {/* MESSAGES SUB-TAB */}
          {activeTab === 'messages' && (
            <div className="space-y-6 text-xs">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Mail size={18} className="text-violet-400" /> Contact Messages Management ({messages.length})
                  </h2>
                  <p className="text-xs text-white/50">View, manage, reply to, and organize visitor contact form submissions.</p>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                  <div className="text-white/40 text-[11px] font-mono">Total Messages</div>
                  <div className="text-xl font-bold text-white mt-1">{messages.length}</div>
                </div>
                <div className="p-4 rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10">
                  <div className="text-fuchsia-300 text-[11px] font-mono">New Messages</div>
                  <div className="text-xl font-bold text-fuchsia-300 mt-1">
                    {messages.filter((m) => m.status === 'New' || (!m.status && !m.read)).length}
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-sky-500/20 bg-sky-500/10">
                  <div className="text-sky-300 text-[11px] font-mono">Read Messages</div>
                  <div className="text-xl font-bold text-sky-300 mt-1">
                    {messages.filter((m) => m.status === 'Read' || (m.read && m.status !== 'Replied')).length}
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                  <div className="text-emerald-300 text-[11px] font-mono">Replied Messages</div>
                  <div className="text-xl font-bold text-emerald-300 mt-1">
                    {messages.filter((m) => m.status === 'Replied').length}
                  </div>
                </div>
              </div>

              {/* Messages Table */}
              {messages.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl text-white/40">
                  <Mail size={36} className="mx-auto mb-2 text-white/20" />
                  <h3 className="text-sm font-bold text-white">No Contact Messages Received</h3>
                  <p className="text-xs text-white/40 mt-1">Submitted messages from visitors will appear here in real time.</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/[0.08] bg-neutral-900/60 overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/[0.08] bg-white/[0.02] text-white/40 text-[10px] uppercase font-mono">
                          <th className="p-3.5">Name</th>
                          <th className="p-3.5">Email</th>
                          <th className="p-3.5">Phone</th>
                          <th className="p-3.5">Subject</th>
                          <th className="p-3.5">Preview</th>
                          <th className="p-3.5">Date</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {messages.map((msg) => {
                          const currentStatus = msg.status || (msg.read ? 'Read' : 'New');
                          return (
                            <tr key={msg.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelectedMessage(msg)}>
                              <td className="p-3.5 font-bold text-white whitespace-nowrap">{msg.name}</td>
                              <td className="p-3.5 text-violet-400 font-mono whitespace-nowrap">{msg.email}</td>
                              <td className="p-3.5 text-white/60 font-mono whitespace-nowrap">{msg.phone || '—'}</td>
                              <td className="p-3.5 text-white font-medium whitespace-nowrap max-w-[150px] truncate">{msg.subject}</td>
                              <td className="p-3.5 text-white/50 max-w-[200px] truncate">{msg.message}</td>
                              <td className="p-3.5 text-white/40 font-mono whitespace-nowrap">
                                {new Date(msg.createdAt).toLocaleDateString()}
                              </td>
                              <td className="p-3.5 whitespace-nowrap">
                                {currentStatus === 'New' && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 text-[10px] font-bold">
                                    New
                                  </span>
                                )}
                                {currentStatus === 'Read' && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
                                    Read
                                  </span>
                                )}
                                {currentStatus === 'Replied' && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                                    Replied
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedMessage(msg)}
                                    className="px-2.5 py-1 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/20 text-[11px]"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => handleCopyMessageEmail(msg.email, msg.id)}
                                    className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/70 border border-white/[0.08] text-[11px]"
                                  >
                                    {copiedMessageEmailId === msg.id ? 'Copied!' : 'Copy Email'}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    className="p-1 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Message Detail View Modal */}
              {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                  <div className="w-full max-w-2xl bg-neutral-900 border border-white/[0.1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
                    <div className="flex justify-between items-start border-b border-white/[0.08] pb-4">
                      <div>
                        <div className="text-[10px] font-mono text-violet-400 uppercase">Contact Message Detail</div>
                        <h3 className="text-lg font-bold text-white mt-0.5">{selectedMessage.subject}</h3>
                      </div>
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="p-1.5 rounded-full hover:bg-white/[0.08] text-white/50 hover:text-white"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 text-xs bg-white/[0.02] p-4 rounded-2xl border border-white/[0.06]">
                      <div>
                        <span className="text-white/40">From:</span> <strong className="text-white">{selectedMessage.name}</strong>
                      </div>
                      <div>
                        <span className="text-white/40">Email:</span> <a href={`mailto:${selectedMessage.email}`} className="text-violet-400 underline font-mono">{selectedMessage.email}</a>
                      </div>
                      <div>
                        <span className="text-white/40">Phone:</span> <strong className="text-white/80 font-mono">{selectedMessage.phone || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-white/40">Date:</span> <strong className="text-white/80 font-mono">{new Date(selectedMessage.createdAt).toLocaleString()}</strong>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/50 mb-1.5 text-[11px] font-mono uppercase">Full Message Content</label>
                      <div className="p-4 rounded-2xl bg-neutral-950 border border-white/[0.08] text-white/90 leading-relaxed whitespace-pre-wrap text-xs">
                        {selectedMessage.message}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateMessageStatus(selectedMessage.id, 'Read')}
                          className="px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold"
                        >
                          Mark as Read
                        </button>
                        <button
                          onClick={() => handleUpdateMessageStatus(selectedMessage.id, 'Replied')}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
                        >
                          Mark as Replied
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyMessageEmail(selectedMessage.email, selectedMessage.id)}
                          className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 border border-white/[0.1] text-xs font-semibold"
                        >
                          {copiedMessageEmailId === selectedMessage.id ? 'Copied Email!' : 'Copy Email'}
                        </button>
                        <button
                          onClick={async () => {
                            await handleDeleteMessage(selectedMessage.id);
                            setSelectedMessage(null);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* REVIEWS SUB-TAB */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Star size={18} className="text-amber-400" /> Reviews Moderation ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl text-white/40">
                  <Star size={32} className="mx-auto mb-2 text-white/20" />
                  <h3 className="text-sm font-bold text-white">No Reviews Yet</h3>
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{rev.name}</span>
                        <span className="text-white/50 text-xs">({rev.role} {rev.company ? `at ${rev.company}` : ''})</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            rev.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : rev.status === 'rejected'
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {rev.status ? rev.status.toUpperCase() : 'PENDING'}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                          <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-white/70 text-xs italic leading-relaxed">&ldquo;{rev.content}&rdquo;</p>
                      <div className="text-[10px] text-white/40 font-mono">
                        Submitted: {rev.createdAt ? new Date(rev.createdAt).toLocaleString() : 'N/A'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-center flex-shrink-0">
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateReviewStatus(rev.id, 'approved')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          <CheckCircle2 size={14} /> Approve
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateReviewStatus(rev.id, 'rejected')}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                        title="Delete Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* BOOKING DETAIL MODAL */}
      {selectedBookingDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto"
          onClick={() => setSelectedBookingDetail(null)}
        >
          <div
            className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBookingDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white/70 hover:text-white"
            >
              <XCircle size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <Calendar size={22} />
              </div>
              <div>
                <span className="font-mono text-[11px] text-violet-300 font-bold">
                  {selectedBookingDetail.bookingId || selectedBookingDetail.id}
                </span>
                <h3 className="text-lg font-bold text-white">{selectedBookingDetail.name}</h3>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block text-white/50 text-[10px]">Email</span>
                  <a href={`mailto:${selectedBookingDetail.email}`} className="text-violet-300 font-medium hover:underline">
                    {selectedBookingDetail.email}
                  </a>
                </div>
                <div>
                  <span className="block text-white/50 text-[10px]">Phone</span>
                  <a href={`tel:${selectedBookingDetail.phone}`} className="text-violet-300 font-medium hover:underline">
                    {selectedBookingDetail.phone}
                  </a>
                </div>
              </div>

              {selectedBookingDetail.company && (
                <div>
                  <span className="block text-white/50 text-[10px]">Company</span>
                  <span className="text-white font-medium">{selectedBookingDetail.company}</span>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block text-white/50 text-[10px]">Service / Purpose</span>
                  <span className="text-white font-semibold">
                    {selectedBookingDetail.serviceSelected || selectedBookingDetail.purpose}
                  </span>
                </div>
                <div>
                  <span className="block text-white/50 text-[10px]">Budget</span>
                  <span className="text-emerald-300 font-mono font-bold">
                    {selectedBookingDetail.projectBudget || 'Consultation'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
                <div>
                  <span className="block text-white/50 text-[10px]">Preferred Date</span>
                  <span className="text-white">{selectedBookingDetail.preferredDate || selectedBookingDetail.date}</span>
                </div>
                <div>
                  <span className="block text-white/50 text-[10px]">Preferred Time</span>
                  <span className="text-white">
                    {selectedBookingDetail.preferredTime || selectedBookingDetail.time} ({selectedBookingDetail.timezone || 'IST'})
                  </span>
                </div>
              </div>
            </div>

            <div>
              <span className="block text-white/60 mb-1 font-semibold">Project Description / Purpose</span>
              <p className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80 leading-relaxed text-xs">
                {selectedBookingDetail.projectDescription || selectedBookingDetail.message || selectedBookingDetail.purpose || 'No description provided.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-white/40">
                Created: {new Date(selectedBookingDetail.createdAt).toLocaleString()}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    if (selectedBookingDetail.id) {
                      await updateBookingDocument(selectedBookingDetail.id, { status: 'Contacted', unread: false });
                      setSelectedBookingDetail(null);
                      notifySuccess('Marked booking as Contacted');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 text-xs"
                >
                  Mark Contacted
                </button>
                <button
                  onClick={async () => {
                    if (selectedBookingDetail.id) {
                      await updateBookingDocument(selectedBookingDetail.id, { status: 'Scheduled', unread: false });
                      setSelectedBookingDetail(null);
                      notifySuccess('Marked booking as Scheduled');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-500 text-xs"
                >
                  Mark Scheduled
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
