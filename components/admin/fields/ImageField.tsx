"use client";

import { useState } from "react";
import { ImageIcon, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Field, TextInput } from "./inputs";
import { ImageThumb, MediaPicker } from "./MediaPicker";

export function ImageField({
  label,
  help,
  value,
  onChange,
  readOnly,
  error,
  required,
}: {
  label: string;
  help?: string;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  error?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Field label={label} help={help} error={error} required={required}>
      <div className="flex items-start gap-3 border border-slate-200 bg-white p-3">
        <ImageThumb url={value} className="h-20 w-20 shrink-0 border border-slate-200" />
        <div className="min-w-0 flex-1 space-y-2">
          <TextInput
            value={value}
            readOnly={readOnly}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/... or https://..."
            aria-label={`${label} URL`}
            className="h-9"
          />
          {!readOnly && (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" icon={<ImageIcon className="h-3.5 w-3.5" />} onClick={() => setOpen(true)}>
                Choose from Media
              </Button>
              {value && (
                <Button size="sm" variant="ghost" icon={<X className="h-3.5 w-3.5" />} onClick={() => onChange("")}>
                  Remove
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <MediaPicker open={open} onClose={() => setOpen(false)} onPick={onChange} title={`Choose: ${label}`} />
    </Field>
  );
}
