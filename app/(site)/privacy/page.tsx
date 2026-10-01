import type { Metadata } from "next";
import { PrivacyContent } from "@/components/pages/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Shanghai Global Auto Parts LLC — how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyContent />;
}
