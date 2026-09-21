import { Suspense } from "react";
import { ModelEditor } from "@/components/admin/modules/products/TaxonomyScreens";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <ModelEditor id={id} />
    </Suspense>
  );
}
