import type { FieldDef, PageSchema, SectionTypeDef } from "@/lib/admin/forms/types";
import type { PageKey } from "@/lib/admin/data/types";

/**
 * Page editors are structured around the REAL sections of each public page
 * (component order taken from app/(site)/**). Field names match the seed data
 * in lib/admin/data/seed/pages.ts. The PDF's page-level fields (SEO, slug,
 * canonical, social, schema) are handled by the SEO panel, not here.
 */

const t = (name: string, label: string, extra: { max?: number; placeholder?: string } = {}): FieldDef => ({
  type: "text",
  name,
  label,
  localized: true,
  ...extra,
});
const ta = (name: string, label: string, rows = 3): FieldDef => ({
  type: "textarea",
  name,
  label,
  localized: true,
  rows,
});
const link = (name: string, label: string): FieldDef => ({ type: "url", name, label, placeholder: "/products or https://..." });
const plain = (name: string, label: string): FieldDef => ({ type: "text", name, label });
const toggle = (name: string, label: string, help?: string): FieldDef => ({ type: "toggle", name, label, help });
const image = (name: string, label: string, help?: string): FieldDef => ({ type: "image", name, label, help });

const cta = (prefix: string, label: string): FieldDef[] => [
  t(`${prefix}Label`, `${label} button text`),
  link(`${prefix}Link`, `${label} button link`),
];

const eyebrowTitle = (extraCopy = false): FieldDef[] => [
  t("eyebrow", "Small heading (eyebrow)"),
  t("title", "Title"),
  ...(extraCopy ? [ta("copy", "Paragraph")] : []),
];

const S = (label: string, fields: FieldDef[], description?: string): SectionTypeDef => ({ label, fields, description });

/* -------------------------------- HOME -------------------------------- */

const HOME: PageSchema = {
  label: "Home",
  path: "/",
  note: "Sections appear on the live Home page in this order. Drag or use the arrows to reorder.",
  sectionTypes: {
    hero: S("Hero", [
      t("eyebrow", "Eyebrow pill"),
      t("headline1", "Headline line 1"),
      t("headline2", "Headline line 2"),
      ta("subtitle", "Subtitle"),
      image("backgroundImage", "Banner image"),
      plain("backgroundVideo", "Banner video URL (optional)"),
      ...cta("cta1", "Primary"),
      ...cta("cta2", "Secondary"),
    ]),
    trust: S("Trust / USP bar", [
      {
        type: "repeater",
        name: "items",
        label: "USP items",
        titleKey: "title",
        addLabel: "Add USP item",
        max: 6,
        item: [t("title", "Title"), t("subtitle", "Subtitle")],
      },
    ]),
    engine: S(
      "Engine graphic",
      [{ type: "info", text: "Scroll-driven exploded-engine graphic. It has no editable text; it stays in this position on the live page." }],
      "Non-text visual",
    ),
    brands: S("Brand marquee", [
      ...eyebrowTitle(),
      ta("subtitle", "Subtitle"),
      ta("disclaimer", "Logo disclaimer", 2),
      ...cta("viewAll", "View all"),
    ]),
    featuredProducts: S("Featured products carousel", [
      t("eyebrow", "Small heading (eyebrow)"),
      t("title", "Title"),
      t("viewAllLabel", "View catalogue button text"),
      { type: "multiselect", name: "productIds", label: "Featured products", optionsFrom: "products", help: "Choose which products appear in the carousel (Select Featured Items)." },
    ]),
    introText: S("Company introduction", [...eyebrowTitle(true), ...cta("cta", "Learn more")]),
    whatWeDo: S("What we do", [
      ...eyebrowTitle(),
      {
        type: "repeater",
        name: "items",
        label: "Items",
        titleKey: "title",
        addLabel: "Add item",
        item: [t("title", "Title"), ta("copy", "Description"), ...cta("cta", "Optional")],
      },
    ]),
    countries: S("Featured countries", [
      ...eyebrowTitle(true),
      { type: "multiselect", name: "countryIds", label: "Featured country terms", optionsFrom: "countries" },
      {
        type: "repeater",
        name: "stats",
        label: "Headline statistics",
        titleKey: "value",
        addLabel: "Add statistic",
        item: [plain("value", "Value (e.g. 40+)"), t("label", "Label")],
      },
    ]),
    blogHighlights: S("Blog highlights", [
      ...eyebrowTitle(true),
      t("viewAllLabel", "View all button text"),
      { type: "multiselect", name: "postIds", label: "Posts shown", optionsFrom: "posts" },
    ]),
    reviews: S("Testimonials / Google reviews", [
      t("badge", "Badge"),
      t("title", "Title"),
      ta("subtitle", "Subtitle"),
      { type: "number", name: "ratingScore", label: "Rating score" },
      link("profileUrl", "Google profile link"),
      { type: "multiselect", name: "testimonialIds", label: "Testimonials shown", optionsFrom: "testimonials" },
    ]),
    faq: S("FAQ", [
      ...eyebrowTitle(),
      ta("subtitle", "Subtitle"),
      {
        type: "repeater",
        name: "items",
        label: "Questions",
        titleKey: "question",
        addLabel: "Add question",
        item: [
          { type: "text", name: "question", label: "Question", localized: true },
          { type: "textarea", name: "answer", label: "Answer", localized: true, rows: 3 },
          plain("category", "Category"),
        ],
      },
      t("helpTitle", "Help box title"),
      ta("helpDescription", "Help box text", 2),
    ]),
    ctaBanner: S("CTA banner", [t("title", "Title"), ...cta("enquire", "Enquire"), ...cta("contact", "Contact")]),
  },
  settingsFields: [
    {
      type: "group",
      label: "Navigation (header menu visibility, footer links)",
      fields: [
        {
          type: "repeater",
          name: "headerMenu",
          label: "Header menu",
          titleKey: "label",
          addLabel: "Add menu item",
          item: [t("label", "Label"), link("href", "Link"), toggle("visible", "Visible in header")],
        },
        {
          type: "repeater",
          name: "footerLinks",
          label: "Footer links",
          titleKey: "label",
          addLabel: "Add footer link",
          item: [t("label", "Label"), link("href", "Link")],
        },
      ],
    },
  ],
};

/* -------------------------------- ABOUT -------------------------------- */

const ABOUT: PageSchema = {
  label: "About Us",
  path: "/about",
  note: "Sections follow the live About page order.",
  sectionTypes: {
    hero: S("Hero", [
      t("eyebrow", "Eyebrow"),
      t("title", "Page title"),
      ta("subtitle", "Subtitle"),
      image("image", "Hero / banner image"),
      t("imageAlt", "Image ALT text"),
      plain("video", "Video URL (optional)"),
    ]),
    story: S("Company story", [
      t("eyebrow", "Eyebrow"),
      t("headline", "Headline"),
      ta("paragraph", "Company introduction", 4),
      {
        type: "repeater",
        name: "bullets",
        label: "Key points",
        titleKey: "text",
        addLabel: "Add point",
        item: [t("text", "Text")],
      },
      { type: "number", name: "yearsInBusiness", label: "Years in business" },
    ]),
    timeline: S("History / milestones", [
      ...eyebrowTitle(),
      {
        type: "repeater",
        name: "steps",
        label: "Milestones",
        titleKey: "title",
        addLabel: "Add milestone",
        item: [plain("year", "Year (optional)"), t("title", "Title"), ta("copy", "Description")],
      },
    ]),
    mvv: S("Mission, vision & values", [
      t("eyebrow", "Eyebrow"),
      t("title", "Title"),
      t("missionTitle", "Mission title"),
      ta("missionCopy", "Mission text"),
      t("visionTitle", "Vision title"),
      ta("visionCopy", "Vision text"),
      t("valuesTitle", "Values title"),
      {
        type: "repeater",
        name: "values",
        label: "Values",
        titleKey: "text",
        addLabel: "Add value",
        item: [t("text", "Value")],
      },
    ]),
    stats: S("Trust statistics band", [
      {
        type: "repeater",
        name: "items",
        label: "Counters",
        titleKey: "label",
        addLabel: "Add counter",
        item: [plain("value", "Value"), plain("suffix", "Suffix (e.g. +, %)"), t("label", "Label")],
      },
    ]),
    certifications: S("Certifications", [
      ...eyebrowTitle(),
      {
        type: "repeater",
        name: "items",
        label: "Certifications",
        titleKey: "name",
        addLabel: "Add certification",
        item: [t("name", "Name"), ta("description", "Description", 2), image("image", "Certificate image (optional)")],
      },
    ]),
    brands: S("Brands served", [
      {
        type: "info",
        text: "Uses the same brand marquee as the Home page. Edit its text under Pages > Home > Brand marquee.",
      },
    ]),
    offices: S("Office & warehouse", [
      ...eyebrowTitle(),
      { type: "gallery", name: "photos", label: "Photos (Manage Gallery)" },
      {
        type: "repeater",
        name: "locations",
        label: "Office / warehouse cards",
        titleKey: "label",
        addLabel: "Add location",
        item: [t("label", "Label"), ta("address", "Address", 2), plain("phone", "Phone")],
      },
      t("ctaLabel", "See all locations button text"),
    ]),
    team: S("Team (optional)", [
      {
        type: "repeater",
        name: "members",
        label: "Team members",
        titleKey: "name",
        addLabel: "Add team member",
        item: [plain("name", "Name"), t("role", "Role"), image("photo", "Photo")],
      },
    ]),
    ctaBanner: S("CTA banner", [t("title", "Title"), ...cta("enquire", "Enquire"), ...cta("contact", "Contact")]),
  },
  settingsFields: [],
};

/* ------------------------------ PRODUCTS ------------------------------ */

const PRODUCTS: PageSchema = {
  label: "Products",
  path: "/products",
  note: "Landing page for the product catalogue.",
  sectionTypes: {
    hero: S("Hero", [t("eyebrow", "Eyebrow"), t("title", "Page title"), ta("intro", "Introduction"), image("banner", "Hero / banner image")]),
    brandTiles: S("Brand tiles", [t("title", "Title"), ta("intro", "Introduction")]),
    featuredGroups: S("Featured product groups", [
      {
        type: "repeater",
        name: "groups",
        label: "Groups",
        titleKey: "title",
        addLabel: "Add group",
        item: [
          t("title", "Group title"),
          { type: "multiselect", name: "productIds", label: "Products (Select Featured Products)", optionsFrom: "products" },
        ],
      },
    ]),
    explorer: S("Filters & listing", [
      { type: "toggle", name: "filterBrand", label: "Filter by Brand" },
      { type: "toggle", name: "filterModel", label: "Filter by Model" },
      { type: "toggle", name: "filterCategory", label: "Filter by Product Category" },
      { type: "toggle", name: "filterCountry", label: "Filter by Country" },
      { type: "toggle", name: "search", label: "Keyword search" },
      {
        type: "select",
        name: "sortOrder",
        label: "Default sort order",
        options: [
          { value: "featured", label: "Featured first" },
          { value: "az", label: "Name A to Z" },
          { value: "za", label: "Name Z to A" },
        ],
      },
      { type: "number", name: "itemsPerPage", label: "Items per page" },
      { type: "toggle", name: "pagination", label: "Show pagination" },
    ]),
    enquire: S("Enquiry section", [t("eyebrow", "Eyebrow"), t("title", "Title"), ta("body", "Text")]),
  },
  settingsFields: [],
};

/* ------------------------------- BLOGS ------------------------------- */

const BLOGS: PageSchema = {
  label: "Blogs",
  path: "/blogs",
  note: "Blog landing page. Category sections follow the PDF: Latest Updates, Product Guides, Testimonials, Company News, Automotive Tips.",
  sectionTypes: {
    hero: S("Hero & search", [t("pill", "Pill text"), t("title", "Page title"), ta("subtitle", "Subtitle"), t("searchPlaceholder", "Search placeholder")]),
    featured: S("Featured article", [
      { type: "select", name: "postId", label: "Featured post", optionsFrom: "posts", allowEmpty: true, help: "Empty = the first featured post." },
      t("ctaLabel", "Button text"),
    ]),
    categorySections: S("Category sections", [
      {
        type: "repeater",
        name: "sections",
        label: "Sections",
        titleKey: "title",
        addLabel: "Add category section",
        item: [
          { type: "select", name: "categoryId", label: "Blog category", optionsFrom: "blogCategories" },
          t("title", "Section title"),
          toggle("enabled", "Show on page"),
        ],
      },
    ]),
    grid: S("Article grid", [
      t("eyebrow", "Eyebrow"),
      t("title", "Title"),
      ta("description", "Description", 2),
      { type: "multiselect", name: "categoryFilterIds", label: "Category filter chips", optionsFrom: "blogCategories" },
      { type: "number", name: "itemsPerPage", label: "Items per page" },
      toggle("search", "Search box"),
      toggle("pagination", "Pagination"),
    ]),
    newsletter: S("Newsletter", [
      t("eyebrow", "Eyebrow"),
      t("title", "Title"),
      ta("body", "Text"),
      t("buttonLabel", "Button text"),
    ]),
    helpCta: S("Help CTA", [t("title", "Title"), ta("body", "Text"), ...cta("whatsapp", "WhatsApp"), ...cta("browse", "Browse products")]),
  },
  settingsFields: [],
};

/* ------------------------------- CAREERS ------------------------------- */

const CAREERS: PageSchema = {
  label: "Careers",
  path: "/careers",
  note: "Careers landing page. Job openings themselves are managed under Careers > Job Openings.",
  sectionTypes: {
    hero: S("Hero / banner", [
      t("pill", "Pill text"),
      t("title", "Page title"),
      ta("subtitle", "Introduction"),
      image("image", "Banner image"),
      t("imageAlt", "Image ALT text"),
      ...cta("browse", "Browse openings"),
      ...cta("submit", "Submit CV"),
    ]),
    perks: S("Why work with us / benefits", [
      ...eyebrowTitle(),
      ta("description", "Description", 2),
      {
        type: "repeater",
        name: "items",
        label: "Benefits",
        titleKey: "title",
        addLabel: "Add benefit",
        item: [t("title", "Title"), ta("description", "Description", 2)],
      },
    ]),
    openings: S("Open positions", [
      ...eyebrowTitle(),
      ta("description", "Description", 2),
      toggle("filterDepartment", "Department filter"),
      toggle("filterLocation", "Location filter"),
      toggle("filterType", "Employment type filter"),
    ]),
    application: S("Application form", [
      ...eyebrowTitle(true),
      {
        type: "repeater",
        name: "fields",
        label: "Application form fields",
        titleKey: "label",
        addLabel: "Add field",
        item: [
          plain("key", "Field key"),
          t("label", "Label"),
          {
            type: "select",
            name: "fieldType",
            label: "Type",
            options: [
              { value: "text", label: "Text" },
              { value: "email", label: "Email" },
              { value: "tel", label: "Phone" },
              { value: "select", label: "Dropdown" },
              { value: "textarea", label: "Long text" },
              { value: "file", label: "File upload" },
            ],
          },
          toggle("required", "Required"),
        ],
      },
      toggle("cvUpload", "Allow CV upload"),
      toggle("consentRequired", "Consent checkbox"),
      ta("consentText", "Consent text", 2),
      { type: "email", name: "hrEmail", label: "HR email routing" },
      toggle("captcha", "CAPTCHA"),
    ]),
    bottomCta: S("Bottom CTA", [t("title", "Title"), ta("body", "Text"), t("emailLabel", "Email HR button text"), t("locationsLabel", "Locations button text")]),
  },
  settingsFields: [],
};

/* ------------------------------- CONTACT ------------------------------- */

const CONTACT: PageSchema = {
  label: "Contact Us",
  path: "/contact",
  note: "The live page has no headline; the Page title / intro section is provided for the PDF fields.",
  sectionTypes: {
    intro: S("Page title & intro", [t("title", "Page title"), ta("intro", "Introduction")]),
    cards: S("Contact cards", [
      t("eyebrow", "Eyebrow"),
      t("title", "Title"),
      ta("subtitle", "Subtitle", 2),
      { type: "tel", name: "phone", label: "Phone" },
      { type: "tel", name: "whatsapp", label: "WhatsApp number" },
      { type: "email", name: "email", label: "Email" },
      t("hours", "Business hours"),
    ]),
    form: S("Enquiry form", [
      t("title", "Form title"),
      {
        type: "repeater",
        name: "fields",
        label: "Form fields",
        titleKey: "label",
        addLabel: "Add field",
        item: [
          plain("key", "Field key"),
          t("label", "Label"),
          {
            type: "select",
            name: "fieldType",
            label: "Type",
            options: [
              { value: "text", label: "Text" },
              { value: "email", label: "Email" },
              { value: "tel", label: "Phone" },
              { value: "select", label: "Dropdown" },
              { value: "textarea", label: "Long text" },
            ],
          },
          toggle("required", "Required"),
          toggle("enabled", "Shown"),
        ],
      },
      toggle("consent", "Consent checkbox"),
      ta("consentText", "Consent text", 2),
      toggle("captcha", "CAPTCHA"),
      { type: "email", name: "recipient", label: "Enquiry email routing" },
    ]),
    offices: S("Offices & map", [
      ...eyebrowTitle(),
      ta("description", "Description", 2),
      plain("mapEmbed", "Google Map embed URL (optional)"),
      {
        type: "repeater",
        name: "locations",
        label: "Offices / branches",
        titleKey: "label",
        addLabel: "Add office",
        item: [t("label", "Label"), ta("address", "Address", 2), plain("phone", "Phone"), plain("country", "Country / branch")],
      },
    ]),
  },
  settingsFields: [],
};

export const PAGE_SCHEMAS: Record<PageKey, PageSchema> = {
  home: HOME,
  about: ABOUT,
  products: PRODUCTS,
  blogs: BLOGS,
  careers: CAREERS,
  contact: CONTACT,
};
