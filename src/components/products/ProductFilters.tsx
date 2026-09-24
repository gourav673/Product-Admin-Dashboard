"use client";

import type { Category, ProductQuery, SortField, SortOrder } from "@/types/product";
import { SearchInput } from "./SearchInput";

const selectClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Default order" },
  { value: "price:asc", label: "Price: low to high" },
  { value: "price:desc", label: "Price: high to low" },
  { value: "rating:desc", label: "Rating: high to low" },
  { value: "rating:asc", label: "Rating: low to high" },
  { value: "title:asc", label: "Title: A–Z" },
  { value: "title:desc", label: "Title: Z–A" },
];

interface ProductFiltersProps {
  query: ProductQuery;
  categories: Category[];
  onChange: (patch: Partial<ProductQuery>, options?: { replace?: boolean }) => void;
}

export function ProductFilters({ query, categories, onChange }: ProductFiltersProps) {
  const sortValue = query.sortBy ? `${query.sortBy}:${query.order}` : "";

  const handleSortChange = (value: string) => {
    const [sortBy = "", order = "asc"] = value.split(":");
    onChange({ sortBy: sortBy as SortField | "", order: order as SortOrder });
  };

  return (
    <div className="space-y-2">
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
        {/* Search and category are exclusive: the API cannot do both at once. */}
        <SearchInput value={query.q} onSearch={(q) => onChange({ q, category: "" }, { replace: true })} />

        <div>
          <label htmlFor="category" className="sr-only">
            Category
          </label>
          <select
            id="category"
            value={query.category}
            onChange={(e) => onChange({ category: e.target.value, q: "" })}
            className={selectClass}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sort" className="sr-only">
            Sort by
          </label>
          <select id="sort" value={sortValue} onChange={(e) => handleSortChange(e.target.value)} className={selectClass}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Search looks across all categories. Choosing a category clears the search, and typing a search clears the
        category.
      </p>
    </div>
  );
}
