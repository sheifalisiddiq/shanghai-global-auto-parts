"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { ROLES } from "@/lib/admin/access/roles";
import { useAuth } from "@/lib/admin/auth/AuthContext";
import { DEMO_PASSWORD, DEMO_USERS } from "@/lib/admin/auth/demo";
import { ADMIN_HOME_PATH } from "@/lib/admin/auth/constants";
import { cn } from "@/lib/utils/cn";

const inputCls =
  "h-12 w-full border border-slate-300 bg-white pr-11 pl-11 text-sm text-ink outline-none transition-colors placeholder:text-slate-400 focus:border-brand-red";

const labelCls = "mb-2 block text-[11px] font-semibold tracking-[0.16em] text-slate-600 uppercase";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const result = await login(email, password);
    if (result.ok) {
      router.replace(ADMIN_HOME_PATH);
      return;
    }
    setError(result.error);
    setPending(false);
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <LogoMark className="h-10 w-10" />
          <span className="font-ui text-sm tracking-wide uppercase">Shanghai Global</span>
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-brand-red uppercase">Admin Console</p>
          <h2 className="font-display mt-4 max-w-md text-5xl leading-[1.05] font-extrabold">Run the website from one place.</h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            One sign-in for the whole team. After you log in, you see the tools for your role.
          </p>
        </div>
        <p className="text-xs text-white/40">&copy; {new Date().getFullYear()} Shanghai Global Auto Parts LLC</p>
        <span aria-hidden className="absolute inset-y-0 right-0 w-1 bg-brand-red" />
      </div>

      <div className="flex items-center justify-center overflow-y-auto bg-paper px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <LogoMark className="h-9 w-9" />
            <span className="font-ui text-sm tracking-wide text-ink uppercase">Shanghai Global</span>
          </div>

          <h1 className="font-display text-3xl font-extrabold text-ink">Sign in</h1>
          <p className="mt-2 text-sm text-slate-500">Enter your credentials to open the dashboard.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="admin-email" className={labelCls}>
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className={inputCls} />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className={labelCls}>
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-1 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-slate-400 transition-colors hover:text-ink"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="border-l-2 border-brand-red bg-brand-red/5 px-3 py-2 text-sm text-brand-red-dark">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="font-ui flex h-12 w-full items-center justify-center bg-brand-red text-sm tracking-wide text-white uppercase transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-8 border border-dashed border-slate-300 bg-white p-4">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">Demo accounts</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Temporary logins for this preview (password <strong className="text-ink">{DEMO_PASSWORD}</strong>). Real authentication comes later.
            </p>
            <ul className="mt-3 divide-y divide-slate-100">
              {DEMO_USERS.map((u) => (
                <li key={u.id} className="flex items-center gap-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-ink">{ROLES[u.roleId].label}</p>
                    <p className="truncate text-[11px] text-slate-500">{u.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(u.email);
                      setPassword(u.password);
                      setError(null);
                    }}
                    className={cn("shrink-0 text-[11px] font-bold text-brand-red underline-offset-4 hover:underline", email === u.email && "text-ink")}
                  >
                    {email === u.email ? "Selected" : "Use this account"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
