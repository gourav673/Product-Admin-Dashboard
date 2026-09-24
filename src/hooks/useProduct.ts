"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, getErrorMessage, isCanceled } from "@/lib/api/client";
import { getProduct } from "@/lib/products/productService";
import type { Product } from "@/types/product";

type State =
  | { status: "loading" }
  | { status: "success"; product: Product }
  | { status: "not-found" }
  | { status: "error"; error: string };

/** Loads one product. `rawId` comes straight from the URL, so it may be junk like "abc". */
export function useProduct(rawId: string) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    // Only plain positive whole numbers are valid ids.
    const id = /^\d+$/.test(rawId) ? Number(rawId) : NaN;
    const controller = new AbortController();
    setState({ status: "loading" });

    getProduct(id, controller.signal)
      .then((product) => setState({ status: "success", product }))
      .catch((error: unknown) => {
        if (isCanceled(error)) return;
        if (error instanceof ApiError && error.status === 404) setState({ status: "not-found" });
        else setState({ status: "error", error: getErrorMessage(error) });
      });

    return () => controller.abort();
  }, [rawId, reloadCount]);

  const reload = useCallback(() => setReloadCount((n) => n + 1), []);

  return { state, reload };
}
