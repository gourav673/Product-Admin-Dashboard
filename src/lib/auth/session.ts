// Stores the logged-in session in the browser.
// The token lives in a cookie so the Next.js middleware can check it before a
// protected page renders, and the user profile lives in localStorage.

import type { AuthUser } from "@/types/auth";

export const TOKEN_COOKIE = "accessToken";
const USER_KEY = "authUser";

export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${TOKEN_COOKIE}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export function saveSession(token: string, user: AuthUser, maxAgeSeconds: number) {
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // Storage can be blocked (private mode). The token cookie is enough to stay logged in.
  }
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`;
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    // ignore
  }
}
