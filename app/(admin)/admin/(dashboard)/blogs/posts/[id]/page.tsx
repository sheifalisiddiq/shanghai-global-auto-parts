import { Suspense } from "react";
import { PostEditor } from "@/components/admin/modules/blogs/BlogScreens";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <PostEditor id={id} />
    </Suspense>
  );
}
