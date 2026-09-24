import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-5xl font-bold text-slate-300">404</p>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <Link href="/products" className="text-sm font-medium text-indigo-600 hover:underline">
        Go to products
      </Link>
    </main>
  );
}
