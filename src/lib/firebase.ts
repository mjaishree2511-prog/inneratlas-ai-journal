import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  type Firestore,
} from 'firebase/firestore';
import type { JournalEntry, UserPreferences } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Authentication Instance
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Firestore Instance with specific database ID if available
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Zero-Crash Strict Undefined-Stripping Payload Sanitizer
export function sanitizeFirestorePayload<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as unknown as T;
  }
  if (typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => sanitizeFirestorePayload(item)) as unknown as T;
  }
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      clean[key] = sanitizeFirestorePayload(value);
    }
  }
  return clean as T;
}

// Google Sign In via Firebase Auth
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In failed:', error);
    throw error;
  }
}

// Sign Out
export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw error;
  }
}

// Save or Update Journal Entry in Firestore with User Isolation
export async function saveJournalEntryToFirestore(
  userId: string,
  entry: JournalEntry
): Promise<void> {
  if (!userId) {
    throw new Error('User must be authenticated to save journal entries.');
  }

  try {
    const sanitizedEntry = sanitizeFirestorePayload({
      ...entry,
      userId,
      updatedAt: Date.now(),
    });

    const entryRef = doc(db, 'users', userId, 'interactions', entry.id);
    await setDoc(entryRef, sanitizedEntry, { merge: true });
  } catch (error: any) {
    console.error(`Failed to save entry ${entry.id} for user ${userId}:`, error);
    throw error;
  }
}

// Load All Journal Entries for Authenticated User
export async function loadUserJournalEntries(userId: string): Promise<JournalEntry[]> {
  if (!userId) {
    return [];
  }

  try {
    const entriesCollection = collection(db, 'users', userId, 'interactions');
    const q = query(entriesCollection, orderBy('updatedAt', 'desc'), limit(100));
    const snapshot = await getDocs(q);

    const entries: JournalEntry[] = [];
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      entries.push({
        id: docSnapshot.id,
        userId: data.userId || userId,
        title: data.title || 'Untitled Entry',
        category: data.category || 'reflection',
        messages: Array.isArray(data.messages) ? data.messages : [],
        summary: data.summary || '',
        mood: data.mood || '',
        color: data.color || undefined,
        colorName: data.colorName || undefined,
        tags: Array.isArray(data.tags) ? data.tags : [],
        createdAt: data.createdAt || Date.now(),
        updatedAt: data.updatedAt || Date.now(),
      });
    });

    return entries;
  } catch (error: any) {
    console.error(`Failed to load entries for user ${userId}:`, error);
    throw error;
  }
}

// Delete a Journal Entry
export async function deleteJournalEntryFromFirestore(
  userId: string,
  entryId: string
): Promise<void> {
  if (!userId || !entryId) {
    throw new Error('Valid userId and entryId are required for deletion.');
  }

  try {
    const entryRef = doc(db, 'users', userId, 'interactions', entryId);
    await deleteDoc(entryRef);
  } catch (error: any) {
    console.error(`Failed to delete entry ${entryId}:`, error);
    throw error;
  }
}

// Load User Preferences (e.g. Onboarding, Theme, Reduced Motion, Default Category)
export async function loadUserPreferences(
  userId: string
): Promise<UserPreferences> {
  if (!userId) return {};
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        completedOnboarding: Boolean(data.completedOnboarding),
        theme: data.theme === 'dark' || data.theme === 'light' || data.theme === 'system' ? data.theme : 'system',
        reducedMotion: Boolean(data.reducedMotion),
        defaultCategory: data.defaultCategory,
      };
    }
    return {};
  } catch (error) {
    console.error(`Failed to load preferences for user ${userId}:`, error);
    return {};
  }
}

// Save User Preferences
export async function saveUserPreferences(
  userId: string,
  prefs: UserPreferences
): Promise<void> {
  if (!userId) return;
  try {
    const userDocRef = doc(db, 'users', userId);
    const sanitized = sanitizeFirestorePayload({
      ...prefs,
      updatedAt: Date.now(),
    });
    await setDoc(userDocRef, sanitized, { merge: true });
  } catch (error) {
    console.error(`Failed to save preferences for user ${userId}:`, error);
  }
}
