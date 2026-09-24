import Link from "next/link";
import { Suspense } from "react";
import { ProductListView } from "@/components/products/ProductListView";
import { PageLoader } from "@/components/ui/Spinner";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
        <Link
          href="/products/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Add product
        </Link>
      </div>
      {/* useSearchParams() needs a Suspense boundary in the App Router. */}
      <Suspense fallback={<PageLoader />}>
        <ProductListView />
      </Suspense>
    </div>
  );
}
