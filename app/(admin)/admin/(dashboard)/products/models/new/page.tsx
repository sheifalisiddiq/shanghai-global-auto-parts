import { Suspense } from "react";
import { ModelEditor } from "@/components/admin/modules/products/TaxonomyScreens";

export default function Page() {
  return (
    <Suspense>
      <ModelEditor />
    </Suspense>
  );
}
