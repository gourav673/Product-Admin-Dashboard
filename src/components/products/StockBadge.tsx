export function StockBadge({ stock }: { stock: number }) {
  const style =
    stock === 0
      ? "bg-red-100 text-red-700"
      : stock < 10
        ? "bg-amber-100 text-amber-800"
        : "bg-emerald-100 text-emerald-700";
  const label = stock === 0 ? "Out of stock" : `${stock} in stock`;

  return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>{label}</span>;
}
