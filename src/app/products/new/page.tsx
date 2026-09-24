"use client";

import { useRouter } from "next/navigation";
import { addProduct } from "@/lib/products/productService";
import { ProductForm } from "@/components/products/ProductForm";
import type { ProductInput } from "@/types/product";

export default function NewProductPage() {
  const router = useRouter();

  const handleSubmit = async (input: ProductInput) => {
    const product = await addProduct(input);
    router.push(`/products/${product.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Add product</h1>
      <ProductForm submitLabel="Add product" cancelHref="/products" onSubmit={handleSubmit} />
    </div>
  );
}
