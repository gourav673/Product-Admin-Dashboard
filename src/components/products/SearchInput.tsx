"use client";

import { useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const DEBOUNCE_MS = 400;

interface SearchInputProps {
  /** The search currently in the URL. */
  value: string;
  onSearch: (value: string) => void;
}

/**
 * Keeps what the user types in local state and only reports it (onSearch)
 * after they stop typing for DEBOUNCE_MS.
 */
export function SearchInput({ value, onSearch }: SearchInputProps) {
  const [text, setText] = useState(value);
  const debounced = useDebouncedValue(text, DEBOUNCE_MS);

  // Refs so the debounce effect below only fires when the typed text settles,
  // not when the URL or the callback changes.
  const lastSent = useRef(value);
  const latest = useRef({ value, onSearch });
  latest.current = { value, onSearch };

  useEffect(() => {
    const next = debounced.trim();
    if (next !== latest.current.value) {
      lastSent.current = next;
      latest.current.onSearch(next);
    }
  }, [debounced]);

  // The URL changed from outside (Back button, category picked, "Clear"):
  // show that value in the box. Ignore the echo of our own search.
  useEffect(() => {
    if (value !== lastSent.current) {
      lastSent.current = value;
      setText(value);
    }
  }, [value]);

  return (
    <div className="relative">
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <input
        id="product-search"
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search products…"
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
