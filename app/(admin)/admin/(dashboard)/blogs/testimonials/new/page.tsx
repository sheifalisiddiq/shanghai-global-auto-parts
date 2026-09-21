import { Suspense } from "react";
import { TestimonialEditor } from "@/components/admin/modules/blogs/BlogScreens";

export default function Page() {
  return (
    <Suspense>
      <TestimonialEditor />
    </Suspense>
  );
}
