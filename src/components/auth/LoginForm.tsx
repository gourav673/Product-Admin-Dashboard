"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, SESSION_MINUTES } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/api/client";
import { saveSession } from "@/lib/auth/session";
import { useSingleFlight } from "@/hooks/useSingleFlight";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

/** Only allow redirects inside this app (blocks ?next=https://evil.com and //evil.com). */
function safeNext(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/products";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("expired") ? "Your session expired. Please log in again." : null,
  );

  // Keeps the button disabled while we redirect after a successful login.
  const [loggedIn, setLoggedIn] = useState(false);

  const { run: submit, pending } = useSingleFlight(async () => {
    setError(null);
    try {
      const data = await login({ username: username.trim(), password });
      const { id, email, firstName, lastName, image } = data;
      saveSession(
        data.accessToken,
        { id, username: data.username, email, firstName, lastName, image },
        SESSION_MINUTES * 60,
      );
      setLoggedIn(true);
      router.replace(safeNext(searchParams.get("next")));
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (loggedIn) return;
    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }
    submit();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <TextField
        label="Username"
        name="username"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" loading={pending || loggedIn} className="w-full">
        {pending || loggedIn ? "Logging in…" : "Log in"}
      </Button>
      <p className="text-center text-xs text-slate-500">
        Demo account: <span className="font-mono">emilys</span> / <span className="font-mono">emilyspass</span>
      </p>
    </form>
  );
}
