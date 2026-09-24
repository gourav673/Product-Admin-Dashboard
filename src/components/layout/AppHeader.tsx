"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";

export function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/products" className="font-semibold text-slate-900">
          Product Admin
        </Link>
        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden text-sm text-slate-600 sm:inline">
              {user.firstName} {user.lastName}
            </span>
          )}
          <Button variant="secondary" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
