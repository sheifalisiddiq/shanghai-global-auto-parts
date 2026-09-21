import { Suspense } from "react";
import { ProductEditor } from "@/components/admin/modules/products/ProductsScreens";

export default function Page() {
  return (
    <Suspense>
      <ProductEditor />
    </Suspense>
  );
}
