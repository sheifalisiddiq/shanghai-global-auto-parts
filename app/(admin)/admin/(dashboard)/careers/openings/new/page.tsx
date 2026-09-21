import { Suspense } from "react";
import { JobEditor } from "@/components/admin/modules/careers/CareerScreens";

export default function Page() {
  return (
    <Suspense>
      <JobEditor />
    </Suspense>
  );
}
