import { ProductDetails } from "@/components/products/ProductDetails";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // key: start fresh (no stale product) when moving between two product pages.
  return <ProductDetails key={id} id={id} />;
}
