import { ADMIN_COOKIE, ADMIN_SESSION_KEY } from "./constants";
import type { RoleId } from "@/lib/admin/access/roles";
import type { AdminSession, AuthProvider, LoginResult } from "./types";

/**
 * DEMO ONLY: NOT REAL AUTHENTICATION.
 * Credentials are hardcoded and checked in the browser; the session is a
 * localStorage entry plus a non-secret marker cookie (value = role id) that
 * `proxy.ts` uses to gate routes server-side. Anyone can fake it. Replace this
 * whole file with a real provider (signed / HTTP-only session cookie that
 * carries the role) before storing real data.
 */
export const DEMO_PASSWORD = "demo1234";

export interface DemoUser extends AdminSession {
  password: string;
}

export const DEMO_USERS: DemoUser[] = [
  { id: "u-admin", email: "admin@shanghaiglobal.demo", name: "Demo Administrator", roleId: "administrator", password: DEMO_PASSWORD },
  { id: "u-seo", email: "seo@shanghaiglobal.demo", name: "Demo SEO Manager", roleId: "seo-manager", password: DEMO_PASSWORD },
  { id: "u-content", email: "content@shanghaiglobal.demo", name: "Demo Content Editor", roleId: "content-editor", password: DEMO_PASSWORD },
  { id: "u-products", email: "products@shanghaiglobal.demo", name: "Demo Product Manager", roleId: "product-manager", password: DEMO_PASSWORD },
  { id: "u-hr", email: "hr@shanghaiglobal.demo", name: "Demo HR Manager", roleId: "hr", password: DEMO_PASSWORD },
];

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 8;

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedSession: AdminSession | null = null;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(ADMIN_SESSION_KEY);
  } catch {
    return null;
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function setCookie(roleId: RoleId | null) {
  document.cookie = roleId
    ? `${ADMIN_COOKIE}=${roleId}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`
    : `${ADMIN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export const demoAuthProvider: AuthProvider = {
  async login(email, password): Promise<LoginResult> {
    const user = DEMO_USERS.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password,
    );
    if (!user) return { ok: false, error: "Invalid email or password." };

    const session: AdminSession = { id: user.id, email: user.email, name: user.name, roleId: user.roleId };
    try {
      window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    } catch {
      return { ok: false, error: "Browser storage is blocked. Enable it to sign in." };
    }
    setCookie(session.roleId);
    emit();
    return { ok: true, session };
  },

  async logout() {
    try {
      window.localStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      /* storage unavailable: cookie removal below still ends the session */
    }
    setCookie(null);
    emit();
  },

  getSession() {
    const raw = readRaw();
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        cachedSession = raw ? (JSON.parse(raw) as AdminSession) : null;
      } catch {
        cachedSession = null;
      }
    }
    return cachedSession;
  },

  subscribe(listener) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === ADMIN_SESSION_KEY) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
};
