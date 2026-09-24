"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import { formatCategory, formatPrice, formatRating } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";
import { ErrorState } from "@/components/ui/StateMessages";
import { ProductGallery } from "./ProductGallery";
import { ReviewList } from "./ReviewList";
import { StockBadge } from "./StockBadge";
import { ProductNotFound } from "./ProductNotFound";
import { DeleteProductDialog } from "./DeleteProductDialog";

export function ProductDetails({ id }: { id: string }) {
  const router = useRouter();
  const { state, reload } = useProduct(id);
  const deletion = useDeleteProduct(() => router.push("/products"));

  if (state.status === "loading") return <PageLoader label="Loading product…" />;
  if (state.status === "not-found") return <ProductNotFound />;
  if (state.status === "error") return <ErrorState message={state.error} onRetry={reload} />;

  const { product } = state;
  const images = product.images.length ? product.images : [product.thumbnail];

  return (
    <div className="space-y-8">
      <Link href="/products" className="text-sm font-medium text-indigo-600 hover:underline">
        ← Back to products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={images} title={product.title} />

        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500">{formatCategory(product.category)}</p>
            <h1 className="text-2xl font-semibold text-slate-900">{product.title}</h1>
            {product.brand && <p className="text-sm text-slate-500">by {product.brand}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-2xl font-bold text-slate-900">{formatPrice(product.price)}</span>
            <span className="text-amber-600">{formatRating(product.rating)}</span>
            <StockBadge stock={product.stock} />
          </div>

          <p className="leading-relaxed text-slate-700">{product.description}</p>

          <div className="flex gap-3">
            <Link
              href={`/products/${product.id}/edit`}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Edit
            </Link>
            <Button variant="danger" onClick={() => deletion.ask(product)}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      <ReviewList reviews={product.reviews ?? []} />

      <DeleteProductDialog
        product={deletion.target}
        pending={deletion.pending}
        error={deletion.error}
        onConfirm={deletion.confirm}
        onCancel={deletion.cancel}
      />
    </div>
  );
}
