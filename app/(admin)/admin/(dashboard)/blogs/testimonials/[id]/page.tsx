import { Suspense } from "react";
import { TestimonialEditor } from "@/components/admin/modules/blogs/BlogScreens";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <TestimonialEditor id={id} />
    </Suspense>
  );
}
