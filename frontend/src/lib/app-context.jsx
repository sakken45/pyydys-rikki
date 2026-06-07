import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/storage";
import { DEFAULT_LABELS, DEFAULT_PRESETS } from "@/lib/defaults";

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [services, setServices] = useLocalStorage(STORAGE_KEYS.services, []);
  const [oddJobs, setOddJobs] = useLocalStorage(STORAGE_KEYS.oddJobs, []);
  const [presets, setPresets] = useLocalStorage(
    STORAGE_KEYS.presets,
    DEFAULT_PRESETS,
  );
  const [labelOverrides, setLabelOverrides] = useLocalStorage(
    STORAGE_KEYS.labels,
    {},
  );

  const t = useCallback(
    (key) => {
      if (labelOverrides[key] !== undefined && labelOverrides[key] !== "")
        return labelOverrides[key];
      return DEFAULT_LABELS[key] ?? key;
    },
    [labelOverrides],
  );

  const setLabel = useCallback(
    (key, val) => {
      setLabelOverrides((prev) => {
        const next = { ...prev };
        if (val === "" || val === DEFAULT_LABELS[key]) delete next[key];
        else next[key] = val;
        return next;
      });
    },
    [setLabelOverrides],
  );

  const resetLabels = useCallback(
    () => setLabelOverrides({}),
    [setLabelOverrides],
  );

  const clearAll = useCallback(() => {
    setServices([]);
    setOddJobs([]);
    setPresets(DEFAULT_PRESETS);
    setLabelOverrides({});
  }, [setServices, setOddJobs, setPresets, setLabelOverrides]);

  const value = useMemo(
    () => ({
      services,
      setServices,
      oddJobs,
      setOddJobs,
      presets,
      setPresets,
      labelOverrides,
      setLabelOverrides,
      t,
      setLabel,
      resetLabels,
      clearAll,
    }),
    [
      services,
      setServices,
      oddJobs,
      setOddJobs,
      presets,
      setPresets,
      labelOverrides,
      setLabelOverrides,
      t,
      setLabel,
      resetLabels,
      clearAll,
    ],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
