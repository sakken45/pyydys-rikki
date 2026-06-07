import { useCallback, useEffect, useState } from "react";

// Generic localStorage-backed state hook. Fully offline, no remote sync.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null || raw === undefined) return initialValue;
      return JSON.parse(raw);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota / private mode — ignore */
    }
  }, [key, value]);

  // Cross-tab / same-tab sync
  useEffect(() => {
    const handler = (e) => {
      if (e.key === key) {
        try {
          setValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch {
          /* noop */
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, setValue];
}

export const STORAGE_KEYS = {
  services: "pyydys.services.v1",
  oddJobs: "pyydys.oddJobs.v1",
  presets: "pyydys.presets.v1",
  labels: "pyydys.labels.v1",
};

export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
