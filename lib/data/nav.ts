export interface NavLink {
  label: string;
  href: string;
}

export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Career", href: "/career" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

export const footerQuickLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Product Enquiry", href: "/products#enquire" },
  { label: "Career", href: "/career" },
  { label: "Blogs", href: "/blogs" },
  { label: "Our Locations", href: "/contact#locations" },
];
