import { Suspense } from "react";
import { ProductEditor } from "@/components/admin/modules/products/ProductsScreens";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <ProductEditor id={id} />
    </Suspense>
  );
}
