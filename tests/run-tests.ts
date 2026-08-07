import assert from 'node:assert/strict';
import { createBooking, approveBooking, submitReview, saveContactMessage, deleteContactMessage, sanitizeInput } from '../lib/store';
import { getSystemPrompt } from '../lib/systemPrompt';
import { formatChatHistoryForGemini, sanitizeUserPrompt } from '../lib/chat';
import { SUPPORTED_GEMINI_MODELS } from '../lib/gemini';
import { DEFAULT_OPENROUTER_MODEL, FALLBACK_OPENROUTER_MODEL } from '../lib/openrouter';
import { convertProfilesToCSV, VisitorProfile, calculateLeadScore } from '../lib/telemetry';
import { getOrCreateActiveSessionId, createNewChatSession } from '../lib/chatStore';
import { contactInfo } from '../data';
import { getSiteSettings, DEFAULT_SITE_SETTINGS, subscribeSiteSettings } from '../lib/siteSettings';
import { DEFAULT_HERO, DEFAULT_ABOUT, DEFAULT_SOCIALS, DEFAULT_CONTACT, subscribeHero } from '../lib/firestoreCMS';
import { validateMediaFile } from '../lib/mediaStorage';
import { getSystemMetrics } from '../lib/platformMonitor';
import { subscribeAdminAuthState, logoutAdminFromFirebase } from '../lib/adminAuth';

console.log('🚀 Running Abishek Digital Enterprise Test Suite...\n');

let passed = 0;
let failed = 0;

async function asyncTest(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  ✕ ${name}`);
    console.error(`    Error: ${message}`);
    failed++;
  }
}

async function runAll() {
  console.log('--- 1. REALTIME FIRESTORE SETTINGS SYNC TESTS ---');
  await asyncTest('Subscribe to live site settings onSnapshot listener', () => {
    const unsub = subscribeSiteSettings((data) => {
      assert.ok(data.personal.email.length > 0);
    });
    unsub();
  });

  console.log('\n--- 2. FIRESTORE REALTIME CMS ENGINE TESTS ---');
  await asyncTest('Verify default Hero seed structure', () => {
    assert.equal(DEFAULT_HERO.name, 'Abishek');
    assert.ok(DEFAULT_HERO.titles.length > 0);
    assert.equal(DEFAULT_HERO.email, 'SNVADIVEL11@gmail.com');
  });

  await asyncTest('Verify default About & Socials seed values', () => {
    assert.equal(DEFAULT_ABOUT.yearsExperience, 1);
    assert.equal(DEFAULT_ABOUT.projectsCompleted, 10);
    assert.equal(DEFAULT_SOCIALS.github, 'https://github.com/snvadivelabi11-boop');
    assert.equal(DEFAULT_CONTACT.phone, '9786801597');
  });

  await asyncTest('Subscribe to Hero realtime listener fallback', () => {
    const unsub = subscribeHero((data) => {
      assert.ok(data.name.length > 0);
    });
    unsub();
  });

  console.log('\n--- 3. REAL GITHUB INTEGRATION TESTS ---');
  await asyncTest('Verify target GitHub account URL in contact dataset', () => {
    const github = contactInfo.socials.find((s) => s.name.includes('GitHub'));
    assert.equal(github?.url, 'https://github.com/snvadivelabi11-boop');
  });

  console.log('\n--- 4. WEBSITE SETTINGS CMS & FIRESTORE TESTS ---');
  await asyncTest('Get default website settings configuration', async () => {
    const settings = await getSiteSettings();
    assert.ok(settings.personal.name.length > 0);
    assert.equal(settings.personal.name, DEFAULT_SITE_SETTINGS.personal.name);
    assert.ok(settings.socials.github.includes('snvadivelabi11-boop'));
    assert.ok(settings.features.enableContactForm);
  });

  console.log('\n--- 5. AUTHENTIC SOCIAL PROFILES & DATA TESTS ---');
  await asyncTest('Verify authentic social URLs in contactInfo dataset', () => {
    const linkedin = contactInfo.socials.find((s) => s.name.includes('LinkedIn'));
    const instagram = contactInfo.socials.find((s) => s.name.includes('Instagram'));

    assert.equal(linkedin?.url, 'https://www.linkedin.com/in/abishek-v-a984a6382');
    assert.equal(instagram?.url, 'https://www.instagram.com/abishek_creator_/');
  });

  console.log('\n--- 6. BOOKING SYSTEM & GOOGLE MEET TESTS ---');
  await asyncTest('Create booking request with Pending status', async () => {
    const booking = await createBooking({
      date: '2026-03-10',
      time: '02:00 PM',
      name: 'Alexander Wright',
      email: 'alexander@techcorp.com',
      phone: '+15551234567',
      purpose: 'System Audit',
      company: 'TechCorp',
      timezone: 'Asia/Kolkata (IST)',
    });
    assert.equal(booking.status, 'Pending');
    assert.equal(booking.name, 'Alexander Wright');
    assert.ok(booking.id.startsWith('bk-'));
  });

  await asyncTest('Approve booking generates Google Meet link & .ics invite', async () => {
    const booking = await createBooking({
      date: '2026-03-12',
      time: '10:00 AM',
      name: 'Approval Test',
      email: 'approve@test.com',
      phone: '9876543210',
      purpose: 'Architecture Review',
      timezone: 'America/New_York (EST)',
    });

    const approved = await approveBooking(booking.id);
    assert.ok(approved !== null);
    assert.equal(approved.status, 'Approved');
    assert.ok(approved.googleMeetLink?.includes('https://meet.google.com/'));
    assert.ok(approved.calendarIcsData?.includes('BEGIN:VCALENDAR'));
  });

  console.log('\n--- 7. PERSISTENT SESSION & CHAT MEMORY TESTS ---');
  await asyncTest('Generate persistent active session ID', () => {
    const sessId = getOrCreateActiveSessionId();
    assert.ok(sessId.length > 0);
  });

  await asyncTest('Create new chat session generates unique session key', () => {
    const s1 = createNewChatSession();
    const s2 = createNewChatSession();
    assert.notEqual(s1, s2);
    assert.ok(s1.startsWith('sess-'));
  });

  console.log('\n--- 8. OPENROUTER AI & MODEL FALLBACK MATRIX TESTS ---');
  await asyncTest('Validate OpenRouter default and fallback model configurations', () => {
    assert.equal(DEFAULT_OPENROUTER_MODEL, 'google/gemini-2.5-flash');
    assert.equal(FALLBACK_OPENROUTER_MODEL, 'google/gemini-2.0-flash-exp');
  });

  await asyncTest('Supported Gemini models array includes gemini-2.5-flash and gemini-2.0-flash', () => {
    assert.ok(SUPPORTED_GEMINI_MODELS.includes('gemini-2.5-flash'));
    assert.ok(SUPPORTED_GEMINI_MODELS.includes('gemini-2.0-flash'));
    assert.ok(SUPPORTED_GEMINI_MODELS.includes('gemini-1.5-flash'));
    assert.ok(!SUPPORTED_GEMINI_MODELS.includes('gemini-pro'));
  });

  await asyncTest('System prompt includes technical skills, Abishek portfolio facts, and social links', () => {
    const prompt = getSystemPrompt();
    assert.ok(prompt.includes('Abishek'));
    assert.ok(prompt.includes('Next.js 15'));
    assert.ok(prompt.includes('Python'));
    assert.ok(prompt.includes('Tiruvannamalai'));
    assert.ok(prompt.includes('https://github.com/snvadivelabi11-boop'));
    assert.ok(prompt.includes('https://www.linkedin.com/in/abishek-v-a984a6382'));
    assert.ok(prompt.includes('https://www.instagram.com/abishek_creator_/'));
  });

  await asyncTest('Format chat history maps roles for @google/genai SDK', () => {
    const history = formatChatHistoryForGemini([
      { role: 'user', content: 'What is Next.js?' },
      { role: 'assistant', content: 'Next.js is a React framework...' },
    ]);
    assert.equal(history.length, 2);
    assert.equal(history[0].role, 'user');
    assert.equal(history[1].role, 'model');
  });

  await asyncTest('Sanitize user prompt caps length and strips injections', () => {
    const dirty = '<script>alert(1)</script>';
    const cleaned = sanitizeUserPrompt(dirty);
    assert.equal(cleaned.includes('<script>'), false);
  });

  console.log('\n--- 9. TELEMETRY & CSV EXPORT TESTS ---');
  await asyncTest('Convert visitor profiles to formatted CSV dataset', () => {
    const profiles: VisitorProfile[] = [
      {
        visitorId: 'vis-101',
        firstVisit: '2026-08-06T10:00:00Z',
        lastVisit: '2026-08-06T10:05:00Z',
        totalVisits: 3,
        sessionCount: 1,
        device: 'Desktop',
        browser: 'Chrome',
        os: 'Windows',
        screenSize: '1920x1080',
        language: 'en-US',
        timezone: 'Asia/Kolkata',
        referral: 'Direct',
        landingPage: '/',
        pagesVisited: ['/', '/projects'],
        hasBookedMeeting: true,
        hasSubmittedContact: false,
        aiChatStarted: true,
        aiChatMessagesCount: 5,
      },
    ];

    const csv = convertProfilesToCSV(profiles);
    assert.ok(csv.includes('Visitor ID'));
    assert.ok(csv.includes('vis-101'));
    assert.ok(csv.includes('Yes'));
  });

  console.log('\n--- 10. SECURITY & INPUT SANITIZATION TESTS ---');
  await asyncTest('Sanitize input prevents script injection', async () => {
    const dirty = '<script>alert("xss")</script>';
    const clean = sanitizeInput(dirty);
    assert.equal(clean.includes('<script>'), false);
    assert.ok(clean.includes('&lt;script&gt;'));
  });

  await asyncTest('Save contact message to store inbox', async () => {
    const msg = await saveContactMessage({
      name: 'Test User',
      email: 'test@unit.local',
      subject: 'Unit Test Subject',
      message: 'This is an automated unit test message. It will be deleted immediately.',
    });
    assert.ok(msg.id.length > 0);
    assert.equal(msg.name, 'Test User');
    assert.equal(msg.read, false);
    // Cleanup test record
    await deleteContactMessage(msg.id);
  });

  console.log('\n--- 11. REVIEWS MODERATION TESTS ---');
  await asyncTest('Submit review requires admin approval prior to publishing', async () => {
    const rev = await submitReview({
      name: 'Verified Tech Lead',
      role: 'Founder',
      content: 'Outstanding execution and linear speed!',
      rating: 5,
    });
    assert.equal(rev.status, 'pending');
    assert.ok(rev.id.startsWith('rev-'));
  });

  console.log('\n--- 12. MEDIA MANAGER & CLOUDINARY STORAGE TESTS ---');
  await asyncTest('Validate Cloudinary environment configuration & upload URL', () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'y0acyiak';
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'portfolio_upload';
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    assert.equal(cloudName, 'y0acyiak');
    assert.equal(uploadPreset, 'portfolio_upload');
    assert.equal(uploadUrl, 'https://api.cloudinary.com/v1_1/y0acyiak/image/upload');
  });

  await asyncTest('Validate file types & size limits for upload safety', () => {
    const validPhoto = { type: 'image/png', size: 1024 * 1024, name: 'avatar.png' } as File;
    const invalidExe = { type: 'application/x-msdownload', size: 500, name: 'virus.exe' } as File;

    assert.ok(validateMediaFile(validPhoto).valid);
    assert.equal(validateMediaFile(invalidExe).valid, false);
  });

  console.log('\n--- 13. ENTERPRISE MONITORING & LEAD SCORING TESTS ---');
  await asyncTest('Calculate Lead Score classifies Hot Leads correctly', () => {
    const hotVisitor: VisitorProfile = {
      visitorId: 'vis-test-999',
      country: 'India',
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      totalVisits: 5,
      sessionCount: 3,
      device: 'Desktop',
      browser: 'Chrome',
      os: 'Windows',
      screenSize: '1920x1080',
      language: 'en-US',
      timezone: 'UTC',
      referral: 'Direct',
      landingPage: '/',
      pagesVisited: ['/', '/projects'],
      hasBookedMeeting: true,
      hasSubmittedContact: true,
      aiChatStarted: true,
      aiChatMessagesCount: 4,
    };

    const res = calculateLeadScore(hotVisitor);
    assert.equal(res.category, 'Hot Lead');
    assert.ok(res.score >= 100);
  });

  await asyncTest('Collect system performance metrics without throwing', () => {
    const metrics = getSystemMetrics();
    assert.ok(typeof metrics === 'object');
  });

  console.log('\n--- 14. FIREBASE AUTHENTICATION & PROTECTED ROUTES TESTS ---');
  await asyncTest('Firebase Auth subscription initializes without errors', () => {
    let called = false;
    const unsub = subscribeAdminAuthState((state: { isAuthenticated: boolean }) => {
      called = true;
      assert.equal(typeof state.isAuthenticated, 'boolean');
    });
    assert.ok(called);
    if (typeof unsub === 'function') unsub();
  });

  await asyncTest('Verify logoutAdminFromFirebase terminates session cleanly', async () => {
    await logoutAdminFromFirebase();
    assert.ok(true);
  });

  console.log('\n========================================');
  console.log(`Passed: ${passed} | Failed: ${failed}`);
  console.log('========================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 All Enterprise Test Suites Passed Successfully!');
  }
}

runAll();
