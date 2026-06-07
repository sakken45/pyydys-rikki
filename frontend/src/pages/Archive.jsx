import { useMemo, useState } from "react";
import { Archive as ArchiveIcon, Search, Wrench, ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/app-context";
import { JobCard } from "@/components/JobCard";
import { toast } from "sonner";

function dayKey(iso) {
  if (!iso) return "—";
  return iso.slice(0, 10); // YYYY-MM-DD
}

function fmtDayHeader(key) {
  if (key === "—") return "Undated";
  try {
    const d = new Date(key);
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return key;
  }
}

export default function ArchivePage() {
  const { t, services, setServices, oddJobs, setOddJobs } = useApp();
  const [query, setQuery] = useState("");

  const matches = (s, q) => {
    if (!q) return true;
    const hay =
      `${s.vehicle ?? ""} ${s.title ?? ""} ${s.place ?? ""} ${s.notes ?? ""} ${(s.people || []).join(" ")}`.toLowerCase();
    return hay.includes(q);
  };

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const archivedServices = services
      .filter((s) => s.status === "done")
      .filter((s) => matches(s, q));
    const archivedOddJobs = oddJobs
      .filter((j) => j.status === "done")
      .filter((j) => matches(j, q));

    // Group by completion day
    const map = new Map(); // key -> { services: [], oddJobs: [] }
    const push = (bucket, item, key) => {
      if (!map.has(key)) map.set(key, { services: [], oddJobs: [] });
      map.get(key)[bucket].push(item);
    };
    archivedServices.forEach((s) =>
      push("services", s, dayKey(s.completedAt ?? s.date)),
    );
    archivedOddJobs.forEach((j) =>
      push("oddJobs", j, dayKey(j.completedAt ?? j.date)),
    );

    // Sort keys descending (newest first)
    return Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0))
      .map(([key, val]) => ({ key, ...val }));
  }, [services, oddJobs, query]);

  const restoreService = (item) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === item.id ? { ...s, status: "open", completedAt: null } : s,
      ),
    );
    toast("Restored", { description: item.vehicle });
  };
  const restoreOddJob = (item) => {
    setOddJobs((prev) =>
      prev.map((j) =>
        j.id === item.id ? { ...j, status: "open", completedAt: null } : j,
      ),
    );
    toast("Restored", { description: item.title });
  };

  const deleteService = (item) => {
    setServices((prev) => prev.filter((s) => s.id !== item.id));
  };
  const deleteOddJob = (item) => {
    setOddJobs((prev) => prev.filter((j) => j.id !== item.id));
  };

  const totalCount = groups.reduce(
    (a, g) => a + g.services.length + g.oddJobs.length,
    0,
  );

  return (
    <div className="space-y-8" data-testid="archive-page">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600">
            <ArchiveIcon className="h-5 w-5" />
          </div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {t("archiveTitle")}
          </h1>
        </div>
        <p className="text-base text-slate-500">{t("archiveSubtitle")}</p>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-12 rounded-2xl border-slate-200 bg-white pl-11 text-sm shadow-sm focus-visible:ring-blue-500/30"
          data-testid="archive-search-input"
        />
      </div>

      {totalCount === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-6 py-20 text-center"
          data-testid="archive-empty"
        >
          <ArchiveIcon className="mb-4 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            {t("archiveEmpty")}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((g) => (
            <section key={g.key} data-testid={`archive-day-${g.key}`}>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {fmtDayHeader(g.key)}
                </div>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {g.services.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Wrench className="h-4 w-4 text-blue-600" />
                      {t("archiveServicesHeading")}
                      <span className="font-mono text-xs text-slate-400">
                        ({g.services.length})
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {g.services.map((s) => (
                        <JobCard
                          key={s.id}
                          kind="service"
                          item={s}
                          archived
                          onComplete={() => {}}
                          onEdit={() => {}}
                          onRestore={restoreService}
                          onDelete={deleteService}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {g.oddJobs.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <ClipboardList className="h-4 w-4 text-blue-600" />
                      {t("archiveOddJobsHeading")}
                      <span className="font-mono text-xs text-slate-400">
                        ({g.oddJobs.length})
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {g.oddJobs.map((j) => (
                        <JobCard
                          key={j.id}
                          kind="oddJob"
                          item={j}
                          archived
                          onComplete={() => {}}
                          onEdit={() => {}}
                          onRestore={restoreOddJob}
                          onDelete={deleteOddJob}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
