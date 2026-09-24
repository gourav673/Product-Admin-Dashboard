"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProductQuery } from "@/hooks/useProductQuery";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import { buildQueryString } from "@/lib/products/queryParams";
import { getRangeText, getTotalPages } from "@/lib/products/pagination";
import { PageLoader } from "@/components/ui/Spinner";
import { EmptyState, ErrorState } from "@/components/ui/StateMessages";
import { ProductFilters } from "./ProductFilters";
import { ProductTable } from "./ProductTable";
import { ProductCards } from "./ProductCards";
import { Pagination } from "./Pagination";
import { DeleteProductDialog } from "./DeleteProductDialog";

export function ProductListView() {
  const router = useRouter();
  const { query, updateQuery, rawQueryString } = useProductQuery();
  const { status, data, error, reload } = useProducts(query);
  const { categories } = useCategories();
  const deletion = useDeleteProduct(reload);

  // Clean up bad URL values (e.g. ?page=abc or ?limit=7) so the address bar
  // matches what is shown.
  useEffect(() => {
    const canonical = buildQueryString(query);
    const current = new URLSearchParams(rawQueryString);
    current.sort();
    const expected = new URLSearchParams(canonical);
    expected.sort();
    if (current.toString() !== expected.toString()) {
      router.replace(canonical ? `/products?${canonical}` : "/products", { scroll: false });
    }
  }, [query, rawQueryString, router]);

  // A page past the end (e.g. ?page=999) jumps to the last page that exists.
  const totalPages = data ? getTotalPages(data.total, query.limit) : 1;
  useEffect(() => {
    if (status === "success" && query.page > totalPages) {
      updateQuery({ page: totalPages }, { replace: true });
    }
  }, [status, query.page, totalPages, updateQuery]);

  const hasFilters = Boolean(query.q || query.category);

  const renderContent = () => {
    if (status === "error") return <ErrorState message={error} onRetry={reload} />;
    if (status === "loading" || !data || query.page > totalPages) return <PageLoader label="Loading products…" />;
    if (data.products.length === 0) {
      return (
        <EmptyState title="No products found">
          {hasFilters ? (
            <button
              type="button"
              className="font-medium text-indigo-600 hover:underline"
              onClick={() => updateQuery({ q: "", category: "" })}
            >
              Clear search and filters
            </button>
          ) : (
            "There are no products yet."
          )}
        </EmptyState>
      );
    }
    return (
      <>
        <ProductTable products={data.products} onDelete={deletion.ask} />
        <ProductCards products={data.products} onDelete={deletion.ask} />
      </>
    );
  };

  return (
    <div className="space-y-5">
      <ProductFilters query={query} categories={categories} onChange={updateQuery} />

      {renderContent()}

      {data && data.total > 0 && status !== "error" && (
        <Pagination
          page={Math.min(query.page, totalPages)}
          totalPages={totalPages}
          limit={query.limit}
          rangeText={getRangeText(query.page, query.limit, data.products.length, data.total)}
          onPageChange={(page) => updateQuery({ page })}
          onLimitChange={(limit) => updateQuery({ limit })}
        />
      )}

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
