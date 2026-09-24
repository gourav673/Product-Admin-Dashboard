import { getPageItems } from "@/lib/products/pagination";
import { PAGE_SIZES } from "@/lib/products/queryParams";

interface PaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  rangeText: string;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const pageButton =
  "min-w-9 rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50";

export function Pagination({ page, totalPages, limit, rangeText, onPageChange, onLimitChange }: PaginationProps) {
  const items = getPageItems(page, totalPages);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <span aria-live="polite">{rangeText}</span>
        <label className="flex items-center gap-2">
          <span>Per page</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          className={`${pageButton} border-slate-300 bg-white`}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        {items.map((item) =>
          typeof item === "number" ? (
            <button
              key={item}
              type="button"
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPageChange(item)}
              className={`${pageButton} ${
                item === page
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          ) : (
            <span key={item} className="px-2 text-slate-400">
              …
            </span>
          ),
        )}
        <button
          type="button"
          className={`${pageButton} border-slate-300 bg-white`}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </nav>
    </div>
  );
}
