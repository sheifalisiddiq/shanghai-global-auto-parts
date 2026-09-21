import type { Metadata } from "next";
import { BlogsContent } from "@/components/blogs/BlogsContent";

export const metadata: Metadata = {
  title: "Auto Parts Blogs & Guides | Shanghai Global Auto Parts",
  description:
    "Explore technical guides, VIN identification protocols, Original vs OEM spare parts comparisons, and GCC auto parts supply chain insights.",
};

export default function BlogsPage() {
  return <BlogsContent />;
}
