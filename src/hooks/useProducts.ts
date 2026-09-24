"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage, isCanceled } from "@/lib/api/client";
import { listProducts } from "@/lib/products/productService";
import type { ProductListResponse, ProductQuery } from "@/types/product";

type State =
  | { status: "loading"; data: ProductListResponse | null; error: null }
  | { status: "success"; data: ProductListResponse; error: null }
  | { status: "error"; data: ProductListResponse | null; error: string };

/**
 * Loads one page of products for `query`.
 *
 * Old responses can never overwrite newer ones, for two reasons:
 * 1. When the query changes, the previous request is aborted (AbortController).
 * 2. Every request gets an id; a response is ignored unless it belongs to the
 *    latest request (in case it had already arrived before the abort).
 */
export function useProducts(query: ProductQuery) {
  const [state, setState] = useState<State>({ status: "loading", data: null, error: null });
  const [reloadCount, setReloadCount] = useState(0);
  const latestRequestId = useRef(0);

  // A stable string, so the effect only re-runs when a value really changes.
  const queryKey = JSON.stringify(query);

  useEffect(() => {
    const currentQuery = JSON.parse(queryKey) as ProductQuery;
    const requestId = ++latestRequestId.current;
    const controller = new AbortController();

    setState((prev) => ({ status: "loading", data: prev.data, error: null }));

    listProducts(currentQuery, controller.signal)
      .then((data) => {
        if (requestId !== latestRequestId.current) return;
        setState({ status: "success", data, error: null });
      })
      .catch((error: unknown) => {
        if (isCanceled(error) || requestId !== latestRequestId.current) return;
        setState((prev) => ({ status: "error", data: prev.data, error: getErrorMessage(error) }));
      });

    return () => controller.abort();
  }, [queryKey, reloadCount]);

  const reload = useCallback(() => setReloadCount((n) => n + 1), []);

  return { ...state, reload };
}
