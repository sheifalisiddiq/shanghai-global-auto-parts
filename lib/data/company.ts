export const siteName = "Shanghai Global Auto Parts";

export const heroHeadline = "YOUR SOURCE FOR CHINESE AUTOMOTIVE PARTS";

export const companyIntro =
  "Leading supplier of original, OEM and reliable auto spare parts worldwide.";

export interface Stat {
  id: string;
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
  displayValue?: string;
}

export const stats: Stat[] = [
  { id: "countries", value: 40, suffix: "+", label: "Countries served" },
  { id: "parts", value: 5000, suffix: "+", label: "Parts catalogued" },
  { id: "accuracy", value: 98, suffix: "%", label: "Order accuracy" },
  {
    id: "response",
    value: 0,
    suffix: "–2h",
    label: "Avg. response time",
    displayValue: "0–2h",
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
  bullets: [
    "Original, OEM & aftermarket options",
    "Global sourcing network across 40+ countries",
    "Every part quality-checked before dispatch",
    "Dedicated account support, start to delivery",
  ],
};

export interface Certification {
  id: string;
  name: string;
  description: string;
}

// TODO: placeholder entries — replace with the company's real certificates.
export const certifications: Certification[] = [
  {
    id: "iso",
    name: "ISO 9001",
    description: "Quality management standards across sourcing and supply.",
  },
  {
    id: "origin",
    name: "Certificate of Origin",
    description: "Export documentation provided with every shipment.",
  },
  {
    id: "hs",
    name: "HS Code Compliance",
    description: "Accurate customs classification for smooth clearance.",
  },
  {
    id: "warranty",
    name: "Product Warranty",
    description: "Every part quality-checked before dispatch and backed by warranty.",
  },
];

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

export const googleRating = {
  score: 4.8,
  profileUrl: "https://share.google/Co7YIpXMTcKnRk9CT",
};

export interface Review {
  id: string;
  author: string;
  quote: string;
  quoteAr?: string;
  meta?: string;
  metaAr?: string;
}

export const reviews: Review[] = [
  {
    id: "aiteqa",
    author: "Marketing Aiteqa",
    quote:
      "Their customer service is top-notch — they truly care about treating customers right and finding real solutions. The part I needed for my MG was unavailable everywhere else, but they tracked down the exact right one for me.",
    quoteAr:
      "خدمة العملاء ممتازة للغاية — يهتمون حقاً بإيجاد الحلول المناسبة للعميل. القطعة التي كنت أبحث عنها لسيارتي إم جي لم تكن متوفرة في أي مكان آخر، ولكنهم وفروها لي بدقة وسرعة.",
    meta: "Mr. Vivek",
    metaAr: "السيد فيفيك",
  },
  {
    id: "roshan",
    author: "Roshan Mashood",
    quote:
      "Reliable supplier with a great range of high quality and durable auto parts. Their team is professional and helpful, ensuring you get the right products at good prices. Shipping is fast and efficient.",
    quoteAr:
      "مورد موثوق يقدم تشكيلة متميزة من قطع الغيار الأصلية وعالية الجودة. فريقهم محترف ومتعاون لضمان اختيار القطعة الصحيحة بأفضل الأسعار. التوصيل والشحن سريع وفعال جداً.",
  },
  {
    id: "basaweshwar",
    author: "Basaweshwar Chitwadgi",
    quote:
      "Amazing experience! Great collection and most parts are easily available. The staff is very helpful and their hospitality is excellent, good guidance, and overall a smooth experience.",
    quoteAr:
      "تجربة ممتازة! تشكيلة واسعة وأغلب قطع الغيار متوفرة للتسليم الفوري. طاقم العمل متعاون ويوفر إرشادات فنية دقيقة وتعاملاً راقياً وسلساً.",
    meta: "Local Guide",
    metaAr: "مرشد محلي",
  },
  {
    id: "salwa",
    author: "Salwa Samreen",
    quote:
      "Always get high-quality, dependable Chinese car parts here. The service is consistently professional — his expert recommendations are spot on, saving me both time and money. The best auto parts shop in UAE for Chinese vehicle spare parts!",
    quoteAr:
      "أحصل دائماً على قطع غيار موثوقة ومطابقة لأعلى المواصفات للسيارات الصينية. الخدمة احترافية وتوصياتهم الفنية توفر الكثير من الوقت والمال. أفضل متجر لقطع غيار السيارات الصينية في الإمارات!",
    meta: "Mr. Shylesh",
    metaAr: "السيد شايليش",
  },
  {
    id: "basil",
    author: "Basil Varghese",
    quote:
      "Outstanding service! Finally, a dependable source for Chinese car parts. They've got it all, from common to rare parts, and they source them quickly. Knowledgeable and friendly staff, fair prices, and top-notch quality.",
    quoteAr:
      "خدمة استثنائية! أخيراً وجدنا مصدراً موثوقاً لقطع غيار السيارات الصينية، من القطع الاستهلاكية إلى القطع النادرة وسرعة توفيرها. أسعار عادلة وجودة لا تضاهى.",
    meta: "Local Guide",
    metaAr: "مرشد محلي",
  },
  {
    id: "chris",
    author: "Chris Philip",
    quote:
      "Exceptional auto parts shop with a truly global reach! Their seamless delivery service to various parts of the world is unmatched. Top-notch products, reliable shipping, and a customer-friendly approach.",
    quoteAr:
      "متجر قطع غيار متميز يتمتع بشبكة توريد وتوصيل دولية. خدمة شحن سريعة لجميع دول الخليج والعالم مع جودة قطع عالية وتواصل ممتاز.",
  },
];

export const brandLogoDisclaimer =
  "Logos shown for parts-compatibility reference only. All trademarks are the property of their respective owners.";
