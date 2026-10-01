import type { Metadata } from "next";
import { TermsContent } from "@/components/pages/TermsContent";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms & Conditions for using the Shanghai Global Auto Parts LLC website and services.",
};

export default function TermsPage() {
  return <TermsContent />;
}
