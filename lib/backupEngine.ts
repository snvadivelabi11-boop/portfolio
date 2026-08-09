import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, setDoc, query, orderBy, limit } from 'firebase/firestore';
import { getSiteSettings } from '@/lib/siteSettings';
import { getProjects } from '@/lib/firestoreCMS';

export interface BackupSnapshot {
  id?: string;
  name: string;
  type: 'Automatic' | 'Manual';
  createdAt: string;
  createdBy: string;
  sizeBytes: number;
  data: {
    settings: unknown;
    projects: unknown;
    timestamp: string;
  };
}

// 1. Create System Backup Snapshot
export async function createSystemBackup(
  name: string = `System_Backup_${new Date().toISOString().split('T')[0]}`,
  type: 'Automatic' | 'Manual' = 'Manual',
  adminEmail: string = 'snvadivelabi11@gmail.com'
): Promise<BackupSnapshot> {
  const settings = await getSiteSettings();
  const projects = await getProjects();

  const backupData = {
    settings,
    projects,
    timestamp: new Date().toISOString(),
  };

  const payloadString = JSON.stringify(backupData);
  const sizeBytes = new Blob([payloadString]).size;

  const backupSnapshot: BackupSnapshot = {
    name,
    type,
    createdAt: new Date().toISOString(),
    createdBy: adminEmail,
    sizeBytes,
    data: backupData,
  };

  if (db) {
    try {
      console.log(`[Backup Engine] Archiving backup snapshot "${name}" (${sizeBytes} bytes)...`);
      const docRef = await addDoc(collection(db, 'system_backups'), backupSnapshot);
      backupSnapshot.id = docRef.id;
      console.log(`[Backup Engine] Backup snapshot saved to Firestore. ID: ${docRef.id}`);
    } catch (err) {
      console.error('[Backup Engine Firestore Fail]:', err);
    }
  }

  return backupSnapshot;
}

// 2. Fetch All System Backups
export async function getSystemBackups(): Promise<BackupSnapshot[]> {
  if (db) {
    try {
      const q = query(collection(db, 'system_backups'), orderBy('createdAt', 'desc'), limit(15));
      const snapshot = await getDocs(q);
      const list: BackupSnapshot[] = [];
      snapshot.forEach((docSnap) => list.push({ id: docSnap.id, ...docSnap.data() } as BackupSnapshot));
      return list;
    } catch {
      // Fallback
    }
  }
  return [];
}

// 3. Restore System Backup
export async function restoreSystemBackup(backupId: string): Promise<boolean> {
  if (db) {
    try {
      console.log(`[Backup Engine] Restoring system snapshot ID: ${backupId}...`);
      const backups = await getSystemBackups();
      const target = backups.find((b) => b.id === backupId);

      if (target && target.data?.settings) {
        await setDoc(doc(db, 'settings', 'site'), target.data.settings, { merge: true });
        console.log(`[Backup Engine] Restored site settings from snapshot "${target.name}".`);
        return true;
      }
    } catch (err) {
      console.error('[Backup Engine Restore Error]:', err);
    }
  }
  return false;
}
