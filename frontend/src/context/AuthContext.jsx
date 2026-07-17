/**
 * StadiumIQ — Auth Context
 *
 * Provides authentication state across the entire app.
 * Wraps Firebase onAuthStateChanged and exposes:
 *   - user         : Firebase User object (null if signed out)
 *   - isAuthenticated
 *   - isLoading    : true while Firebase resolves initial auth state
 *   - signIn, signInWithGoogle, register, signOut, resetPassword
 */

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  onAuthStateChanged,
  signInWithEmail,
  signInWithGoogle,
  registerWithEmail,
  signOut,
  resetPassword,
} from '@services/auth.service';

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser]           = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true until Firebase resolves

  // Subscribe to Firebase auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return unsubscribe; // cleanup on unmount
  }, []);

  // ─── Auth Actions ──────────────────────────────────────────────────────────
  const handleSignIn = useCallback(async (email, password) => {
    const credential = await signInWithEmail(email, password);
    return credential.user;
  }, []);

  const handleSignInWithGoogle = useCallback(async () => {
    const credential = await signInWithGoogle();
    return credential.user;
  }, []);

  const handleRegister = useCallback(async (email, password, displayName) => {
    const credential = await registerWithEmail(email, password, displayName);
    return credential.user;
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    toast.success('Signed out successfully.');
  }, []);

  const handleResetPassword = useCallback(async (email) => {
    await resetPassword(email);
    toast.success('Password reset email sent.');
  }, []);

  // ─── Context Value ─────────────────────────────────────────────────────────
  const value = {
    user,
    isAuthenticated:    !!user,
    isLoading,
    signIn:             handleSignIn,
    signInWithGoogle:   handleSignInWithGoogle,
    register:           handleRegister,
    signOut:            handleSignOut,
    resetPassword:      handleResetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
