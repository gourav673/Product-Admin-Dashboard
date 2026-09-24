"use client";

import { useCallback, useState } from "react";
import { getErrorMessage } from "@/lib/api/client";
import { removeProduct } from "@/lib/products/productService";
import type { Product } from "@/types/product";
import { useSingleFlight } from "./useSingleFlight";

/** State for the "are you sure?" popup: which product, loading and error. */
export function useDeleteProduct(onDeleted: (product: Product) => void) {
  const [target, setTarget] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { run: confirm, pending } = useSingleFlight(async () => {
    if (!target) return;
    setError(null);
    try {
      await removeProduct(target);
      setTarget(null);
      onDeleted(target);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  });

  const ask = useCallback((product: Product) => {
    setError(null);
    setTarget(product);
  }, []);

  const cancel = useCallback(() => setTarget(null), []);

  return { target, error, pending, ask, cancel, confirm };
}
