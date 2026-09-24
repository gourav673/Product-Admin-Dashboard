"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildQueryString, parseProductQuery } from "@/lib/products/queryParams";
import type { ProductQuery } from "@/types/product";

/**
 * The URL is the single source of truth for page, search, filter and sort.
 * Changing anything except the page sends the user back to page 1.
 */
export function useProductQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo(() => parseProductQuery(searchParams), [searchParams]);

  const updateQuery = useCallback(
    (patch: Partial<ProductQuery>, options: { replace?: boolean } = {}) => {
      const next: ProductQuery = { ...query, ...patch };
      if (!("page" in patch)) next.page = 1;

      const qs = buildQueryString(next);
      const url = qs ? `${pathname}?${qs}` : pathname;
      if (options.replace) router.replace(url, { scroll: false });
      else router.push(url, { scroll: false });
    },
    [query, pathname, router],
  );

  return { query, updateQuery, rawQueryString: searchParams.toString() };
}
