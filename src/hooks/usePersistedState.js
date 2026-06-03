import { useState, useCallback } from "react";

// Shared hook: persists state to localStorage
// Usage: const [val, setVal] = usePersistedState("my_key", defaultValue)
export function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setValue = useCallback((value) => {
    setState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, [key]);

  return [state, setValue];
}
