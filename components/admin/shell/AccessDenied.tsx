"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/admin/auth/AuthContext";
import { ADMIN_HOME_PATH, ADMIN_LOGIN_PATH } from "@/lib/admin/auth/constants";

/** Shown inside the user's own shell when they open a page their role can't access. */
export function AccessDenied() {
  const router = useRouter();
  const { logout, role } = useAuth();

  async function backToLogin() {
    await logout();
    router.replace(ADMIN_LOGIN_PATH);
  }

  return (
    <div className="mx-auto mt-10 max-w-lg border border-slate-200 bg-white px-6 py-14 text-center sm:px-10">
      <span className="mx-auto flex h-14 w-14 items-center justify-center bg-brand-red/10 text-brand-red">
        <ShieldAlert className="h-7 w-7" />
      </span>
      <p className="font-display mt-6 text-5xl font-extrabold text-brand-red">403</p>
      <h2 className="font-display mt-2 text-2xl font-extrabold text-ink">Access denied</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">
        You don&apos;t have access to this page{role ? ` with the ${role.label} role` : ""}. If you
        think this is a mistake, ask an Administrator to update your permissions.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href={ADMIN_HOME_PATH}
          className="font-ui inline-flex h-11 items-center justify-center bg-brand-red px-5 text-xs tracking-wide text-white uppercase transition-colors hover:bg-ink"
        >
          Go to my dashboard
        </Link>
        <button
          type="button"
          onClick={backToLogin}
          className="font-ui inline-flex h-11 items-center justify-center border border-ink px-5 text-xs tracking-wide text-ink uppercase transition-colors hover:bg-ink hover:text-white"
        >
          Back to login
        </button>
      </div>
    </div>
  );
}
