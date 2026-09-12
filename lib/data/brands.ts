export interface CarBrand {
  id: string;
  name: string;
  logo: { src: string; alt: string } | null;
}

export const carBrands: CarBrand[] = [
  { id: "changan", name: "Changan", logo: { src: "/logos/changan.svg", alt: "Changan logo" } },
  { id: "baic", name: "BAIC", logo: { src: "/logos/baic.png", alt: "BAIC logo" } },
  { id: "jac", name: "JAC", logo: { src: "/logos/jac.png", alt: "JAC Motors logo" } },
  { id: "chery", name: "Chery", logo: { src: "/logos/chery.svg", alt: "Chery logo" } },
  { id: "jetour", name: "Jetour", logo: { src: "/logos/jetour.svg", alt: "Jetour logo" } },
  { id: "byd", name: "BYD", logo: { src: "/logos/byd.svg", alt: "BYD logo" } },
  { id: "mg", name: "MG", logo: { src: "/logos/mg.svg", alt: "MG Motor logo" } },
  { id: "geely", name: "Geely", logo: { src: "/logos/geely.svg", alt: "Geely logo" } },
  { id: "ldv", name: "LDV (Maxus)", logo: { src: "/logos/ldv.svg", alt: "LDV Maxus logo" } },
  { id: "venucia", name: "Venucia", logo: null },
  { id: "haval", name: "Haval", logo: { src: "/logos/haval.svg", alt: "Haval logo" } },
  { id: "gwm", name: "GWM", logo: { src: "/logos/gwm.svg", alt: "GWM Great Wall Motors logo" } },
  { id: "nio", name: "NIO", logo: { src: "/logos/nio.svg", alt: "NIO logo" } },
  { id: "omoda", name: "Omoda", logo: { src: "/logos/omoda.svg", alt: "Omoda logo" } },
];
