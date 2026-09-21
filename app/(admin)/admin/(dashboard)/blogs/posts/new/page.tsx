import { Suspense } from "react";
import { PostEditor } from "@/components/admin/modules/blogs/BlogScreens";

export default function Page() {
  return (
    <Suspense>
      <PostEditor />
    </Suspense>
  );
}
