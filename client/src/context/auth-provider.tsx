import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiRequest, onUnauthorized, setAuthToken } from '../lib/api';
import { persistSession, readStoredSession, type StoredSession } from '../lib/session-storage';
import { AuthContext, type AuthContextValue, type AuthUser } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(() => readStoredSession());

  const clearSession = useCallback(() => {
    persistSession(null);
    setAuthToken(null);
    setSession(null);
  }, []);

  useEffect(() => onUnauthorized(clearSession), [clearSession]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiRequest<{ token: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    const nextSession: StoredSession = { token: response.data.token, user: response.data.user };

    persistSession(nextSession);
    setAuthToken(nextSession.token);
    setSession(nextSession);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: session !== null,
      login,
      logout: clearSession,
    }),
    [session, login, clearSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
