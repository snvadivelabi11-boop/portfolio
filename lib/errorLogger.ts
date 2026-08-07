import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

export interface ErrorLogItem {
  id?: string;
  source: 'Frontend' | 'Backend API' | 'Firebase' | 'Gemini AI' | 'GitHub Sync' | 'Authentication' | 'Network';
  message: string;
  stack?: string;
  route?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved?: boolean;
}

// 1. Log System Error to Firestore
export async function logSystemError(
  source: ErrorLogItem['source'],
  message: string,
  severity: ErrorLogItem['severity'] = 'medium',
  route: string = '/',
  stack?: string
): Promise<ErrorLogItem> {
  const errorItem: ErrorLogItem = {
    source,
    message,
    severity,
    route,
    stack,
    timestamp: new Date().toISOString(),
    resolved: false,
  };

  if (db) {
    try {
      console.log(`[Error Logger] Logging ${severity} ${source} error: ${message}`);
      const docRef = await addDoc(collection(db, 'error_logs'), errorItem);
      errorItem.id = docRef.id;
    } catch (err) {
      console.error('[Error Logger Firestore Fail]:', err);
    }
  }

  return errorItem;
}

// 2. Fetch Recent Error Logs
export async function getRecentErrorLogs(maxCount: number = 20): Promise<ErrorLogItem[]> {
  if (db) {
    try {
      const q = query(collection(db, 'error_logs'), orderBy('timestamp', 'desc'), limit(maxCount));
      const snapshot = await getDocs(q);
      const list: ErrorLogItem[] = [];
      snapshot.forEach((docSnap) => list.push({ id: docSnap.id, ...docSnap.data() } as ErrorLogItem));
      return list;
    } catch {
      // Fallback
    }
  }
  return [];
}

// 3. Realtime Listener
export function subscribeErrorLogs(callback: (logs: ErrorLogItem[]) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback([]);
    return () => {};
  }

  try {
    const q = query(collection(db, 'error_logs'), orderBy('timestamp', 'desc'), limit(30));
    return onSnapshot(q, (snapshot) => {
      const list: ErrorLogItem[] = [];
      snapshot.forEach((docSnap) => list.push({ id: docSnap.id, ...docSnap.data() } as ErrorLogItem));
      callback(list);
    });
  } catch {
    callback([]);
    return () => {};
  }
}
