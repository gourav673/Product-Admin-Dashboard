import Link from "next/link";
import type { Product } from "@/types/product";
import { formatCategory, formatPrice, formatRating } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { ProductActions } from "./ProductActions";
import { StockBadge } from "./StockBadge";

interface ProductCardsProps {
  products: Product[];
  onDelete: (product: Product) => void;
}

/** Mobile view (below md). */
export function ProductCards({ products, onDelete }: ProductCardsProps) {
  return (
    <ul className="space-y-3 md:hidden">
      {products.map((product) => (
        <li key={product.id} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4">
          <ProductImage src={product.thumbnail} alt={product.title} className="h-20 w-20 shrink-0" />
          <div className="min-w-0 flex-1 space-y-1">
            <Link href={`/products/${product.id}`} className="block truncate font-medium text-slate-900">
              {product.title}
              {product.isLocal && <span className="ml-2 text-xs text-indigo-600">(new)</span>}
            </Link>
            <p className="text-xs text-slate-500">{formatCategory(product.category)}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="font-semibold text-slate-900">{formatPrice(product.price)}</span>
              <span className="text-amber-600">{formatRating(product.rating)}</span>
              <StockBadge stock={product.stock} />
            </div>
            <div className="pt-1">
              <ProductActions product={product} onDelete={onDelete} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
