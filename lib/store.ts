import { Review, ContactMessage, VisitorLog, AnalyticsStats, Booking } from '@/types';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';

// ============================================================
// Real-Data Production In-Memory State (NO FAKE / DEMO DATA)
// Starts completely empty until real users or Firestore supply entries
// ============================================================
let reviewsStore: Review[] = [];
let messagesStore: ContactMessage[] = [];
let bookingsStore: Booking[] = [];
let visitorLogs: VisitorLog[] = [];

// Helper to sanitize text strings (XSS protection)
export function sanitizeInput(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// ============================================================
// BOOKINGS FIRESTORE & STORE HELPERS
// ============================================================
export async function getAllBookings(): Promise<Booking[]> {
  if (db) {
    try {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const firestoreBookings: Booking[] = [];
      querySnapshot.forEach((docSnap) => {
        firestoreBookings.push({ ...docSnap.data(), id: docSnap.id } as Booking);
      });
      return firestoreBookings;
    } catch {
      // Fallback
    }
  }
  return [];
}

export async function createBooking(
  bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>
): Promise<Booking> {
  const newBooking: Booking = {
    id: '',
    date: sanitizeInput(bookingData.date || ''),
    time: sanitizeInput(bookingData.time || ''),
    name: sanitizeInput(bookingData.name),
    email: sanitizeInput(bookingData.email),
    phone: sanitizeInput(bookingData.phone),
    purpose: sanitizeInput(bookingData.purpose || ''),
    company: bookingData.company ? sanitizeInput(bookingData.company) : undefined,
    meetingType: bookingData.meetingType ? sanitizeInput(bookingData.meetingType) : undefined,
    message: bookingData.message ? sanitizeInput(bookingData.message) : undefined,
    timezone: sanitizeInput(bookingData.timezone || ''),
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  if (db) {
    try {
      const payload = { ...newBooking };
      delete (payload as Partial<Booking>).id;
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([, val]) => val !== undefined)
      );
      const docRef = await addDoc(collection(db, 'bookings'), cleanPayload);
      newBooking.id = docRef.id;
    } catch (err) {
      console.error('[createBooking Error]:', err);
    }
  }

  if (!newBooking.id) {
    newBooking.id = `bk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  }

  bookingsStore.unshift(newBooking);
  return newBooking;
}

export async function approveBooking(id: string): Promise<Booking | null> {
  let booking = bookingsStore.find((b) => b.id === id);

  const meetId = `${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
  const googleMeetLink = `https://meet.google.com/${meetId}`;

  const dateFormatted = (booking?.date || new Date().toISOString().split('T')[0]).replace(/-/g, '');
  const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Abishek Digital//Strategy Call//EN
BEGIN:VEVENT
SUMMARY:Strategy Call with Abishek (${booking?.purpose || 'Consultation'})
DESCRIPTION:Virtual strategy call with Abishek. Google Meet: ${googleMeetLink}
LOCATION:${googleMeetLink}
DTSTART:${dateFormatted}T100000Z
DTEND:${dateFormatted}T103000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  if (booking) {
    booking.status = 'Approved';
    booking.googleMeetLink = googleMeetLink;
    booking.calendarIcsData = icsData;
  }

  if (db) {
    try {
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, {
        status: 'Approved',
        googleMeetLink,
        calendarIcsData: icsData,
      });
    } catch (err) {
      console.error('[approveBooking Error]:', err);
    }
  }

  if (!booking) {
    booking = {
      id,
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      name: 'Client Booking',
      email: 'client@example.com',
      phone: '',
      purpose: 'Consultation',
      timezone: 'Asia/Kolkata (IST)',
      status: 'Approved',
      googleMeetLink,
      calendarIcsData: icsData,
      createdAt: new Date().toISOString(),
    };
  }

  return booking;
}

export async function rejectBooking(id: string): Promise<boolean> {
  const booking = bookingsStore.find((b) => b.id === id);
  if (booking) booking.status = 'Rejected';

  if (db) {
    try {
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, { status: 'Rejected' });
    } catch (err) {
      console.error('[rejectBooking Error]:', err);
      return false;
    }
  }
  return true;
}

export async function deleteBooking(id: string): Promise<boolean> {
  if (!id) return false;
  if (db) {
    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (err) {
      console.error('[deleteBooking Error]:', err);
      return false;
    }
  }
  bookingsStore = bookingsStore.filter((b) => b.id !== id);
  return true;
}

// ============================================================
// REVIEWS FIRESTORE & STORE HELPERS
// ============================================================
export async function getApprovedReviews(): Promise<Review[]> {
  if (db) {
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const firestoreReviews: Review[] = [];
      querySnapshot.forEach((docSnap) => {
        const r = { ...docSnap.data(), id: docSnap.id } as Review;
        if (r.status !== 'rejected') firestoreReviews.push(r);
      });
      return firestoreReviews;
    } catch (err) {
      console.error('[getApprovedReviews Error]:', err);
    }
  }
  return [];
}

export function subscribeApprovedReviews(callback: (reviews: Review[]) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback([]);
    return () => {};
  }

  try {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: Review[] = [];
        snapshot.forEach((docSnap) => {
          const r = { ...docSnap.data(), id: docSnap.id } as Review;
          if (r.status !== 'rejected') {
            list.push(r);
          }
        });
        callback(list);
      },
      () => callback([])
    );
  } catch (err) {
    console.error('[subscribeApprovedReviews Error]:', err);
    callback([]);
    return () => {};
  }
}

export async function getAllReviews(): Promise<Review[]> {
  if (db) {
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const firestoreReviews: Review[] = [];
      querySnapshot.forEach((docSnap) => {
        firestoreReviews.push({ ...docSnap.data(), id: docSnap.id } as Review);
      });
      return firestoreReviews;
    } catch (err) {
      console.error('[getAllReviews Error]:', err);
    }
  }
  return [];
}

export async function submitReview(review: Omit<Review, 'id' | 'status' | 'createdAt'>): Promise<Review> {
  const newReview: Review = {
    id: '',
    name: sanitizeInput(review.name),
    role: sanitizeInput(review.role),
    company: review.company ? sanitizeInput(review.company) : undefined,
    content: sanitizeInput(review.content),
    rating: Math.min(5, Math.max(1, review.rating)),
    avatar: review.avatar ? sanitizeInput(review.avatar) : undefined,
    status: 'approved',
    createdAt: new Date().toISOString(),
  };

  if (db) {
    try {
      const payload = { ...newReview };
      delete (payload as Partial<Review>).id;
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([, val]) => val !== undefined)
      );
      const docRef = await addDoc(collection(db, 'reviews'), cleanPayload);
      newReview.id = docRef.id;
    } catch (err) {
      console.error('[submitReview Error]:', err);
    }
  }

  if (!newReview.id) {
    newReview.id = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  }

  reviewsStore.unshift(newReview);
  return newReview;
}

export async function updateReviewStatus(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
  if (!id) return false;
  if (db) {
    try {
      await updateDoc(doc(db, 'reviews', id), { status });
    } catch (err) {
      console.error('[updateReviewStatus Error]:', err);
      return false;
    }
  }

  const review = reviewsStore.find((r) => r.id === id);
  if (review) review.status = status;
  return true;
}

export async function deleteReview(id: string): Promise<boolean> {
  if (!id) return false;
  if (db) {
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (err) {
      console.error('[deleteReview Error]:', err);
      return false;
    }
  }
  reviewsStore = reviewsStore.filter((r) => r.id !== id);
  return true;
}

// ============================================================
// MESSAGES FIRESTORE & STORE HELPERS
// ============================================================
export async function getContactMessages(): Promise<ContactMessage[]> {
  if (db) {
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const firestoreMessages: ContactMessage[] = [];
      querySnapshot.forEach((docSnap) => {
        firestoreMessages.push({ ...docSnap.data(), id: docSnap.id } as ContactMessage);
      });
      return firestoreMessages;
    } catch (err) {
      console.error('[getContactMessages Error]:', err);
    }
  }
  return [];
}

export async function saveContactMessage(msg: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<ContactMessage> {
  const newMsg: ContactMessage = {
    id: '',
    name: sanitizeInput(msg.name),
    email: sanitizeInput(msg.email),
    phone: msg.phone ? sanitizeInput(msg.phone) : undefined,
    subject: sanitizeInput(msg.subject),
    message: sanitizeInput(msg.message),
    createdAt: new Date().toISOString(),
    read: false,
    status: 'New',
  };

  if (db) {
    try {
      const payload = { ...newMsg };
      delete (payload as Partial<ContactMessage>).id;
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([, val]) => val !== undefined)
      );
      const docRef = await addDoc(collection(db, 'messages'), cleanPayload);
      newMsg.id = docRef.id;
    } catch (err) {
      console.error('[saveContactMessage Error]:', err);
    }
  }

  if (!newMsg.id) {
    newMsg.id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  }

  messagesStore.unshift(newMsg);
  return newMsg;
}

export async function updateContactMessageStatus(
  id: string,
  status: 'New' | 'Read' | 'Replied'
): Promise<boolean> {
  if (!id) return false;
  const read = status !== 'New';

  if (db) {
    try {
      const msgRef = doc(db, 'messages', id);
      await updateDoc(msgRef, { status, read });
    } catch (err) {
      console.error('[updateContactMessageStatus Error]:', err);
      return false;
    }
  }

  const msg = messagesStore.find((m) => m.id === id);
  if (msg) {
    msg.status = status;
    msg.read = read;
  }
  return true;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  if (!id) return false;
  if (db) {
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (err) {
      console.error('[deleteContactMessage Error]:', err);
      return false;
    }
  }
  messagesStore = messagesStore.filter((m) => m.id !== id);
  return true;
}

export function subscribeMessages(callback: (messages: ContactMessage[]) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback([]);
    return () => {};
  }

  try {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const list: ContactMessage[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as ContactMessage);
      });
      callback(list);
    }, () => callback([]));
  } catch {
    callback([]);
    return () => {};
  }
}

// ============================================================
// VISITOR ANALYTICS TELEMETRY HELPERS
// ============================================================
export async function trackVisitorLog(log: Omit<VisitorLog, 'id' | 'timestamp'>): Promise<void> {
  const newLog: VisitorLog = {
    id: `vis-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...log,
  };

  if (db) {
    try {
      await addDoc(collection(db, 'visitors'), newLog);
    } catch {
      // Fallback
    }
  }

  visitorLogs.unshift(newLog);
  if (visitorLogs.length > 500) {
    visitorLogs = visitorLogs.slice(0, 500);
  }
}

export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  const now = Date.now();
  const fiveMinsAgo = now - 5 * 60 * 1000;

  const activeCount = visitorLogs.filter((v) => new Date(v.timestamp).getTime() > fiveMinsAgo).length;
  const totalVisits = visitorLogs.length;

  const devicesMap: Record<string, number> = {};
  visitorLogs.forEach((v) => {
    devicesMap[v.device] = (devicesMap[v.device] || 0) + 1;
  });

  const browserMap: Record<string, number> = {};
  visitorLogs.forEach((v) => {
    browserMap[v.browser] = (browserMap[v.browser] || 0) + 1;
  });

  const countryMap: Record<string, number> = {};
  visitorLogs.forEach((v) => {
    countryMap[v.country] = (countryMap[v.country] || 0) + 1;
  });

  return {
    onlineVisitors: activeCount,
    totalVisitors: totalVisits,
    pageViewsToday: totalVisits,
    totalBookings: 0,
    pendingBookingsCount: 0,
    deviceBreakdown: Object.entries(devicesMap).map(([device, count]) => ({ device, count })),
    browserBreakdown: Object.entries(browserMap).map(([browser, count]) => ({ browser, count })),
    topCountries: Object.entries(countryMap).map(([country, count]) => ({ country, count })),
    recentVisitors: visitorLogs.slice(0, 10),
    trafficSources: [
      { source: 'Direct', count: totalVisits },
    ],
  };
}
