"use client";

import { usePathname } from "next/navigation";
import { normalizePath } from "@/lib/admin/access/routes";
import { useAuth } from "@/lib/admin/auth/AuthContext";

/**
 * Current admin path, or "" until the browser has hydrated. Under a proxy
 * rewrite (Access Denied) the server and the browser can disagree about the
 * pathname, so anything derived from it (title, active menu item) waits for
 * hydration instead of causing a mismatch.
 */
export function useAdminPath(): string {
  const path = normalizePath(usePathname());
  const { hydrated } = useAuth();
  return hydrated ? path : "";
}
