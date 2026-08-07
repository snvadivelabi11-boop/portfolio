import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBN1dG_B_gR8llQKEaZc2WmT-jfsePASmI',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'abishek-ac5dc.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'abishek-ac5dc',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'abishek-ac5dc.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '435773376064',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:435773376064:web:f399cd50db223d00e1c1a5',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-MVT61V21WR',
};

// Initialize Firebase App
export const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Initialize Analytics safely on client side only
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics unsupported environments (e.g. ad blockers / SSR)
  });
}
