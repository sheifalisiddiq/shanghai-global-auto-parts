"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ChevronDown, ExternalLink, X } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { navFor, type NavEntry } from "@/lib/admin/access/access";
import { useAuth, useCan } from "@/lib/admin/auth/AuthContext";
import { cn } from "@/lib/utils/cn";
import { NAV_ICONS } from "./icons";
import { useAdminPath } from "./useAdminPath";

interface SidebarProps {
  /** Icon-only rail (desktop). */
  collapsed?: boolean;
  /** When set, renders a close button (mobile drawer). */
  onClose?: () => void;
}

function isActiveHref(path: string, href: string) {
  if (href === "/admin") return path === "/admin";
  return path === href || path.startsWith(`${href}/`);
}

export function Sidebar({ collapsed = false, onClose }: SidebarProps) {
  const pathname = useAdminPath();
  const { roleId, role } = useAuth();
  const can = useCan();
  const uid = useId(); // unique aria-controls ids: the sidebar renders twice (rail + drawer)
  // Manual open/close overrides; anything not overridden follows the active route.
  const [manual, setManual] = useState<Record<string, boolean>>({});

  // Reading `can` subscribes this component to permission edits, so the menu refreshes.
  void can;
  const entries: NavEntry[] = roleId ? navFor(roleId) : [];

  const isGroupActive = (e: NavEntry) =>
    e.href ? isActiveHref(pathname, e.href) : e.children.some((c) => isActiveHref(pathname, c.href));

  return (
    <div className="flex h-full flex-col bg-ink text-white">
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-white/10",
          collapsed ? "justify-center px-2" : "gap-3 px-5",
        )}
      >
        <LogoMark className="h-8 w-8 shrink-0" />
        {!collapsed && (
          <div className="min-w-0 flex-1 leading-tight">
            <p className="font-ui truncate text-[13px] tracking-wide text-white uppercase">
              Shanghai Global
            </p>
            <p className="truncate text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase">
              {role?.label ?? "Admin Console"}
            </p>
          </div>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-2 flex h-9 w-9 items-center justify-center text-white/70 transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav
        aria-label="Admin"
        className="flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-2 py-4"
      >
        {entries.map((entry) => {
          const active = isGroupActive(entry);
          return (
            <SidebarEntry
              key={entry.group.id}
              entry={entry}
              uid={uid}
              pathname={pathname}
              collapsed={collapsed}
              active={active}
              open={manual[entry.group.id] ?? active}
              onToggle={() =>
                setManual((m) => ({ ...m, [entry.group.id]: !(m[entry.group.id] ?? active) }))
              }
            />
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-2">
        <Link
          href="/"
          target="_blank"
          rel="noopener"
          title="View website"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white",
            collapsed && "justify-center px-0",
          )}
        >
          <ExternalLink className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>View website</span>}
        </Link>
      </div>
    </div>
  );
}

interface EntryProps {
  entry: NavEntry;
  uid: string;
  pathname: string;
  collapsed: boolean;
  active: boolean;
  open: boolean;
  onToggle: () => void;
}

const rowBase =
  "relative flex w-full items-center gap-3 px-3 py-2.5 text-left text-[13.5px] font-semibold transition-colors";

function SidebarEntry({ entry, uid, pathname, collapsed, active, open, onToggle }: EntryProps) {
  const Icon = NAV_ICONS[entry.group.icon];
  const groupId = `${uid}-nav-${entry.group.id}`;

  const rowState = active
    ? "bg-white/[0.07] text-white before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-brand-red"
    : "text-white/65 hover:bg-white/5 hover:text-white";

  // Rail mode: icon-only link; groups jump to their first page.
  if (collapsed) {
    const href = entry.href ?? entry.children[0]?.href ?? "/admin";
    return (
      <Link
        href={href}
        title={entry.group.label}
        aria-label={entry.group.label}
        aria-current={active ? "page" : undefined}
        className={cn(rowBase, "justify-center px-0", rowState)}
      >
        <Icon className={cn("h-[18px] w-[18px]", active && "text-brand-red")} />
      </Link>
    );
  }

  if (entry.href) {
    return (
      <Link
        href={entry.href}
        aria-current={active ? "page" : undefined}
        className={cn(rowBase, rowState)}
      >
        <Icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-brand-red")} />
        <span className="truncate">{entry.group.label}</span>
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={groupId}
        className={cn(rowBase, rowState)}
      >
        <Icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-brand-red")} />
        <span className="flex-1 truncate">{entry.group.label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-white/40 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        id={groupId}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <ul className="min-h-0 overflow-hidden" inert={!open}>
          {entry.children.map((child) => {
            const childActive = isActiveHref(pathname, child.href);
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  aria-current={childActive ? "page" : undefined}
                  className={cn(
                    "relative ml-[26px] block border-l py-2 pr-3 pl-5 text-[13px] font-medium transition-colors",
                    childActive
                      ? "border-brand-red text-white"
                      : "border-white/10 text-white/55 hover:text-white",
                  )}
                >
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
