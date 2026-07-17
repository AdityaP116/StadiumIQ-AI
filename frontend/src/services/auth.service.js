/**
 * StadiumIQ — Auth Service
 * All Firebase Authentication operations.
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

// ─── Sign In ──────────────────────────────────────────────────────────────────

/**
 * Sign in with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

/**
 * Sign in with Google popup.
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const signInWithGoogle = () =>
  signInWithPopup(auth, googleProvider);

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * Create a new account with email and password.
 * @param {string} email
 * @param {string} password
 * @param {string} [displayName]
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const registerWithEmail = async (email, password, displayName) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }
  return credential;
};

// ─── Sign Out ─────────────────────────────────────────────────────────────────

/**
 * Sign out the current user.
 * @returns {Promise<void>}
 */
export const signOut = () => firebaseSignOut(auth);

// ─── Token ────────────────────────────────────────────────────────────────────

/**
 * Get the current user's Firebase ID token.
 * Forces a refresh if forceRefresh is true.
 * @param {boolean} [forceRefresh=false]
 * @returns {Promise<string|null>}
 */
export const getCurrentToken = async (forceRefresh = false) => {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
};

// ─── Auth State ───────────────────────────────────────────────────────────────

/**
 * Subscribe to Firebase auth state changes.
 * @param {(user: import('firebase/auth').User|null) => void} callback
 * @returns {import('firebase/auth').Unsubscribe}
 */
export const onAuthStateChanged = (callback) =>
  firebaseOnAuthStateChanged(auth, callback);

/**
 * Get the currently signed-in user (synchronous snapshot).
 * May be null before onAuthStateChanged fires.
 * @returns {import('firebase/auth').User|null}
 */
export const getCurrentUser = () => auth.currentUser;

// ─── Password Reset ───────────────────────────────────────────────────────────

/**
 * Send a password reset email.
 * @param {string} email
 * @returns {Promise<void>}
 */
export const resetPassword = (email) =>
  sendPasswordResetEmail(auth, email);
