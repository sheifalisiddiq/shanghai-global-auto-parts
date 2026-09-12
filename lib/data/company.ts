export const siteName = "Shanghai Global Auto Parts";

export const heroHeadline = "YOUR SOURCE FOR CHINESE AUTOMOTIVE PARTS";

export const companyIntro =
  "Shanghai Global is a leading supplier and distributor of high-quality auto spare parts — sourcing and trading genuine, OEM and reliable components for automotive businesses worldwide.";

export interface Stat {
  id: string;
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  { id: "countries", value: 40, suffix: "+", label: "Countries served" },
  { id: "parts", value: 5000, suffix: "+", label: "Parts catalogued" },
  { id: "accuracy", value: 98, suffix: "%", label: "Order accuracy" },
  {
    id: "response",
    value: 24,
    suffix: "–48h",
    label: "Avg. response time",
  },
];

export interface WhatWeDoItem {
  id: string;
  index: string;
  title: string;
  copy: string;
  cta?: { label: string; href: string };
}

export const whatWeDo: WhatWeDoItem[] = [
  {
    id: "sourcing",
    index: "01",
    title: "Product Sourcing",
    copy: "We have established strong relationships with reputable manufacturers and suppliers across China, allowing us to source a comprehensive range of auto spare parts. Our expert team ensures that all products meet strict quality standards and are compatible with various vehicle makes and models.",
    cta: { label: "ENQUIRE NOW", href: "/products#enquire" },
  },
  {
    id: "network",
    index: "02",
    title: "Network of own and partner OEM Factories",
    copy: "Our extensive network includes our own factories and partner OEM facilities. This ensures a smooth supply chain for top-notch products made with precision and meeting the highest quality standards.",
  },
  {
    id: "payments",
    index: "03",
    title: "Easy Payments",
    copy: "We understand that acquiring the right components for your vehicles should be straightforward, which is why our easy payment options have been meticulously crafted. Experience a hassle-free checkout process that ensures swift and secure transactions.",
  },
  {
    id: "support",
    index: "04",
    title: "Technical Support",
    copy: "Our team of experienced professionals is always ready to assist you. Whether you need guidance in selecting the right part or advice on installation, we're here to provide you with the expertise you can trust.",
  },
  {
    id: "warranty",
    index: "05",
    title: "Product Warranty",
    copy: "To build trust with our customers, we provide product warranties that ensure the quality and performance of our offerings.",
  },
];

export const solutions = {
  paragraph:
    "We specialise in delivering top-notch parts and comprehensive sourcing solutions worldwide. Explore a vast selection of genuine, OEM and reliable spare parts — from brakes and filters to engine components and accessories — every one meeting the standard your automotive business runs on.",
  bullets: [
    "Genuine, OEM & aftermarket options",
    "Global sourcing network across 40+ countries",
    "Every part quality-checked before dispatch",
    "Dedicated account support, start to delivery",
  ],
};

export interface LocationInfo {
  id: string;
  label: string;
  address: string;
  phone: string;
}

export const locations: LocationInfo[] = [
  {
    id: "sharjah",
    label: "Sharjah (HQ)",
    address:
      "Al Nayeli Complex - Shop No-B1 - Industrial Area 13 - Industrial Area - Sharjah, United Arab Emirates",
    phone: "+971 6 533 5866",
  },
  {
    id: "abudhabi",
    label: "Abu Dhabi",
    address: "Shop No.4 - Al Bees 8 St - Musaffah - M14 - Abu Dhabi, United Arab Emirates",
    phone: "+971 2 622 5133",
  },
  {
    id: "qatar",
    label: "Qatar",
    address: "6CWJ+J6, Furousiya St, Al-Rayyan, Qatar",
    phone: "+971 2 622 5133",
  },
];

export const contact = {
  primaryPhone: "+971 6 533 5866",
  emails: {
    primary: "info@shanghaiglobalauto.com",
    secondary: "shanghaiglobal.uae@gmail.com",
  },
  hours: "Mon – Fri: 8AM – 9PM",
  locationsLine: "Dubai | Sharjah | Qatar | Abu Dhabi",
  copyright:
    "© 2026 Shanghai Global Auto Parts. All Rights Reserved. Powered By Shanghai Global Auto",
};

export const brandLogoDisclaimer =
  "Logos shown for parts-compatibility reference only. All trademarks are the property of their respective owners.";
