import Link from "next/link";

export function ProductNotFound() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-6 py-16 text-center">
      <p className="text-5xl font-bold text-slate-300">404</p>
      <h1 className="mt-3 text-xl font-semibold text-slate-900">Product not found</h1>
      <p className="mt-1 text-sm text-slate-500">This product does not exist or was deleted.</p>
      <Link href="/products" className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline">
        Back to products
      </Link>
    </div>
  );
}
