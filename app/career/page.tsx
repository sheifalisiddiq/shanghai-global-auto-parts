import type { Metadata } from "next";
import { CareersContent } from "@/components/careers/CareersContent";

export const metadata: Metadata = {
  title: "Careers & Job Vacancies | Shanghai Global Auto Parts",
  description:
    "Join our team at Shanghai Global Auto Parts in sales, warehouse operations, inventory control, and GCC logistics across Jetour, Changan, Geely, Chery, Haval, BYD, and MG auto parts.",
};

export default function CareerPage() {
  return <CareersContent />;
}
