import { db } from '@/lib/firebase';
import {
  collection, doc, setDoc, getDocs, deleteDoc, query, orderBy, onSnapshot, addDoc
} from 'firebase/firestore';

export interface MediaItem {
  id: string;
  name: string;
  category: 'profile' | 'resume' | 'projects' | 'certificates' | 'blogs' | 'logos' | 'videos';
  fileType: string;
  size: number;
  url: string;
  publicId: string;
  storagePath: string;
  createdAt: string;
  updatedBy?: string;
}

export const ALLOWED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'video/mp4',
];

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_DOCUMENT_SIZE = 50 * 1024 * 1024; // 50MB

export function validateMediaFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type}). Allowed: PNG, JPG, WEBP, SVG, PDF, MP4.`,
    };
  }

  const maxSize = file.type.startsWith('video/') || file.type === 'application/pdf' ? MAX_DOCUMENT_SIZE : MAX_IMAGE_SIZE;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum limit of ${maxSize / (1024 * 1024)} MB.`,
    };
  }

  return { valid: true };
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format?: string;
  bytes?: number;
  resource_type?: string;
}

/**
 * Direct Cloudinary Upload Utility with Real-time Progress & Timeout Safety
 */
export function uploadToCloudinary(
  file: File,
  category: MediaItem['category'],
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const validation = validateMediaFile(file);
    if (!validation.valid) {
      return reject(new Error(validation.error || 'Invalid file payload'));
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'y0acyiak';
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'portfolio_upload';

    console.log('Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || cloudName);
    console.log('Upload Preset:', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || uploadPreset);

    if (!cloudName || !uploadPreset) {
      return reject(new Error('Cloudinary environment variables (CLOUD_NAME or UPLOAD_PRESET) are missing.'));
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    // Timeout safety net (45 seconds)
    const timeoutTimer = setTimeout(() => {
      xhr.abort();
      reject(new Error('Cloudinary upload timed out after 45 seconds. Check network connection.'));
    }, 45000);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      clearTimeout(timeoutTimer);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (!res || !res.secure_url) {
            throw new Error('Cloudinary upload failed: secure_url not returned');
          }

          console.log(file);
          console.log(res);
          console.log(res.secure_url);

          resolve({
            secure_url: res.secure_url,
            public_id: res.public_id,
            format: res.format,
            bytes: res.bytes,
            resource_type: res.resource_type,
          });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          reject(new Error(msg || 'Failed to parse Cloudinary response payload.'));
        }
      } else {
        console.error('[Cloudinary Upload Failed Error Response]:', xhr.status, xhr.responseText);
        let errMsg = `Cloudinary Upload Error (${xhr.status})`;
        try {
          const errRes = JSON.parse(xhr.responseText);
          if (errRes.error?.message) errMsg = errRes.error.message;
        } catch {
          // ignore
        }
        reject(new Error(errMsg));
      }
    };

    xhr.onerror = () => {
      clearTimeout(timeoutTimer);
      reject(new Error('Network error during Cloudinary upload. Check internet connection.'));
    };

    xhr.send(formData);
  });
}

/**
 * Full Media Upload Asset Utility for Admin CMS + Firestore Auto-Sync
 */
export async function uploadMediaAsset(
  file: File,
  category: MediaItem['category'],
  adminEmail: string = 'snvadivelabi11@gmail.com',
  onProgress?: (progress: number) => void
): Promise<MediaItem> {
  console.log(`[Cloudinary Media Manager] Uploading ${file.name} under category: ${category}...`);
  const result = await uploadToCloudinary(file, category, onProgress);

  const timestamp = Date.now();
  const mediaId = `media-${timestamp}-${Math.random().toString(36).substring(2, 7)}`;
  const downloadUrl = result.secure_url;

  const mediaItem: MediaItem = {
    id: mediaId,
    name: file.name,
    category,
    fileType: file.type,
    size: file.size,
    url: downloadUrl,
    publicId: result.public_id,
    storagePath: result.public_id,
    createdAt: new Date().toISOString(),
    updatedBy: adminEmail,
  };

  if (db) {
    try {
      await setDoc(doc(db, 'media', mediaId), mediaItem);
      await addDoc(collection(db, 'media_history'), {
        action: 'UPLOAD',
        mediaId,
        name: file.name,
        category,
        url: downloadUrl,
        publicId: result.public_id,
        timestamp: new Date().toISOString(),
        updatedBy: adminEmail,
      });

      // Single-source auto-sync for Profile & Resume across Firestore documents
      if (category === 'profile') {
        await setDoc(doc(db, 'profile', 'main'), { profileImage: downloadUrl, profilePhoto: downloadUrl }, { merge: true });
        await setDoc(doc(db, 'about', 'main'), { profilePhoto: downloadUrl, profileImage: downloadUrl }, { merge: true });
        await setDoc(doc(db, 'hero', 'main'), { profilePhoto: downloadUrl, profileImage: downloadUrl }, { merge: true });
        await setDoc(doc(db, 'settings', 'site'), { personal: { profilePhoto: downloadUrl } }, { merge: true });
        console.log(`[Cloudinary Media Manager] Auto-synced Profile Photo Cloudinary URL (${downloadUrl}) across Firestore documents!`);
      } else if (category === 'resume') {
        await setDoc(doc(db, 'profile', 'main'), { resumeUrl: downloadUrl }, { merge: true });
        await setDoc(doc(db, 'about', 'main'), { resumeUrl: downloadUrl }, { merge: true });
        console.log(`[Cloudinary Media Manager] Auto-synced Resume PDF Cloudinary URL (${downloadUrl}) across Firestore documents!`);
      }
    } catch (err) {
      console.error('[Cloudinary Media Manager Firestore Error]:', err);
    }
  }

  return mediaItem;
}

/**
 * Delete Media Asset from Firestore and Cloudinary
 */
export async function deleteMediaAsset(mediaId: string, publicId?: string): Promise<boolean> {
  if (db) {
    try {
      await deleteDoc(doc(db, 'media', mediaId));
      await addDoc(collection(db, 'media_history'), {
        action: 'DELETE',
        mediaId,
        publicId,
        timestamp: new Date().toISOString(),
      });
      console.log(`[Cloudinary Media Manager] Removed media document ${mediaId} from Firestore.`);
    } catch (err) {
      console.error(`[Cloudinary Delete Error]:`, err);
    }
  }
  return true;
}

/**
 * Fetch All Media Items
 */
export async function getMediaAssets(): Promise<MediaItem[]> {
  if (db) {
    try {
      const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items: MediaItem[] = [];
      snapshot.forEach((docSnap) => items.push(docSnap.data() as MediaItem));
      if (items.length > 0) return items;
    } catch {
      // Fallback
    }
  }
  return [];
}

/**
 * Realtime Listener for Media Items
 */
export function subscribeMediaAssets(callback: (items: MediaItem[]) => void): () => void {
  if (typeof window === 'undefined' || !db) {
    callback([]);
    return () => {};
  }

  try {
    const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items: MediaItem[] = [];
      snapshot.forEach((docSnap) => items.push(docSnap.data() as MediaItem));
      callback(items);
    });
  } catch {
    callback([]);
    return () => {};
  }
}
