import type { ReactNode } from "react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AppHeader } from "@/components/layout/AppHeader";

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </AuthProvider>
  );
}
