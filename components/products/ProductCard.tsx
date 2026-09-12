import Image from "next/image";
import type { Product } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { carBrands } from "@/lib/data/brands";

export function ProductCard({ product }: { product: Product }) {
  const category = categories.find((c) => c.id === product.category);
  const brands = product.compatibleBrandIds
    .map((id) => carBrands.find((b) => b.id === id)?.name)
    .filter(Boolean);

  return (
    <article className="group border-steel-light relative flex h-full flex-col overflow-hidden border bg-white">
      <div className="bg-paper relative aspect-square overflow-hidden">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {category && (
          <span className="font-ui bg-ink absolute top-3 left-3 px-2.5 py-1 text-[10px] tracking-wide text-white uppercase">
            {category.label}
          </span>
        )}

        <div className="bg-ink/95 absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
          <p className="text-xs text-white/80">{product.shortSpec}</p>
          {brands.length > 0 && (
            <p className="font-ui mt-2 text-[10px] tracking-wide text-white/50 uppercase">
              Fits: {brands.join(", ")}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-ui text-ink text-sm tracking-wide uppercase">{product.name}</h3>
        <p className="text-steel-dark mt-1 text-xs">{product.shortSpec}</p>
      </div>
    </article>
  );
}
