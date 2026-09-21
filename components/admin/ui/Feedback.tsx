"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "./Button";
import { Overlay } from "./Overlay";

type ToastTone = "success" | "error" | "info";
interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

export interface ConfirmOptions {
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  tone?: "danger" | "primary";
  /** User must type this text to enable the confirm button (permanent deletes). */
  requireText?: string;
}

interface FeedbackValue {
  toast: (message: string, tone?: ToastTone) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const Ctx = createContext<FeedbackValue | null>(null);

export function useFeedback(): FeedbackValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFeedback must be used inside <FeedbackProvider>");
  return v;
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const [dialog, setDialog] = useState<(ConfirmOptions & { resolve: (ok: boolean) => void }) | null>(null);
  const [typed, setTyped] = useState("");

  const toast = useCallback((message: string, tone: ToastTone = "success") => {
    const id = nextId.current++;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setTyped("");
        setDialog({ ...options, resolve });
      }),
    [],
  );

  const close = (ok: boolean) => {
    dialog?.resolve(ok);
    setDialog(null);
  };

  const value = useMemo(() => ({ toast, confirm }), [toast, confirm]);
  const danger = (dialog?.tone ?? "danger") === "danger";
  const blocked = !!dialog?.requireText && typed !== dialog.requireText;

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-4 z-[80] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 border bg-white px-4 py-3 text-sm shadow-lg",
              t.tone === "success" && "border-emerald-200",
              t.tone === "error" && "border-brand-red/40",
              t.tone === "info" && "border-slate-200",
            )}
          >
            {t.tone === "success" && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />}
            {t.tone === "error" && <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />}
            {t.tone === "info" && <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />}
            <span className="text-ink">{t.message}</span>
          </div>
        ))}
      </div>
      <Overlay
        open={!!dialog}
        onClose={() => close(false)}
        title={dialog?.title ?? ""}
        size="sm"
        footer={
          <>
            <Button variant="subtle" onClick={() => close(false)}>
              Cancel
            </Button>
            <Button variant={danger ? "primary" : "dark"} disabled={blocked} onClick={() => close(true)}>
              {dialog?.confirmLabel ?? "Confirm"}
            </Button>
          </>
        }
      >
        {dialog?.description && <div className="text-sm leading-relaxed text-slate-600">{dialog.description}</div>}
        {dialog?.requireText && (
          <label className="mt-4 block text-xs text-slate-600">
            Type <strong className="text-ink">{dialog.requireText}</strong> to confirm
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className="mt-2 h-10 w-full border border-slate-300 px-3 text-sm outline-none focus:border-brand-red"
            />
          </label>
        )}
      </Overlay>
    </Ctx.Provider>
  );
}
