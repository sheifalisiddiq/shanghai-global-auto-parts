import type { ProductCategory } from "./categories";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  compatibleBrandIds: string[];
  shortSpec: string;
  image: { src: string; alt: string };
  featured?: boolean;
}

export const products: Product[] = [
  // Brakes
  {
    id: "brk-001",
    slug: "ceramic-front-brake-pad-set",
    name: "Ceramic Front Brake Pad Set",
    category: "brakes",
    compatibleBrandIds: ["chery", "mg", "geely"],
    shortSpec: "Front axle, ceramic compound, OE fitment",
    image: { src: "/images/products/brakes/1.jpg", alt: "Ceramic front brake pad set" },
    featured: true,
  },
  {
    id: "brk-002",
    slug: "ventilated-front-brake-disc",
    name: "Ventilated Front Brake Disc",
    category: "brakes",
    compatibleBrandIds: ["changan", "baic", "jac"],
    shortSpec: "320mm ventilated rotor, direct replacement",
    image: { src: "/images/products/brakes/2.jpg", alt: "Ventilated front brake disc" },
  },
  {
    id: "brk-003",
    slug: "rear-brake-caliper-assembly",
    name: "Rear Brake Caliper Assembly",
    category: "brakes",
    compatibleBrandIds: ["haval", "gwm"],
    shortSpec: "Remanufactured caliper, includes mounting hardware",
    image: { src: "/images/products/brakes/3.jpg", alt: "Rear brake caliper assembly" },
  },

  // Filters
  {
    id: "flt-001",
    slug: "engine-oil-filter",
    name: "Engine Oil Filter",
    category: "filters",
    compatibleBrandIds: ["chery", "jetour", "omoda"],
    shortSpec: "Spin-on filter, high-flow media",
    image: { src: "/images/products/filters/1.jpg", alt: "Engine oil filter" },
    featured: true,
  },
  {
    id: "flt-002",
    slug: "cabin-air-filter",
    name: "Cabin Air Filter",
    category: "filters",
    compatibleBrandIds: ["mg", "geely", "byd"],
    shortSpec: "Activated carbon, dust and pollen filtration",
    image: { src: "/images/products/filters/2.jpg", alt: "Cabin air filter" },
  },
  {
    id: "flt-003",
    slug: "fuel-filter-element",
    name: "Fuel Filter Element",
    category: "filters",
    compatibleBrandIds: ["changan", "jac"],
    shortSpec: "In-line filter, water-separating",
    image: { src: "/images/products/filters/3.jpg", alt: "Fuel filter element" },
  },

  // Engine
  {
    id: "eng-001",
    slug: "timing-belt-kit",
    name: "Timing Belt Kit",
    category: "engine",
    compatibleBrandIds: ["chery", "jetour"],
    shortSpec: "Belt, tensioner and idler pulley kit",
    image: { src: "/images/products/engine/1.jpg", alt: "Timing belt kit" },
  },
  {
    id: "eng-002",
    slug: "water-pump-assembly",
    name: "Water Pump Assembly",
    category: "engine",
    compatibleBrandIds: ["geely", "mg"],
    shortSpec: "OE-spec impeller, gasket included",
    image: { src: "/images/products/engine/2.jpg", alt: "Engine water pump assembly" },
    featured: true,
  },
  {
    id: "eng-003",
    slug: "oxygen-sensor",
    name: "Oxygen Sensor",
    category: "engine",
    compatibleBrandIds: ["baic", "changan", "haval"],
    shortSpec: "Direct-fit upstream O2 sensor",
    image: { src: "/images/products/engine/3.jpg", alt: "Oxygen sensor" },
  },

  // Suspension
  {
    id: "sus-001",
    slug: "front-shock-absorber",
    name: "Front Shock Absorber",
    category: "suspension",
    compatibleBrandIds: ["byd", "mg"],
    shortSpec: "Gas-charged strut, front left/right pair",
    image: { src: "/images/products/suspension/1.jpg", alt: "Front shock absorber" },
  },
  {
    id: "sus-002",
    slug: "control-arm-with-ball-joint",
    name: "Control Arm with Ball Joint",
    category: "suspension",
    compatibleBrandIds: ["chery", "jac"],
    shortSpec: "Lower control arm, pre-assembled bushings",
    image: { src: "/images/products/suspension/2.jpg", alt: "Control arm with ball joint" },
    featured: true,
  },
  {
    id: "sus-003",
    slug: "steering-tie-rod-end",
    name: "Steering Tie Rod End",
    category: "suspension",
    compatibleBrandIds: ["geely", "venucia"],
    shortSpec: "Direct-fit tie rod, greaseable joint",
    image: { src: "/images/products/suspension/3.jpg", alt: "Steering tie rod end" },
  },

  // Electrical
  {
    id: "elc-001",
    slug: "ignition-coil-pack",
    name: "Ignition Coil Pack",
    category: "electrical",
    compatibleBrandIds: ["changan", "baic"],
    shortSpec: "High-output coil, direct OE replacement",
    image: { src: "/images/products/electrical/1.jpg", alt: "Ignition coil pack" },
  },
  {
    id: "elc-002",
    slug: "headlight-assembly",
    name: "Headlight Assembly",
    category: "electrical",
    compatibleBrandIds: ["haval", "gwm", "jetour"],
    shortSpec: "LED projector unit, plug-and-play",
    image: { src: "/images/products/electrical/2.jpg", alt: "LED headlight assembly" },
    featured: true,
  },
  {
    id: "elc-003",
    slug: "abs-wheel-speed-sensor",
    name: "ABS Wheel Speed Sensor",
    category: "electrical",
    compatibleBrandIds: ["mg", "chery"],
    shortSpec: "Direct-fit sensor with wiring harness",
    image: { src: "/images/products/electrical/3.jpg", alt: "ABS wheel speed sensor" },
  },

  // Body & Accessories
  {
    id: "bdy-001",
    slug: "front-bumper-cover",
    name: "Front Bumper Cover",
    category: "body-accessories",
    compatibleBrandIds: ["geely", "byd"],
    shortSpec: "Primed, ready-to-paint OE-fit bumper",
    image: { src: "/images/products/body-accessories/1.jpg", alt: "Front bumper cover" },
  },
  {
    id: "bdy-002",
    slug: "side-mirror-assembly",
    name: "Side Mirror Assembly",
    category: "body-accessories",
    compatibleBrandIds: ["jac", "venucia"],
    shortSpec: "Power-fold, heated glass, direct fit",
    image: { src: "/images/products/body-accessories/2.jpg", alt: "Side mirror assembly" },
  },
  {
    id: "bdy-003",
    slug: "door-handle-set",
    name: "Door Handle Set",
    category: "body-accessories",
    compatibleBrandIds: ["changan", "omoda"],
    shortSpec: "Exterior handle set, matched finish",
    image: { src: "/images/products/body-accessories/3.jpg", alt: "Exterior door handle set" },
    featured: true,
  },

  // Transmission
  {
    id: "trn-001",
    slug: "clutch-kit",
    name: "Clutch Kit",
    category: "transmission",
    compatibleBrandIds: ["chery", "jetour"],
    shortSpec: "Clutch disc, pressure plate and bearing",
    image: { src: "/images/products/transmission/1.jpg", alt: "Clutch kit" },
  },
  {
    id: "trn-002",
    slug: "cv-axle-assembly",
    name: "CV Axle Assembly",
    category: "transmission",
    compatibleBrandIds: ["mg", "geely"],
    shortSpec: "Complete axle, both joints pre-greased",
    image: { src: "/images/products/transmission/2.jpg", alt: "CV axle assembly" },
    featured: true,
  },
  {
    id: "trn-003",
    slug: "transmission-mount",
    name: "Transmission Mount",
    category: "transmission",
    compatibleBrandIds: ["baic", "changan"],
    shortSpec: "OE-spec rubber isolator mount",
    image: { src: "/images/products/transmission/3.jpg", alt: "Transmission mount" },
  },

  // Cooling
  {
    id: "col-001",
    slug: "aluminum-radiator",
    name: "Aluminum Radiator",
    category: "cooling",
    compatibleBrandIds: ["haval", "gwm", "jetour"],
    shortSpec: "Direct-fit core, high-flow cooling",
    image: { src: "/images/products/cooling/1.jpg", alt: "Aluminum radiator" },
    featured: true,
  },
  {
    id: "col-002",
    slug: "radiator-cooling-fan",
    name: "Radiator Cooling Fan",
    category: "cooling",
    compatibleBrandIds: ["byd", "mg"],
    shortSpec: "Electric fan assembly, OE connector",
    image: { src: "/images/products/cooling/2.jpg", alt: "Radiator cooling fan" },
  },
  {
    id: "col-003",
    slug: "coolant-hose-kit",
    name: "Coolant Hose Kit",
    category: "cooling",
    compatibleBrandIds: ["chery", "jac"],
    shortSpec: "Upper and lower hose set, OE routing",
    image: { src: "/images/products/cooling/3.jpg", alt: "Coolant hose kit" },
  },
];

export const featuredProducts = products.filter((p) => p.featured);
