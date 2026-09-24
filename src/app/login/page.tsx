import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-semibold text-slate-900">Product Admin</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Sign in to manage products</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
