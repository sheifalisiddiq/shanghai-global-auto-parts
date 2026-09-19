export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: "Fitment & Quality" | "Orders & Shipping" | "Brands & Sourcing" | "Warranty & Support";
}

export const faqs: FAQItem[] = [
  {
    id: "vin-guarantee",
    category: "Fitment & Quality",
    question: "How do you guarantee 100% accurate parts fitment?",
    answer:
      "We verify every order against your vehicle's 17-digit VIN (Chassis Number) using official OEM Electronic Parts Catalogues (EPC). This cross-referencing process eliminates guesswork and ensures the exact part specification, revision, and connector match your vehicle before dispatch.",
  },
  {
    id: "original-vs-oem",
    category: "Fitment & Quality",
    question: "What is the difference between your Original, OEM, and Aftermarket parts?",
    answer:
      "Original parts come in original manufacturer-branded packaging (e.g., Jetour, Geely, Changan). OEM parts are produced by the exact tier-1 factories that supply car manufacturers, offering identical build quality without the automaker markup. Aftermarket options are high-grade certified alternatives that meet or exceed OE safety and performance standards.",
  },
  {
    id: "brands-covered",
    category: "Brands & Sourcing",
    question: "Which Chinese automotive brands do you support?",
    answer:
      "We stock and source spare parts for all major Chinese vehicle manufacturers in the GCC, including Jetour, Changan, Geely, Chery, Haval, GWM (Tank 300/500 & Poer), BYD, MG (Morris Garages), BAIC, JAC, LDV/Maxus, Omoda, Jaecoo, and NIO.",
  },
  {
    id: "delivery-times",
    category: "Orders & Shipping",
    question: "How fast is delivery across the UAE, Qatar, and the GCC?",
    answer:
      "In-stock items from our Sharjah and Abu Dhabi hubs offer same-day dispatch and next-day delivery throughout the UAE. For Qatar, we provide express 24–48 hour air dispatch or fast road freight. For Saudi Arabia, Oman, Bahrain, Kuwait, and global clients, we ship via DHL Express, FedEx, or air cargo.",
  },
  {
    id: "quote-inquiry",
    category: "Orders & Shipping",
    question: "How can I request a quote or check parts availability?",
    answer:
      "The fastest way is via our 24/7 WhatsApp parts desk (+971 6 533 5866). Simply send your vehicle's 17-digit VIN number and a description or photo of the part you need. Our technical team usually responds within 15–30 minutes during working hours with part options and pricing.",
  },
  {
    id: "warranty-policy",
    category: "Warranty & Support",
    question: "Do your spare parts come with a warranty?",
    answer:
      "Yes. All Original and OEM components are backed by manufacturer product warranties against manufacturing defects. If a component is confirmed defective or incompatible despite VIN verification, our exchange and return process is quick and hassle-free.",
  },
  {
    id: "rare-parts-sourcing",
    category: "Brands & Sourcing",
    question: "Can you source rare or out-of-stock parts directly from China?",
    answer:
      "Yes. Through our established supply network of partner factories and distribution hubs in Shanghai and Guangzhou, we can factory-source hard-to-find engine assemblies, transmission parts, electronic ECUs, and body panels, with express air shipping to the UAE within 5–7 business days.",
  },
];
