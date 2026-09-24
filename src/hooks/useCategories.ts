"use client";

import { useEffect, useState } from "react";
import { fetchCategories } from "@/lib/api/products";
import { isCanceled } from "@/lib/api/client";
import type { Category } from "@/types/product";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal)
      .then(setCategories)
      .catch((error: unknown) => {
        if (!isCanceled(error)) setFailed(true);
      });
    return () => controller.abort();
  }, []);

  return { categories, failed };
}
