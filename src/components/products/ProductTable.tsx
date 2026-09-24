import Link from "next/link";
import type { Product } from "@/types/product";
import { formatCategory, formatPrice, formatRating } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { ProductActions } from "./ProductActions";
import { StockBadge } from "./StockBadge";

interface ProductTableProps {
  products: Product[];
  onDelete: (product: Product) => void;
}

const COLUMNS = ["Image", "Title", "Category", "Price", "Rating", "Stock", "Actions"];

/** Desktop view (md and up). */
export function ProductTable({ products, onDelete }: ProductTableProps) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-slate-200 bg-white md:block">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {COLUMNS.map((col) => (
              <th key={col} scope="col" className="px-4 py-3 text-left font-medium text-slate-600">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-slate-50">
              <td className="px-4 py-2">
                <ProductImage src={product.thumbnail} alt={product.title} />
              </td>
              <td className="max-w-xs px-4 py-2">
                <Link href={`/products/${product.id}`} className="font-medium text-slate-900 hover:underline">
                  {product.title}
                </Link>
                {product.isLocal && <span className="ml-2 text-xs text-indigo-600">(new)</span>}
              </td>
              <td className="px-4 py-2 text-slate-600">{formatCategory(product.category)}</td>
              <td className="px-4 py-2 text-slate-900">{formatPrice(product.price)}</td>
              <td className="px-4 py-2 text-amber-600">{formatRating(product.rating)}</td>
              <td className="px-4 py-2">
                <StockBadge stock={product.stock} />
              </td>
              <td className="px-4 py-2">
                <ProductActions product={product} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
