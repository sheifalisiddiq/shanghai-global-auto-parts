import { emptyLocalized, emptySeo } from "./defaults";
import type { Localized } from "./types";

/** Blank records for "New ..." screens. Timestamps/ids are added by the data layer. */
const L = (): Localized => emptyLocalized();
const base = { status: "draft" as const };

export const newBrand = () => ({
  ...base,
  name: L(), slug: "", category: L(), badge: "", logo: "", shortDescription: L(), longDescription: L(),
  banner: "", thumbnail: "", sortOrder: 0, featured: false, keyComponents: [] as string[], seo: emptySeo(),
});

export const newModel = () => ({
  ...base,
  name: L(), slug: "", brandId: "", image: "", description: L(), generation: "", featured: false,
  sortOrder: 0, categoryIds: [] as string[], seo: emptySeo(),
});

export const newProduct = () => ({
  ...base,
  name: L(), slug: "", sku: "", oemNumbers: [] as string[], brandId: "", modelId: "", categoryId: "",
  fitment: [] as { brandId: string; modelId: string; years: string }[], yearGeneration: "",
  crossReferences: [] as string[], shortDescription: L(), fullDescription: L(),
  features: [] as { text: Localized }[], specifications: [] as { label: Localized; value: Localized }[],
  fittingNotes: L(), faq: [] as { question: Localized; answer: Localized }[],
  mainImage: "", imageAlt: L(), gallery: [] as { url: string; alt: Localized }[], catalogPdf: "",
  commercial: { enquiryCta: true, whatsappCta: true, availability: "on-request", showPrice: false, price: "" },
  countryIds: [] as string[], tags: [] as string[], featured: false, seo: emptySeo(),
});

export const newCategory = () => ({
  ...base, name: L(), slug: "", parentId: "", description: L(), image: "", icon: "", seo: emptySeo(),
});

export const newCountry = () => ({
  ...base, name: L(), slug: "", code: "", flag: "", shortDescription: L(), longDescription: L(),
  archiveEnabled: false, featured: false, sortOrder: 0, banner: "", seo: emptySeo(),
});

export const newBlogCategory = () => ({
  ...base, name: L(), slug: "", description: L(), purpose: L(), banner: "", thumbnail: "", sortOrder: 0, seo: emptySeo(),
});

export const newTag = () => ({ ...base, name: L(), slug: "", description: L(), seo: emptySeo() });

export const newPost = () => ({
  ...base,
  title: L(), slug: "", excerpt: L(), content: L(), authorName: "", authorRole: "",
  publishDate: new Date().toISOString(), scheduledAt: "", featuredImage: "", imageAlt: L(),
  categoryId: "", tagIds: [] as string[], countryIds: [] as string[], relatedPostIds: [] as string[],
  relatedProductIds: [] as string[], relatedBrandIds: [] as string[], relatedModelIds: [] as string[],
  internalLinks: [] as { label: string; url: string }[], cta: { label: L(), url: "" },
  readTime: "", featured: false, seo: emptySeo(),
});

export const newTestimonial = () => ({
  ...base,
  name: "", slug: "", meta: L(), country: "", text: L(), videoUrl: "", rating: 5,
  relatedProductId: "", relatedBrandId: "", image: "", thumbnail: "", imageAlt: L(), featured: false, seo: emptySeo(),
});

export const newJob = () => ({
  ...base,
  title: L(), slug: "", department: "", location: "", employmentType: "Full-Time", experience: "",
  salaryRange: "", showSalary: false, summary: L(),
  responsibilities: [] as { text: Localized }[], requirements: [] as { text: Localized }[],
  skills: [] as { text: Localized }[], benefits: [] as { text: Localized }[],
  applicationDeadline: "", datePosted: new Date().toISOString().slice(0, 10), validThrough: "",
  hiringOrganisation: "Shanghai Global Auto Parts LLC", applyUrl: "", hrEmail: "", cvUpload: false,
  jobStatus: "open" as const, seo: { ...emptySeo(), schemaType: "JobPosting" },
});
