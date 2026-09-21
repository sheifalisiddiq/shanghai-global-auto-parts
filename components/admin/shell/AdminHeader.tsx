"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, LogOut, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useAuth } from "@/lib/admin/auth/AuthContext";
import { ADMIN_LOGIN_PATH } from "@/lib/admin/auth/constants";
import { NAV_GROUPS, matchRoute } from "@/lib/admin/access/routes";
import { useAdminPath } from "./useAdminPath";

interface AdminHeaderProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenMenu: () => void;
}

const iconBtn =
  "flex h-10 w-10 items-center justify-center text-slate-600 transition-colors hover:bg-slate-100 hover:text-ink";

export function AdminHeader({ collapsed, onToggleCollapsed, onOpenMenu }: AdminHeaderProps) {
  const pathname = useAdminPath();
  const router = useRouter();
  const { session, role, logout } = useAuth();
  const route = pathname ? matchRoute(pathname) : null;
  const group = route?.group ? NAV_GROUPS.find((g) => g.id === route.group) : undefined;
  const initial = session?.name?.replace("Demo ", "").charAt(0).toUpperCase() ?? "";

  async function handleLogout() {
    await logout();
    router.replace(ADMIN_LOGIN_PATH);
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 sm:px-5">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        className={`${iconBtn} lg:hidden`}
      >
        <Menu className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={`${iconBtn} hidden lg:flex`}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-5 w-5" />
        ) : (
          <PanelLeftClose className="h-5 w-5" />
        )}
      </button>

      <div className="min-w-0 flex-1 pl-1 leading-tight">
        {group && !group.href && (
          <p className="truncate text-[11px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
            {group.label}
          </p>
        )}
        <h1 className="font-display truncate text-lg font-extrabold text-ink sm:text-xl">
          {route?.title ?? "Admin"}
        </h1>
      </div>

      <Link
        href="/"
        target="_blank"
        rel="noopener"
        className="hidden items-center gap-2 px-3 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:text-brand-red md:flex"
      >
        <ExternalLink className="h-4 w-4" />
        View site
      </Link>

      <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 sm:flex">
        <span
          aria-hidden
          className="font-ui flex h-9 w-9 items-center justify-center bg-brand-red text-sm text-white"
        >
          {initial}
        </span>
        <div className="leading-tight">
          <p className="text-[13px] font-bold text-ink">{session?.name ?? " "}</p>
          <p className="text-[11px] text-slate-500">{role?.label ?? " "}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        aria-label="Logout"
        className="font-ui flex h-10 items-center gap-2 border border-ink px-3 text-[12px] tracking-wide text-ink uppercase transition-colors hover:bg-ink hover:text-white sm:px-4"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  );
}
