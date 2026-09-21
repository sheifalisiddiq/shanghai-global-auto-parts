"use client";

import { FlaskConical, RotateCcw } from "lucide-react";
import { db } from "@/lib/admin/data";
import { useCan } from "@/lib/admin/auth/AuthContext";
import { Button } from "../ui/Button";
import { useFeedback } from "../ui/Feedback";

/** Always-visible reminder that admin data is a browser-only demo. */
export function DemoBanner() {
  const can = useCan();
  const { confirm, toast } = useFeedback();

  async function reset() {
    const ok = await confirm({
      title: "Reset demo data?",
      description: "All demo changes in this browser are discarded and the data returns to the seeded set (real site data plus labelled Sample rows).",
      confirmLabel: "Reset demo data",
    });
    if (!ok) return;
    await db.reset();
    toast("Demo data reset.");
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900 sm:px-6">
      <span className="flex items-center gap-2 font-semibold">
        <FlaskConical className="h-4 w-4" />
        Demo mode
      </span>
      <span className="text-amber-800">Changes stay in this browser and are not on the live site.</span>
      {can("settings", "edit") && (
        <Button size="sm" variant="subtle" className="ml-auto" icon={<RotateCcw className="h-3 w-3" />} onClick={reset}>
          Reset demo data
        </Button>
      )}
    </div>
  );
}
