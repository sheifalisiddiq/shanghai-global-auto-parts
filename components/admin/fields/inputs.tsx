"use client";

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export const inputCls =
  "w-full border border-slate-300 bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-slate-400 focus:border-brand-red disabled:bg-slate-50 disabled:text-slate-500 read-only:bg-slate-50";

export function Field({
  label,
  help,
  error,
  required,
  counter,
  children,
  htmlFor,
  className,
}: {
  label?: ReactNode;
  help?: ReactNode;
  error?: string;
  required?: boolean;
  counter?: ReactNode;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      {(label || counter) && (
        <div className="mb-1.5 flex items-end justify-between gap-2">
          {label && (
            <label htmlFor={htmlFor} className="text-[11px] font-semibold tracking-[0.14em] text-slate-600 uppercase">
              {label}
              {required && <span className="ml-0.5 text-brand-red">*</span>}
            </label>
          )}
          {counter && <span className="text-[11px] text-slate-400">{counter}</span>}
        </div>
      )}
      {children}
      {help && !error && <p className="mt-1 text-xs leading-relaxed text-slate-500">{help}</p>}
      {error && (
        <p role="alert" className="mt-1 text-xs text-brand-red-dark">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...p} className={cn(inputCls, "h-10", className)} />;
}

export function TextArea({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...p} className={cn(inputCls, "min-h-[5rem] py-2 leading-relaxed", className)} />;
}

export function Select({ className, children, ...p }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...p} className={cn(inputCls, "h-10 pr-8", className)}>
      {children}
    </select>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  help,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
  help?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3", disabled && "cursor-not-allowed opacity-60")}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn("relative mt-0.5 h-5 w-9 shrink-0 transition-colors", checked ? "bg-brand-red" : "bg-slate-300")}
      >
        <span className={cn("absolute top-0.5 left-0.5 h-4 w-4 bg-white transition-transform", checked && "translate-x-4")} />
      </button>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {help && <span className="block text-xs text-slate-500">{help}</span>}
      </span>
    </label>
  );
}
