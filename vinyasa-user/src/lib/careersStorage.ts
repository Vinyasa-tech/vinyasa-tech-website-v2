
import type { DemoCandidate } from "@/types/careers";

const CANDIDATE_KEY = "vinyasa_candidate";
const TOKEN_KEY = "vinyasa_candidate_token";

/* Safely read candidate information */
function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const value = sessionStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

/* Get the currently logged-in candidate */
export function getCandidate(): DemoCandidate | null {
  return readJSON<DemoCandidate | null>(CANDIDATE_KEY, null);
}

/* Get candidate authentication token */
export function getCandidateToken(): string | null {
  if (typeof window === "undefined") return null;

  return sessionStorage.getItem(TOKEN_KEY);
}

/* Check candidate login */
export function isCandidateLoggedIn(): boolean {
  return Boolean(getCandidateToken() && getCandidate());
}

/* Save candidate details after backend login */
export function saveCandidate(candidate: DemoCandidate): void {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(
    CANDIDATE_KEY,
    JSON.stringify(candidate)
  );
}

/* Save JWT token returned by backend */
export function saveCandidateToken(token: string): void {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(TOKEN_KEY, token);
}

/* Clear candidate session */
export function logoutCandidate(): void {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(CANDIDATE_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}
