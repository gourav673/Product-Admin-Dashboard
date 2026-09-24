import Link from "next/link";
import type { Product } from "@/types/product";

interface ProductActionsProps {
  product: Product;
  onDelete: (product: Product) => void;
}

/** View / Edit / Delete links, shared by the table row and the mobile card. */
export function ProductActions({ product, onDelete }: ProductActionsProps) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium">
      <Link href={`/products/${product.id}`} className="text-slate-600 hover:text-slate-900">
        View
      </Link>
      <Link href={`/products/${product.id}/edit`} className="text-indigo-600 hover:text-indigo-800">
        Edit
      </Link>
      <button type="button" onClick={() => onDelete(product)} className="text-red-600 hover:text-red-800">
        Delete
      </button>
    </div>
  );
}
