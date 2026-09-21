"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { canAccessPath, setRoleOverrides } from "@/lib/admin/access/access";
import { useAuth, useCan } from "@/lib/admin/auth/AuthContext";
import { ADMIN_LOGIN_PATH } from "@/lib/admin/auth/constants";
import { db } from "@/lib/admin/data";
import { useDataReady } from "@/lib/admin/data/hooks";
import { cn } from "@/lib/utils/cn";
import { FeedbackProvider } from "../ui/Feedback";
import { AccessDenied } from "./AccessDenied";
import { AdminHeader } from "./AdminHeader";
import { DemoBanner } from "./DemoBanner";
import { Sidebar } from "./Sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { hydrated, session, roleId, logout } = useAuth();
  const can = useCan(); // re-render when Roles & Permissions overrides change
  const dataReady = useDataReady();
  const [collapsed, setCollapsed] = useState(false);
  // Drawer is open only for the route it was opened on, so navigating closes it.
  const [drawerFor, setDrawerFor] = useState<string | null>(null);
  const drawerOpen = drawerFor === pathname;
  const unauthenticated = hydrated && !session;

  // Load demo Roles & Permissions overrides into the access engine.
  useEffect(() => {
    if (!dataReady) return;
    const sync = () => setRoleOverrides(db.singleton("roleOverrides") ?? {});
    sync();
    return db.subscribe(sync);
  }, [dataReady]);

  // Client-side fallback guard (proxy.ts is the first line). Clears the marker
  // cookie too, otherwise proxy would bounce us straight back to /admin.
  useEffect(() => {
    if (!unauthenticated) return;
    logout().then(() => router.replace(ADMIN_LOGIN_PATH));
  }, [unauthenticated, logout, router]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerFor(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  if (unauthenticated) {
    return <div className="h-dvh bg-paper" aria-busy="true" />;
  }

  // Layer 2 of route protection: the same canAccessPath the proxy uses (plus demo overrides).
  const allowed = !hydrated || !roleId || (void can, canAccessPath(roleId, pathname));

  return (
    <FeedbackProvider>
      <div className="flex h-dvh overflow-hidden bg-paper">
        <aside className={cn("hidden shrink-0 transition-[width] duration-200 ease-out lg:block", collapsed ? "w-[72px]" : "w-[264px]")}>
          <Sidebar collapsed={collapsed} />
        </aside>

        <div className="lg:hidden">
          <div
            onClick={() => setDrawerFor(null)}
            aria-hidden
            className={cn("fixed inset-0 z-40 bg-black/50 transition-opacity duration-200", drawerOpen ? "opacity-100" : "pointer-events-none opacity-0")}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Admin menu"
            inert={!drawerOpen}
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] transition-transform duration-200 ease-out",
              drawerOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <Sidebar onClose={() => setDrawerFor(null)} />
          </aside>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader collapsed={collapsed} onToggleCollapsed={() => setCollapsed((c) => !c)} onOpenMenu={() => setDrawerFor(pathname)} />
          <DemoBanner />
          <main className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-8">{allowed ? children : <AccessDenied />}</main>
        </div>
      </div>
    </FeedbackProvider>
  );
}
