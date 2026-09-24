export type PageItem = number | "ellipsis-left" | "ellipsis-right";

export function getTotalPages(total: number, limit: number): number {
  return Math.max(1, Math.ceil(total / limit));
}

/**
 * Page buttons to show, e.g. for page 6 of 20: 1 … 5 6 7 … 20.
 * Always shows the first and last page and one page on each side of the current one.
 */
export function getPageItems(current: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: PageItem[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  if (start > 2) items.push("ellipsis-left");
  for (let page = start; page <= end; page++) items.push(page);
  if (end < totalPages - 1) items.push("ellipsis-right");

  items.push(totalPages);
  return items;
}

/** "Showing 21–40 of 194" */
export function getRangeText(page: number, limit: number, shownCount: number, total: number): string {
  if (total === 0 || shownCount === 0) return `Showing 0 of ${total}`;
  const from = (page - 1) * limit + 1;
  const to = Math.min(from + shownCount - 1, total);
  return `Showing ${from}–${to} of ${total}`;
}
