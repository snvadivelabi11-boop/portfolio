import { db } from '@/lib/firebase';
import { getOrCreateVisitorId } from '@/lib/telemetry';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

export interface SavedChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isError?: boolean;
}

export interface ChatSession {
  sessionId: string;
  visitorId: string;
  userId?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: SavedChatMessage[];
}

const LOCAL_ACTIVE_SESSION_KEY = 'abishek_active_chat_session_id';

// 1. Get or Create Active Chat Session ID
export function getOrCreateActiveSessionId(): string {
  if (typeof window === 'undefined') {
    return `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  }
  let activeId = localStorage.getItem(LOCAL_ACTIVE_SESSION_KEY);
  if (!activeId) {
    activeId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    localStorage.setItem(LOCAL_ACTIVE_SESSION_KEY, activeId);
  }
  return activeId;
}

// 2. Start a New Chat Session
export function createNewChatSession(): string {
  const newSessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_ACTIVE_SESSION_KEY, newSessionId);
  }
  return newSessionId;
}

// 3. Load All Saved Chat Sessions for Current Visitor
export async function loadVisitorChatSessions(): Promise<ChatSession[]> {
  if (typeof window === 'undefined') return [];

  const visitorId = getOrCreateVisitorId();
  if (db) {
    try {
      const q = query(
        collection(db, 'chats'),
        where('visitorId', '==', visitorId),
        orderBy('updatedAt', 'desc')
      );
      const querySnap = await getDocs(q);
      const sessions: ChatSession[] = [];
      querySnap.forEach((docSnap) => {
        sessions.push(docSnap.data() as ChatSession);
      });
      if (sessions.length > 0) return sessions;
    } catch {
      // Fallback
    }
  }

  // LocalStorage Fallback
  const raw = localStorage.getItem(`abishek_chats_${visitorId}`);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return [];
}

// 4. Save/Append Message to Active Chat Session in Firestore & LocalStorage
export async function saveSessionMessage(
  sessionId: string,
  message: SavedChatMessage,
  firstUserMessageSnippet?: string
): Promise<void> {
  if (typeof window === 'undefined') return;

  const visitorId = getOrCreateVisitorId();
  const now = new Date().toISOString();

  const sessions = await loadVisitorChatSessions();
  let currentSession = sessions.find((s) => s.sessionId === sessionId);

  if (!currentSession) {
    currentSession = {
      sessionId,
      visitorId,
      title: firstUserMessageSnippet ? firstUserMessageSnippet.slice(0, 30) + '...' : 'Conversation',
      createdAt: now,
      updatedAt: now,
      messages: [message],
    };
    sessions.unshift(currentSession);
  } else {
    currentSession.messages.push(message);
    currentSession.updatedAt = now;
    if (firstUserMessageSnippet && currentSession.title === 'Conversation') {
      currentSession.title = firstUserMessageSnippet.slice(0, 30) + '...';
    }
  }

  // Save to LocalStorage
  localStorage.setItem(`abishek_chats_${visitorId}`, JSON.stringify(sessions));

  // Save to Firestore
  if (db) {
    try {
      const chatRef = doc(db, 'chats', sessionId);
      const existingDoc = sessions.find((s) => s.sessionId === sessionId);
      if (existingDoc) {
        await setDoc(chatRef, currentSession, { merge: true });
      } else {
        await updateDoc(chatRef, {
          messages: currentSession.messages,
          updatedAt: now,
        });
      }
    } catch {
      // Fallback
    }
  }
}
