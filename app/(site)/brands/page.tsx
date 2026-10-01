import type { Metadata } from "next";
import { BrandsContent } from "@/components/pages/BrandsContent";

export const metadata: Metadata = {
  title: "Supported Vehicle Brands & Models — Chinese Auto Spare Parts",
  description:
    "Comprehensive catalog of supported Chinese vehicle brands including Jetour, Changan, Geely, Chery, BYD, Haval, MG, BAIC, and more. Original and OEM parts with express GCC delivery.",
};

export default function BrandsPage() {
  return <BrandsContent />;
}
