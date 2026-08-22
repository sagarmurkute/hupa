import { createAuthClient } from 'better-auth/react';

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    if (
      window.location.origin &&
      window.location.origin !== 'null' &&
      !window.location.origin.startsWith('file:')
    ) {
      return window.location.origin;
    }
  }
  return (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';
}

export const authClient = createAuthClient({
  baseURL: getApiBaseUrl(),
});

export const { signIn, signUp, signOut, useSession } = authClient;
