// Reads and writes the list state (page, search, filter, sort) in the URL.
// Any bad value (?page=abc, ?limit=7, ?sortBy=hack) falls back to a safe default.

import type { ProductQuery, SortField, SortOrder } from "@/types/product";

export const PAGE_SIZES = [10, 20, 50] as const;
export const SORT_FIELDS: SortField[] = ["price", "rating", "title"];
const MAX_PAGE = 100000;
const MAX_DELAY = 5000;

export const DEFAULT_QUERY: ProductQuery = {
  page: 1,
  limit: 10,
  q: "",
  category: "",
  sortBy: "",
  order: "asc",
  delay: 0,
};

interface ParamReader {
  get(name: string): string | null;
}

function parsePositiveInt(value: string | null, fallback: number, max: number): number {
  if (!value || !/^\d+$/.test(value)) return fallback;
  const n = Number(value);
  return n >= 1 && n <= max ? n : fallback;
}

export function parseProductQuery(params: ParamReader): ProductQuery {
  const limitRaw = Number(params.get("limit"));
  const limit = (PAGE_SIZES as readonly number[]).includes(limitRaw) ? limitRaw : DEFAULT_QUERY.limit;

  const sortRaw = params.get("sortBy") ?? "";
  const sortBy = (SORT_FIELDS as string[]).includes(sortRaw) ? (sortRaw as SortField) : "";
  const order: SortOrder = params.get("order") === "desc" ? "desc" : "asc";

  const q = (params.get("q") ?? "").trim().slice(0, 100);
  const categoryRaw = (params.get("category") ?? "").trim();
  const category = /^[a-z0-9-]{1,50}$/.test(categoryRaw) ? categoryRaw : "";

  return {
    page: parsePositiveInt(params.get("page"), 1, MAX_PAGE),
    limit,
    q,
    // The API cannot search inside a category, so search wins if both are given.
    category: q ? "" : category,
    sortBy,
    order: sortBy ? order : "asc",
    delay: Math.min(parsePositiveInt(params.get("delay"), 0, Number.MAX_SAFE_INTEGER), MAX_DELAY),
  };
}

/** Builds the query string, leaving out defaults so URLs stay short. */
export function buildQueryString(query: ProductQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.sortBy) {
    params.set("sortBy", query.sortBy);
    params.set("order", query.order);
  }
  if (query.limit !== DEFAULT_QUERY.limit) params.set("limit", String(query.limit));
  if (query.page !== 1) params.set("page", String(query.page));
  if (query.delay) params.set("delay", String(query.delay));
  return params.toString();
}
