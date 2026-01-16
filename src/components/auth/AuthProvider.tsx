import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useMutation } from 'convex/react';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

type UserSession = {
  id: Id<'users'>;
  email: string;
};

export type AuthContextValue = {
  user: UserSession | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'quick-links-user';

function readStoredUser(): UserSession | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserSession;
  } catch (error) {
    return null;
  }
}

function writeStoredUser(user: UserSession | null) {
  if (typeof window === 'undefined') return;

  if (!user) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const upsertUser = useMutation(api.users.upsertByEmail);
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = readStoredUser();
    if (stored) setUser(stored);
    setIsLoading(false);
  }, []);

  const signIn = async (email: string) => {
    setIsLoading(true);
    const result = await upsertUser({ email });
    const nextUser = { id: result.userId, email: result.email };
    setUser(nextUser);
    writeStoredUser(nextUser);
    setIsLoading(false);
  };

  const signOut = () => {
    setUser(null);
    writeStoredUser(null);
  };

  const value = useMemo(() => ({ user, isLoading, signIn, signOut }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
