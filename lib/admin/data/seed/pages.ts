import { blogPosts } from "@/lib/data/blogs";
import {
  brandLogoDisclaimer,
  certifications,
  contact,
  googleRating,
  locations,
  reviews,
  stats,
} from "@/lib/data/company";
import { faqs } from "@/lib/data/faq";
import { featuredProducts } from "@/lib/data/products";
import { translations } from "@/lib/i18n/translations";
import type { Localized, PageDoc, PageKey, PageSection } from "../types";
import { catId } from "./blogs";
import { L, seoFrom } from "./util";

const en = translations.en as Record<string, string>;
const ar = translations.ar as Record<string, string>;
/** EN + AR text from the live site's translation dictionary (empty if the key is missing). */
const T = (key: string, fallback = ""): Localized => L(en[key] ?? fallback, ar[key] ?? "");

const sec = (type: string, data: Record<string, unknown>): PageSection => ({
  id: `sec-${type}`,
  type,
  visible: true,
  data,
});

const statText = (s: (typeof stats)[number]) => s.displayValue ?? `${s.prefix ?? ""}${s.value}${s.suffix}`;

const ctaBanner = () =>
  sec("ctaBanner", {
    title: T("ctaBanner.title"),
    enquireLabel: T("ctaBanner.enquire"),
    enquireLink: "/products#enquire",
    contactLabel: T("ctaBanner.contact"),
    contactLink: "/contact",
  });

function doc(title: string, slug: string, sections: PageSection[], description: string, settings: Record<string, unknown> = {}): PageDoc {
  return {
    status: "published",
    title: L(title),
    slug,
    sections,
    settings,
    seo: seoFrom(title, description, { canonicalUrl: slug === "" ? "/" : `/${slug}` }),
    updatedAt: "2026-09-01T09:00:00.000Z",
    updatedBy: "Seed",
  };
}

const home = () =>
  doc(
    "Home",
    "",
    [
      sec("hero", {
        eyebrow: T("hero.eyebrow"),
        headline1: T("hero.headline1"),
        headline2: T("hero.headline2"),
        subtitle: T("hero.subtitle"),
        backgroundImage: "/images/hero/hero-bg.jpg",
        backgroundVideo: "",
        cta1Label: T("hero.fastQuote"),
        cta1Link: "https://wa.me/97165335866",
        cta2Label: T("hero.exploreCatalog"),
        cta2Link: "/products",
      }),
      sec("trust", {
        items: [1, 2, 3, 4].map((i) => ({ title: T(`trust.feat${i}Title`), subtitle: T(`trust.feat${i}Sub`) })),
      }),
      sec("engine", {}),
      sec("brands", {
        eyebrow: T("brands.eyebrow"),
        title: T("brands.title"),
        subtitle: T("brands.subtitle"),
        disclaimer: T("brands.disclaimer", brandLogoDisclaimer),
        viewAllLabel: T("brands.viewAll"),
        viewAllLink: "/makes",
      }),
      sec("featuredProducts", {
        eyebrow: T("catalog.eyebrow"),
        title: T("catalog.title"),
        viewAllLabel: T("catalog.viewAll"),
        productIds: featuredProducts.map((p) => p.id),
      }),
      sec("introText", {
        eyebrow: T("home.intro.eyebrow"),
        title: T("about.headline"),
        copy: T("home.intro.copy"),
        ctaLabel: T("home.intro.cta"),
        ctaLink: "/about",
      }),
      sec("whatWeDo", {
        eyebrow: T("whatWeDo.eyebrow"),
        title: T("whatWeDo.title"),
        items: ["sourcing", "network", "payments", "support", "warranty"].map((k, i) => ({
          title: T(`whatWeDo.${k}Title`),
          copy: T(`whatWeDo.${k}Copy`),
          ctaLabel: i === 0 ? T("whatWeDo.enquireNow") : L(""),
          ctaLink: i === 0 ? "/products#enquire" : "",
        })),
      }),
      sec("countries", {
        eyebrow: T("home.countries.eyebrow"),
        title: T("home.countries.title"),
        copy: T("home.countries.copy"),
        countryIds: ["ae", "qa"],
        stats: stats.map((s) => ({ value: statText(s), label: T(`stats.${s.id}`, s.label) })),
      }),
      sec("blogHighlights", {
        eyebrow: T("home.blog.eyebrow"),
        title: T("home.blog.title"),
        copy: T("home.blog.copy"),
        viewAllLabel: T("home.blog.viewAll"),
        postIds: blogPosts.slice(0, 3).map((p) => p.slug),
      }),
      sec("reviews", {
        badge: T("reviews.badge"),
        title: T("reviews.title"),
        subtitle: T("reviews.subtitle"),
        ratingScore: googleRating.score,
        profileUrl: googleRating.profileUrl,
        testimonialIds: reviews.map((r) => r.id),
      }),
      sec("faq", {
        eyebrow: T("faq.eyebrow"),
        title: T("faq.title"),
        subtitle: T("faq.subtitle"),
        items: faqs.map((f) => ({ question: L(f.question), answer: L(f.answer), category: f.category ?? "" })),
        helpTitle: T("faq.ctaHelp"),
        helpDescription: T("faq.ctaDesc"),
      }),
      ctaBanner(),
    ],
    "Shanghai Global Auto Parts home page",
    {
      headerMenu: [
        { label: T("nav.home"), href: "/", visible: true },
        { label: T("nav.about"), href: "/about", visible: true },
        { label: T("nav.spareParts"), href: "/products", visible: true },
        { label: T("nav.blogs"), href: "/blogs", visible: true },
        { label: T("nav.careers"), href: "/careers", visible: true },
        { label: T("nav.contact"), href: "/contact", visible: true },
      ],
      footerLinks: [
        { label: L("Vehicle Makes"), href: "/makes" },
        { label: L("About"), href: "/about" },
        { label: L("Career"), href: "/career" },
        { label: L("Blogs"), href: "/blogs" },
        { label: L("FAQ"), href: "/#faq" },
        { label: L("Enquiry"), href: "/products#enquire" },
        { label: L("Contact"), href: "/contact" },
      ],
    },
  );

const about = () =>
  doc(
    "About Us",
    "about",
    [
      sec("hero", {
        eyebrow: T("about.eyebrow"),
        title: T("about.hero.title"),
        subtitle: T("about.subtitle"),
        image: "/images/about/factory-line.jpg",
        imageAlt: T("about.hero.imageAlt"),
        video: "",
      }),
      sec("story", {
        eyebrow: T("about.intro.eyebrow"),
        headline: T("about.headline"),
        paragraph: T("whatWeDo.networkCopy"),
        bullets: [1, 2, 3, 4].map((i) => ({ text: T(`solutions.b${i}`) })),
        yearsInBusiness: "",
      }),
      sec("timeline", {
        eyebrow: T("about.timeline.eyebrow"),
        title: T("about.timeline.title"),
        steps: [1, 2, 3, 4].map((i) => ({
          year: "",
          title: T(`about.timeline.s${i}.title`),
          copy: T(`about.timeline.s${i}.copy`),
        })),
      }),
      sec("mvv", {
        eyebrow: T("about.mvv.eyebrow"),
        title: T("about.mvv.title"),
        missionTitle: T("about.mission.title"),
        missionCopy: T("about.mission.copy"),
        visionTitle: T("about.vision.title"),
        visionCopy: T("about.vision.copy"),
        valuesTitle: T("about.values.title"),
        values: [1, 2, 3, 4].map((i) => ({ text: T(`about.values.v${i}`) })),
      }),
      sec("stats", {
        items: stats.map((s) => ({
          value: s.displayValue ? s.displayValue.replace(s.suffix, "") : String(s.value),
          suffix: s.suffix,
          label: T(`stats.${s.id}`, s.label),
        })),
      }),
      sec("certifications", {
        eyebrow: T("about.certs.eyebrow"),
        title: T("about.certs.title"),
        items: certifications.map((c) => ({ name: L(c.name), description: L(c.description), image: "" })),
      }),
      sec("brands", {}),
      sec("offices", {
        eyebrow: T("about.whereWeOperate"),
        title: T("about.office.title"),
        photos: [
          { url: "/images/about/factory-line.jpg", alt: T("about.office.photo1Alt") },
          { url: "/images/warehouse/qc-technician.jpg", alt: T("about.quality.imageAlt") },
        ],
        locations: locations.map((l) => ({ label: L(l.label), address: L(l.address), phone: l.phone })),
        ctaLabel: T("about.seeAllLocations"),
      }),
      sec("team", { members: [] }),
      ctaBanner(),
    ],
    "About Shanghai Global Auto Parts",
  );

const products = () =>
  doc(
    "Products",
    "products",
    [
      sec("hero", {
        eyebrow: T("products.heroEyebrow"),
        title: T("products.heroTitle"),
        intro: T("products.heroIntro"),
        banner: "",
      }),
      sec("brandTiles", { title: T("products.brandsTitle"), intro: T("products.brandsIntro") }),
      sec("featuredGroups", { groups: [] }),
      sec("explorer", {
        filterBrand: true,
        filterModel: true,
        filterCategory: true,
        filterCountry: false,
        search: true,
        sortOrder: "featured",
        itemsPerPage: 12,
        pagination: true,
      }),
      sec("enquire", {
        eyebrow: T("products.enquireEyebrow"),
        title: T("products.enquireTitle"),
        body: T("products.enquireBody"),
      }),
    ],
    "Browse Chinese auto parts by brand, model and category",
  );

const blogs = () =>
  doc(
    "Blogs",
    "blogs",
    [
      sec("hero", {
        pill: L("Technical Knowledge & Guides"),
        title: T("blogs.title"),
        subtitle: T("blogs.subtitle"),
        searchPlaceholder: T("blogs.searchPlaceholder"),
      }),
      sec("featured", { postId: "vin-identification-guide", ctaLabel: L("Read Guide") }),
      sec("categorySections", {
        sections: ["Latest Updates", "Product Guides", "Testimonials", "Company News", "Automotive Tips"].map((name) => ({
          categoryId: catId(name),
          title: L(name),
          enabled: true,
        })),
      }),
      sec("grid", {
        eyebrow: L("All Articles"),
        title: L("Browse Auto Parts Guides"),
        description: L("Filtered insights covering fitment protocols, sourcing original stock, and GCC supply chain operations."),
        categoryFilterIds: ["Fitment & VIN", "Sourcing & Original", "Maintenance", "Operations & QC", "Logistics & Trade"].map(catId),
        itemsPerPage: 6,
        search: true,
        pagination: true,
      }),
      sec("newsletter", {
        eyebrow: L("Stay Informed"),
        title: L("Get Wholesale Parts Market Updates"),
        body: L("Subscribe for monthly technical bulletins covering Chinese vehicle catalog supersessions, new model parts releases, and GCC logistics tips."),
        buttonLabel: L("Subscribe to Bulletins"),
      }),
      sec("helpCta", {
        title: L("Ask our parts specialists about your vehicle."),
        body: L("Send your VIN number or part photo directly for instantaneous stock check & pricing."),
        whatsappLabel: L("WhatsApp Instant Quote"),
        whatsappLink: "https://wa.me/97165335866",
        browseLabel: L("Browse Products"),
        browseLink: "/products",
      }),
    ],
    "Technical guides for Chinese auto parts buyers",
  );

const careers = () =>
  doc(
    "Careers",
    "careers",
    [
      sec("hero", {
        pill: L("We Are Hiring"),
        title: T("careers.title"),
        subtitle: T("careers.subtitle"),
        image: "/images/careers/automotive-engineer-hero.png",
        imageAlt: L(""),
        browseLabel: T("careers.browseOpenings"),
        browseLink: "#openings",
        submitLabel: T("careers.submitCv"),
        submitLink: "#apply-form",
      }),
      sec("perks", {
        eyebrow: L("Why Join Us"),
        title: L("Empowering Automotive Talent Across the GCC"),
        description: L("We combine deep technical expertise in OEM components with modern logistics technology and a supportive work culture."),
        items: [
          { title: L("Industry Leader"), description: L("Work with the region's top specialist in Chinese automotive brands with rapid market expansion.") },
          { title: L("International Reach"), description: L("Collaborate with suppliers, logistics partners, and B2B clients across the GCC, Africa, and Eurasia.") },
          { title: L("Growth & Mobility"), description: L("We promote from within. Accelerate your career from technical roles into management positions.") },
          { title: L("Full GCC Benefits"), description: L("Competitive tax-free packages, annual flight tickets, comprehensive health insurance, and UAE visa.") },
        ],
      }),
      sec("openings", {
        eyebrow: L("Current Vacancies"),
        title: L("Explore Open Roles"),
        description: L("Click on any position to view key responsibilities and submit your application directly."),
        filterDepartment: true,
        filterLocation: false,
        filterType: false,
      }),
      sec("application", {
        eyebrow: L("Quick Application"),
        title: L("Submit your CV to our recruitment team."),
        copy: L("Fill out the form below or send your resume directly to our HR team. We review applications continuously for sales, logistics, warehouse, and catalog roles."),
        fields: [
          { key: "name", label: L("Full name"), fieldType: "text", required: true },
          { key: "email", label: L("Email"), fieldType: "email", required: true },
          { key: "phone", label: L("Phone"), fieldType: "tel", required: true },
          { key: "experience", label: L("Experience"), fieldType: "select", required: false },
          { key: "position", label: L("Position"), fieldType: "select", required: false },
          { key: "notes", label: L("Brief Profile / Resume Link / Notes"), fieldType: "textarea", required: false },
        ],
        cvUpload: false,
        consentRequired: false,
        consentText: L(""),
        hrEmail: contact.emails.primary,
        captcha: false,
      }),
      sec("bottomCta", {
        title: L("Connect directly with our recruitment desk."),
        body: L("For urgent inquiries or supplier partnerships, reach out to our team in Sharjah."),
        emailLabel: L("Email HR"),
        locationsLabel: L("Our Locations"),
      }),
    ],
    "Careers at Shanghai Global Auto Parts",
  );

const contactPage = () =>
  doc(
    "Contact Us",
    "contact",
    [
      sec("intro", { title: T("contact.title"), intro: T("contact.subtitle") }),
      sec("cards", {
        eyebrow: T("contact.getInTouch"),
        title: T("contact.sendMessage"),
        subtitle: T("contact.formSubtitle"),
        phone: contact.primaryPhone,
        whatsapp: "+971 6 533 5866",
        email: contact.emails.primary,
        hours: L(contact.hours),
      }),
      sec("form", {
        title: T("contact.sendMessage"),
        fields: [
          { key: "name", label: T("form.fullName"), fieldType: "text", required: true, enabled: true },
          { key: "email", label: T("form.email"), fieldType: "email", required: true, enabled: true },
          { key: "phone", label: T("form.phone"), fieldType: "tel", required: true, enabled: true },
          { key: "country", label: L("Country"), fieldType: "text", required: false, enabled: false },
          { key: "interest", label: T("form.subject"), fieldType: "text", required: false, enabled: true },
          { key: "message", label: T("form.details"), fieldType: "textarea", required: true, enabled: true },
        ],
        consent: false,
        consentText: L(""),
        captcha: false,
        recipient: contact.emails.primary,
      }),
      sec("offices", {
        eyebrow: T("footer.hubs"),
        title: T("contact.locationsTitle"),
        description: T("contact.locationsDesc"),
        mapEmbed: "",
        locations: locations.map((l) => ({
          label: L(l.label),
          address: L(l.address),
          phone: l.phone,
          country: l.id === "qatar" ? "Qatar" : "United Arab Emirates",
        })),
      }),
    ],
    "Contact Shanghai Global Auto Parts",
  );

export function seedPages(): Record<`page_${PageKey}`, PageDoc> {
  return {
    page_home: home(),
    page_about: about(),
    page_products: products(),
    page_blogs: blogs(),
    page_careers: careers(),
    page_contact: contactPage(),
  };
}
