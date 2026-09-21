import type { RoleId } from "@/lib/admin/access/roles";

export interface AdminSession {
  id: string;
  email: string;
  name: string;
  /** Permissions are derived from this at runtime; they are never stored in the session. */
  roleId: RoleId;
}

export type LoginResult =
  | { ok: true; session: AdminSession }
  | { ok: false; error: string };

/**
 * Contract every admin auth backend must satisfy. The UI (login page, guard,
 * header) only talks to this interface, so replacing the demo provider with a
 * real one means implementing this and swapping the export in `./index.ts`.
 */
export interface AuthProvider {
  login(email: string, password: string): Promise<LoginResult>;
  logout(): Promise<void>;
  /** Synchronous, referentially stable snapshot (safe for useSyncExternalStore). */
  getSession(): AdminSession | null;
  /** Notify when the session changes (this tab or another). Returns unsubscribe. */
  subscribe(listener: () => void): () => void;
}
