import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Product } from "@/types/product";

interface DeleteProductDialogProps {
  product: Product | null;
  pending: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteProductDialog({ product, pending, error, onConfirm, onCancel }: DeleteProductDialogProps) {
  return (
    <ConfirmDialog
      open={product !== null}
      title="Delete product?"
      message={product ? `"${product.title}" will be removed. This cannot be undone.` : ""}
      confirmLabel="Delete"
      loading={pending}
      error={error}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
