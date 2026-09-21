import { ACTIONS, RESOURCES, type Action, type Grants, type Resource } from "./permissions";
import { ROLES, isRoleId, type RoleId } from "./roles";
import { NAV_GROUPS, ROUTES, matchRoute, type NavGroup, type RouteDef } from "./routes";

/**
 * Permission engine. The ONLY place that answers "may this role do X?".
 * Components and the proxy never compare role names.
 *
 * DEMO: Roles & Permissions edits are stored as per-role overrides in the
 * browser store and applied here on the client. `proxy.ts` has no access to
 * them, so it always uses the built-in defaults; overrides therefore cannot
 * grant route access the defaults deny (they fail closed).
 * The Administrator is locked: it always has every action on every resource.
 */

export type RoleOverrides = Partial<Record<RoleId, Grants>>;

let overrides: RoleOverrides = {};
const listeners = new Set<() => void>();

export function setRoleOverrides(next: RoleOverrides) {
  overrides = next;
  listeners.forEach((l) => l());
}
export function getRoleOverrides(): RoleOverrides {
  return overrides;
}
export function subscribeRoleOverrides(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function defaultGrants(roleId: RoleId): Grants {
  return ROLES[roleId].grants;
}

/** Effective grants (defaults, or the demo override for that role). Administrator is never overridden. */
export function effectiveGrants(roleId: RoleId): Grants {
  if (roleId === "administrator") return ROLES.administrator.grants;
  return overrides[roleId] ?? ROLES[roleId].grants;
}

export function can(roleId: RoleId | null | undefined, resource: Resource, action: Action): boolean {
  if (!roleId || !isRoleId(roleId)) return false;
  return !!effectiveGrants(roleId)[resource]?.includes(action);
}

/** Same check but against the built-in defaults only (what the server gate can see). */
export function canByDefault(roleId: RoleId | null | undefined, resource: Resource, action: Action): boolean {
  if (!roleId || !isRoleId(roleId)) return false;
  return !!ROLES[roleId].grants[resource]?.includes(action);
}

/** Unknown paths are allowed through (they end in the admin 404 page). */
export function canAccessPath(roleId: RoleId | null | undefined, pathname: string, defaultsOnly = false): boolean {
  const route = matchRoute(pathname);
  if (!route) return !!roleId && isRoleId(roleId);
  return defaultsOnly
    ? canByDefault(roleId, route.resource, route.action)
    : can(roleId, route.resource, route.action);
}

/** SEO panel visibility: permission-driven, never by role name. */
export function canSeo(roleId: RoleId | null | undefined, resource: Resource): boolean {
  return can(roleId, resource, "seo");
}

/** An editor is "SEO-only" when the role may edit SEO fields but not content. */
export function isSeoOnly(roleId: RoleId | null | undefined, resource: Resource): boolean {
  return can(roleId, resource, "seo") && !can(roleId, resource, "edit");
}

export interface NavEntry {
  group: NavGroup;
  /** Leaf link when the group has no children. */
  href?: string;
  children: { label: string; href: string }[];
}

/** Sidebar for a role: registry filtered by `view` permission. */
export function navFor(roleId: RoleId): NavEntry[] {
  const entries: NavEntry[] = [];
  for (const group of NAV_GROUPS) {
    if (group.href) {
      const route = matchRoute(group.href);
      if (route && can(roleId, route.resource, route.action)) {
        entries.push({ group, href: group.href, children: [] });
      }
      continue;
    }
    const children = ROUTES.filter((r) => r.group === group.id && can(roleId, r.resource, r.action)).map(
      (r) => ({ label: r.navLabel ?? r.title, href: r.path }),
    );
    if (children.length) entries.push({ group, children });
  }
  return entries;
}

export function routeFor(pathname: string): RouteDef | null {
  return matchRoute(pathname);
}

/** Where the "Go to my dashboard" button leads. */
export const HOME_PATH = "/admin";

export { ACTIONS, RESOURCES };
export type { Action, Resource };
