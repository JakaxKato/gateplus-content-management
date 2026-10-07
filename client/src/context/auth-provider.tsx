import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiRequest, onUnauthorized, setTokenGetter } from '../lib/api';
import { AuthContext, type AuthContextValue, type AuthUser } from './auth-context';

interface StoredSession {
  token: string;
  user: AuthUser;
}

const STORAGE_KEY = 'gateplus.session';

function readStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed.token || !parsed.user) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(() => readStoredSession());

  useEffect(() => {
    setTokenGetter(() => session?.token ?? null);
  }, [session]);

  useEffect(() => onUnauthorized(() => setSession(null)), []);

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiRequest<{ token: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setSession({ token: response.data.token, user: response.data.user });
  }, []);

  const logout = useCallback(() => setSession(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: session !== null,
      login,
      logout,
    }),
    [session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
