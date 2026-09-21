"use client";

import type { FieldDef } from "@/lib/admin/forms/types";
import { SingletonForm } from "../../editors/SingletonForm";

const T = (name: string, label: string, localized = true): FieldDef => ({ type: "text", name, label, localized });

/**
 * Site details. The PDF does not define a Settings module; these fields are the
 * ones its Contact page and Global SEO branding sections touch (they are
 * hard-coded in several places on the live site today).
 */
const FIELDS: FieldDef[] = [
  { type: "text", name: "siteName", label: "Site name", required: true },
  {
    type: "group",
    label: "Contact details",
    fields: [
      { type: "tel", name: "hotline", label: "Main phone / hotline" },
      { type: "tel", name: "secondaryPhone", label: "Secondary phone" },
      { type: "tel", name: "whatsapp", label: "WhatsApp number" },
      { type: "email", name: "emailPrimary", label: "Primary email" },
      { type: "email", name: "emailSecondary", label: "Secondary email" },
      T("businessHours", "Business hours"),
    ],
  },
  {
    type: "group",
    label: "Offices and addresses",
    fields: [
      {
        type: "repeater",
        name: "offices",
        label: "Offices",
        titleKey: "label",
        addLabel: "Add office",
        item: [T("label", "Label"), { type: "textarea", name: "address", label: "Address", localized: true, rows: 2 }, { type: "tel", name: "phone", label: "Phone" }, { type: "text", name: "country", label: "Country" }],
      },
    ],
  },
  {
    type: "group",
    label: "Social profiles",
    fields: [
      {
        type: "repeater",
        name: "socialProfiles",
        label: "Profiles",
        titleKey: "network",
        addLabel: "Add profile",
        item: [{ type: "text", name: "network", label: "Network" }, { type: "url", name: "url", label: "URL" }],
      },
    ],
  },
  {
    type: "group",
    label: "Notifications",
    fields: [
      { type: "email", name: "enquiryEmail", label: "Enquiry notification email", help: "Where new enquiries are sent." },
      { type: "email", name: "hrEmail", label: "HR notification email", help: "Where job applications are sent." },
    ],
  },
];

export function SettingsScreen() {
  return (
    <SingletonForm
      storeKey="settings"
      resource="settings"
      title="Settings"
      description="Site details used across the website."
      fields={FIELDS}
      loadDefault={async () => (await import("@/lib/admin/data/seed/admin")).seedSettings()}
    />
  );
}
