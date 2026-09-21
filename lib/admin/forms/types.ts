/**
 * Declarative form schema. Editors, page section editors and drawers are all
 * described with these definitions and rendered by one engine
 * (components/admin/fields/FormFields.tsx), so every module shares the same
 * behaviour: EN/AR tabs, validation hints, read-only mode, reorder, etc.
 * Pure types (no React) so seeds and schemas can import them.
 */

export interface Option {
  value: string;
  label: string;
}

/** Collections that can feed a select / multiselect. */
export type OptionSource =
  | "brands"
  | "models"
  | "products"
  | "categories"
  | "countries"
  | "posts"
  | "blogCategories"
  | "tags"
  | "testimonials"
  | "jobs";

interface FieldBase {
  name: string;
  label: string;
  help?: string;
  /** Readable required marker (validation is done by the editor). */
  required?: boolean;
  /** Only shown when the predicate over the current record is true. */
  when?: (record: Record<string, unknown>) => boolean;
}

export type FieldDef =
  | (FieldBase & {
      type: "text" | "textarea" | "url" | "email" | "tel" | "number" | "date" | "datetime";
      localized?: boolean;
      placeholder?: string;
      rows?: number;
      /** Character budget shown as a counter (soft limit). */
      max?: number;
    })
  | (FieldBase & { type: "richtext"; localized?: boolean })
  | (FieldBase & {
      type: "select";
      options?: Option[];
      optionsFrom?: OptionSource;
      allowEmpty?: boolean;
    })
  | (FieldBase & { type: "multiselect"; options?: Option[]; optionsFrom?: OptionSource })
  | (FieldBase & { type: "toggle" })
  | (FieldBase & { type: "image" })
  | (FieldBase & { type: "gallery" })
  | (FieldBase & { type: "strings"; placeholder?: string })
  | (FieldBase & {
      type: "repeater";
      item: FieldDef[];
      addLabel?: string;
      /** Field name (inside an item) used as the row title. */
      titleKey?: string;
      max?: number;
    })
  | (FieldBase & { type: "slug"; from: string })
  | { type: "info"; name?: string; label?: string; text: string; when?: (record: Record<string, unknown>) => boolean }
  | {
      type: "group";
      name?: string;
      label: string;
      fields: FieldDef[];
      collapsed?: boolean;
      when?: (record: Record<string, unknown>) => boolean;
    };

export interface SectionTypeDef {
  label: string;
  description?: string;
  fields: FieldDef[];
}

export interface PageSchema {
  label: string;
  path: string;
  /** Section types in the live page's order. */
  sectionTypes: Record<string, SectionTypeDef>;
  /** Page-level fields (navigation, listing settings ...). */
  settingsFields: FieldDef[];
  /** Section types the editor may not remove or reorder (info text shown). */
  note?: string;
}
