import type { AuthUser } from '../context/auth-context';

export interface StoredSession {
  token: string;
  user: AuthUser;
}

const STORAGE_KEY = 'gateplus.session';

export function readStoredSession(): StoredSession | null {
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

export function readStoredToken(): string | null {
  return readStoredSession()?.token ?? null;
}

export function persistSession(session: StoredSession | null): void {
  if (session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}
