import { Suspense } from "react";
import { BrandEditor } from "@/components/admin/modules/products/TaxonomyScreens";

export default function Page() {
  return (
    <Suspense>
      <BrandEditor />
    </Suspense>
  );
}
