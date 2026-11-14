/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  isFirebaseConfigured,
  signInWithGoogle as firebaseSignInWithGoogle,
  logOut as firebaseLogOut,
  onAuthStateChanged,
  type User,
} from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(() => Boolean(auth));

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      await firebaseSignInWithGoogle();
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      throw error;
    }
  };

  const handleLogOut = async () => {
    try {
      await firebaseLogOut();
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isFirebaseConfigured,
        signInWithGoogle: handleSignInWithGoogle,
        logOut: handleLogOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
