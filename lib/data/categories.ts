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
  description: string;
  icon: string;
  image: { src: string; alt: string };
}

export const categories: CategoryMeta[] = [
  {
    id: "brakes",
    label: "Brakes",
    description: "Pads, discs, calipers and full brake assemblies.",
    icon: "Disc3",
    image: { src: "/images/products/brakes/category.jpg", alt: "Chinese-vehicle brake disc and pad set" },
  },
  {
    id: "filters",
    label: "Filters",
    description: "Oil, air, cabin and fuel filtration.",
    icon: "Filter",
    image: { src: "/images/products/filters/category.jpg", alt: "Automotive oil and air filters" },
  },
  {
    id: "engine",
    label: "Engine Components",
    description: "Gaskets, sensors, pumps and internal parts.",
    icon: "Cog",
    image: { src: "/images/products/engine/category.jpg", alt: "Engine component parts on a studio background" },
  },
  {
    id: "suspension",
    label: "Suspension & Steering",
    description: "Shocks, struts, control arms and steering parts.",
    icon: "Waypoints",
    image: { src: "/images/products/suspension/category.jpg", alt: "Suspension strut and control arm" },
  },
  {
    id: "electrical",
    label: "Electrical & Lighting",
    description: "Sensors, harnesses, lighting and switches.",
    icon: "Zap",
    image: { src: "/images/products/electrical/category.jpg", alt: "Automotive electrical connector and lighting parts" },
  },
  {
    id: "body-accessories",
    label: "Body & Accessories",
    description: "Mirrors, bumpers, trim and body hardware.",
    icon: "CarFront",
    image: { src: "/images/products/body-accessories/category.jpg", alt: "Vehicle body panel and accessory parts" },
  },
  {
    id: "transmission",
    label: "Transmission & Drivetrain",
    description: "Clutches, CV joints and drivetrain components.",
    icon: "Settings2",
    image: { src: "/images/products/transmission/category.jpg", alt: "Transmission and drivetrain components" },
  },
  {
    id: "cooling",
    label: "Cooling System",
    description: "Radiators, hoses, pumps and thermostats.",
    icon: "Thermometer",
    image: { src: "/images/products/cooling/category.jpg", alt: "Radiator and cooling system parts" },
  },
];
