import { Suspense } from "react";
import { JobEditor } from "@/components/admin/modules/careers/CareerScreens";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <JobEditor id={id} />
    </Suspense>
  );
}
