import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

export interface AdminAuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// 1. Authenticate Admin via Firebase Email & Password
export async function loginAdminWithFirebase(email: string, pass: string): Promise<{ success: boolean; error?: string; user?: User }> {
  if (!auth) {
    return { success: false, error: 'Firebase Auth is not initialized.' };
  }

  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const idToken = await credential.user.getIdToken();

    // Establish HTTP-only session cookie with backend
    await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: idToken }),
    });

    return { success: true, user: credential.user };
  } catch (err: unknown) {
    const errorObj = err as { code?: string; message?: string };
    const code = errorObj.code || '';

    let userFriendlyMsg = 'Authentication failed. Please verify your credentials.';

    if (code === 'auth/invalid-email') {
      userFriendlyMsg = 'Invalid email address format.';
    } else if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      userFriendlyMsg = 'Invalid email or password. Please verify your admin credentials.';
    } else if (code === 'auth/user-disabled') {
      userFriendlyMsg = 'This admin account has been disabled.';
    } else if (code === 'auth/too-many-requests') {
      userFriendlyMsg = 'Too many failed login attempts. Please wait a few moments before trying again.';
    } else if (code === 'auth/network-request-failed') {
      userFriendlyMsg = 'Network connection failed. Please check your internet connection.';
    }

    return {
      success: false,
      error: userFriendlyMsg,
    };
  }
}

// 2. Logout Admin from Firebase Session
export async function logoutAdminFromFirebase(): Promise<void> {
  if (auth) {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('[Firebase Auth Logout Error]:', err);
    }
  }

  // Clear HTTP-only session cookie
  try {
    await fetch('/api/admin/login', { method: 'DELETE' });
  } catch {
    // Ignore cookie clear error
  }
}

// 3. Realtime Auth State Subscription Listener
export function subscribeAdminAuthState(callback: (state: AdminAuthState) => void): () => void {
  if (typeof window === 'undefined' || !auth) {
    callback({ user: null, isAuthenticated: false, loading: false });
    return () => {};
  }

  let resolved = false;

  const unsub = onAuthStateChanged(auth, async (user) => {
    resolved = true;
    if (user) {
      try {
        const token = await user.getIdToken();
        await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      } catch {
        // Sync token silently
      }
      callback({ user, isAuthenticated: true, loading: false });
    } else {
      callback({ user: null, isAuthenticated: false, loading: false });
    }
  });

  // Fast-path: If currentUser is already cached synchronously and listener hasn't fired
  if (!resolved && auth.currentUser) {
    callback({ user: auth.currentUser, isAuthenticated: true, loading: false });
  }

  return unsub;
}
