"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { authProvider } from "./index";
import { can as canFn, getRoleOverrides, subscribeRoleOverrides } from "@/lib/admin/access/access";
import { ROLES, isRoleId, type RoleDef, type RoleId } from "@/lib/admin/access/roles";
import type { Action, Resource } from "@/lib/admin/access/permissions";
import type { AdminSession, LoginResult } from "./types";

interface AuthValue {
  /** false during SSR / first client render, before browser storage is readable. */
  hydrated: boolean;
  session: AdminSession | null;
  roleId: RoleId | null;
  role: RoleDef | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

const noopSubscribe = () => () => {};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useSyncExternalStore(
    authProvider.subscribe,
    authProvider.getSession,
    () => null,
  );
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const value = useMemo<AuthValue>(() => {
    const roleId = session && isRoleId(session.roleId) ? session.roleId : null;
    return {
      hydrated,
      session,
      roleId,
      role: roleId ? ROLES[roleId] : null,
      login: authProvider.login,
      logout: authProvider.logout,
    };
  }, [hydrated, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

/**
 * Permission check bound to the signed-in role. Re-renders when the demo
 * Roles & Permissions overrides change. Use this instead of comparing role names.
 */
export function useCan(): (resource: Resource, action: Action) => boolean {
  const { roleId } = useAuth();
  const overrides = useSyncExternalStore(subscribeRoleOverrides, getRoleOverrides, getRoleOverrides);
  // `overrides` is a dependency on purpose: canFn reads module state that changed with it,
  // so consumers re-render (and get a fresh function) when permissions are edited.
  return useCallback(
    (resource: Resource, action: Action) => {
      void overrides;
      return canFn(roleId, resource, action);
    },
    [roleId, overrides],
  );
}
