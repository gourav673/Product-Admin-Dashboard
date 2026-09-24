"use client";

import { useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { editProduct } from "@/lib/products/productService";
import { productToFormValues } from "@/lib/products/validation";
import { PageLoader } from "@/components/ui/Spinner";
import { ErrorState } from "@/components/ui/StateMessages";
import type { ProductInput } from "@/types/product";
import { ProductForm } from "./ProductForm";
import { ProductNotFound } from "./ProductNotFound";

export function EditProduct({ id }: { id: string }) {
  const router = useRouter();
  const { state, reload } = useProduct(id);

  if (state.status === "loading") return <PageLoader label="Loading product…" />;
  if (state.status === "not-found") return <ProductNotFound />;
  if (state.status === "error") return <ErrorState message={state.error} onRetry={reload} />;

  const { product } = state;

  const handleSubmit = async (input: ProductInput) => {
    await editProduct(product, input);
    router.push(`/products/${product.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Edit product</h1>
      <ProductForm
        initialValues={productToFormValues(product)}
        submitLabel="Save changes"
        cancelHref={`/products/${product.id}`}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
