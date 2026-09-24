import { EditProduct } from "@/components/products/EditProduct";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditProduct key={id} id={id} />;
}
