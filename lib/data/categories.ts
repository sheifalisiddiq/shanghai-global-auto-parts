export type ProductCategory =
  | "brakes"
  | "filters"
  | "engine"
  | "suspension"
  | "electrical"
  | "body-accessories"
  | "transmission"
  | "cooling";

export interface CategoryMeta {
  id: ProductCategory;
  label: string;
  labelAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  image: { src: string; alt: string; altAr: string };
}

export const categories: CategoryMeta[] = [
  {
    id: "brakes",
    label: "Brakes",
    labelAr: "الفرامل",
    description: "Pads, discs, calipers and full brake assemblies.",
    descriptionAr: "أقراص وبطانات وملاقط وأنظمة فرامل كاملة.",
    icon: "Disc3",
    image: { src: "/images/products/brakes/category.jpg", alt: "Chinese-vehicle brake disc and pad set", altAr: "طقم أقراص وبطانات فرامل لسيارة صينية" },
  },
  {
    id: "filters",
    label: "Filters",
    labelAr: "الفلاتر",
    description: "Oil, air, cabin and fuel filtration.",
    descriptionAr: "فلاتر الزيت والهواء والمقصورة والوقود.",
    icon: "Filter",
    image: { src: "/images/products/filters/category.jpg", alt: "Automotive oil and air filters", altAr: "فلاتر زيت وهواء للسيارات" },
  },
  {
    id: "engine",
    label: "Engine Components",
    labelAr: "مكونات المحرك",
    description: "Gaskets, sensors, pumps and internal parts.",
    descriptionAr: "جوانات وحساسات ومضخات وأجزاء داخلية.",
    icon: "Cog",
    image: { src: "/images/products/engine/category.jpg", alt: "Engine component parts on a studio background", altAr: "قطع مكونات المحرك على خلفية استوديو" },
  },
  {
    id: "suspension",
    label: "Suspension & Steering",
    labelAr: "نظام التعليق والتوجيه",
    description: "Shocks, struts, control arms and steering parts.",
    descriptionAr: "ممتصات صدمات وأذرع تحكم وقطع التوجيه.",
    icon: "Waypoints",
    image: { src: "/images/products/suspension/category.jpg", alt: "Suspension strut and control arm", altAr: "ممتص صدمات وذراع تحكم" },
  },
  {
    id: "electrical",
    label: "Electrical & Lighting",
    labelAr: "الكهرباء والإنارة",
    description: "Sensors, harnesses, lighting and switches.",
    descriptionAr: "حساسات وأسلاك ومصابيح ومفاتيح.",
    icon: "Zap",
    image: { src: "/images/products/electrical/category.jpg", alt: "Automotive electrical connector and lighting parts", altAr: "موصل كهربائي وقطع إنارة للسيارات" },
  },
  {
    id: "body-accessories",
    label: "Body & Accessories",
    labelAr: "الهيكل والإكسسوارات",
    description: "Mirrors, bumpers, trim and body hardware.",
    descriptionAr: "مرايا وصدادات وزينة وقطع هيكل.",
    icon: "CarFront",
    image: { src: "/images/products/body-accessories/category.jpg", alt: "Vehicle body panel and accessory parts", altAr: "قطع هيكل وإكسسوارات السيارة" },
  },
  {
    id: "transmission",
    label: "Transmission & Drivetrain",
    labelAr: "ناقل الحركة ونظام الدفع",
    description: "Clutches, CV joints and drivetrain components.",
    descriptionAr: "أقراص قابض ومفاصل CV وقطع نظام الدفع.",
    icon: "Settings2",
    image: { src: "/images/products/transmission/category.jpg", alt: "Transmission and drivetrain components", altAr: "قطع ناقل الحركة ونظام الدفع" },
  },
  {
    id: "cooling",
    label: "Cooling System",
    labelAr: "نظام التبريد",
    description: "Radiators, hoses, pumps and thermostats.",
    descriptionAr: "رادياتيرات وخراطيم ومضخات وثرموستات.",
    icon: "Thermometer",
    image: { src: "/images/products/cooling/category.jpg", alt: "Radiator and cooling system parts", altAr: "قطع الرادياتير ونظام التبريد" },
  },
];
