"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Wraps an async action so it can only run once at a time.
 * The ref blocks extra clicks immediately (even before React re-renders and
 * disables the button), so fast double-clicks never send two requests.
 */
export function useSingleFlight<Args extends unknown[], R>(action: (...args: Args) => Promise<R>) {
  const running = useRef(false);
  const [pending, setPending] = useState(false);

  const run = useCallback(
    async (...args: Args): Promise<R | undefined> => {
      if (running.current) return undefined;
      running.current = true;
      setPending(true);
      try {
        return await action(...args);
      } finally {
        running.current = false;
        setPending(false);
      }
    },
    [action],
  );

  return { run, pending };
}
