// Raw product endpoints. No UI logic and no local-change merging here —
// see lib/products/productService.ts for that.

import { api } from "./client";
import type {
  Category,
  Product,
  ProductInput,
  ProductListResponse,
  SortField,
  SortOrder,
} from "@/types/product";

export interface FetchProductsParams {
  limit: number;
  skip: number;
  q?: string;
  category?: string;
  sortBy?: SortField | "";
  order?: SortOrder;
  delay?: number;
  /** Comma-separated fields to return, e.g. "id". */
  select?: string;
  signal?: AbortSignal;
}

/**
 * Picks the right endpoint. The API has three separate list endpoints and
 * cannot combine search with a category, so only one of q / category is used.
 */
export async function fetchProducts({
  limit,
  skip,
  q,
  category,
  sortBy,
  order,
  delay,
  select,
  signal,
}: FetchProductsParams): Promise<ProductListResponse> {
  let url = "/products";
  const params: Record<string, string | number> = { limit, skip };

  if (q) {
    url = "/products/search";
    params.q = q;
  } else if (category) {
    url = `/products/category/${encodeURIComponent(category)}`;
  }

  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order ?? "asc";
  }
  if (delay) params.delay = delay;
  if (select) params.select = select;

  const { data } = await api.get<ProductListResponse>(url, { params, signal });
  return data;
}

export async function fetchProduct(id: number, signal?: AbortSignal): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`, { signal });
  return data;
}

export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/products/categories", { signal });
  return data.map(({ slug, name }) => ({ slug, name }));
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data } = await api.post<Product>("/products/add", input);
  return data;
}

export async function updateProduct(id: number, input: Partial<ProductInput>): Promise<Product> {
  const { data } = await api.put<Product>(`/products/${id}`, input);
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}
