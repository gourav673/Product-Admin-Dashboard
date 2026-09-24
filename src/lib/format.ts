const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatPrice(value: number): string {
  return currency.format(value);
}

export function formatRating(value: number): string {
  return `★ ${value.toFixed(1)}`;
}

/** "mens-shirts" -> "Mens Shirts" */
export function formatCategory(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
