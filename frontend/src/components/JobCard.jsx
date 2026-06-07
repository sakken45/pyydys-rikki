import {
  Calendar,
  MapPin,
  Users,
  Pencil,
  Trash2,
  CheckCircle2,
  ArrowDownToLine,
  ArrowUpFromLine,
  Car,
  RotateCcw,
} from "lucide-react";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";

function fmtDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function ActionBadge({ action }) {
  const { t } = useApp();
  const isIn = action === "in";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider",
        isIn
          ? "bg-blue-100 text-blue-700"
          : "bg-amber-100 text-amber-700",
      )}
    >
      {isIn ? (
        <ArrowDownToLine className="h-3 w-3" />
      ) : (
        <ArrowUpFromLine className="h-3 w-3" />
      )}
      {isIn ? t("labelIn") : t("labelOut")}
    </span>
  );
}

export function JobCard({
  kind, // 'service' | 'oddJob'
  item,
  onComplete,
  onEdit,
  onDelete,
  onRestore,
  archived = false,
}) {
  const { t } = useApp();
  const isService = kind === "service";
  return (
    <div
      className="group flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 transition-all hover:border-slate-200 hover:shadow-sm"
      data-testid={`${kind}-card-${item.id}`}
    >
      <div className="flex flex-wrap items-start gap-2">
        {isService && <ActionBadge action={item.action} />}
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
          <Calendar className="h-3.5 w-3.5" />
          {fmtDate(item.date)}
        </span>
      </div>

      <div>
        <div className="font-heading text-base font-semibold text-slate-900">
          {isService ? item.vehicle : item.title}
        </div>
        {!isService && item.vehicle && (
          <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
            <Car className="h-3 w-3" />
            {item.vehicle}
          </div>
        )}
        {isService && item.place && (
          <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3 w-3" />
            {item.place}
          </div>
        )}
      </div>

      {item.notes && (
        <p className="text-sm leading-relaxed text-slate-600">{item.notes}</p>
      )}

      {item.people && item.people.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-slate-400" />
          {item.people.map((p) => (
            <span
              key={p}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
            >
              {p}
            </span>
          ))}
        </div>
      )}

      <div className="mt-1 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
        {!archived && (
          <button
            type="button"
            onClick={() => onComplete(item)}
            data-testid={`${kind}-done-${item.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-100"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t("actionDone")}
          </button>
        )}
        {!archived && (
          <button
            type="button"
            onClick={() => onEdit(item)}
            data-testid={`${kind}-edit-${item.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-200"
          >
            <Pencil className="h-3.5 w-3.5" />
            {t("actionEdit")}
          </button>
        )}
        {archived && (
          <button
            type="button"
            onClick={() => onRestore(item)}
            data-testid={`${kind}-restore-${item.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-100"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t("restoreBtn")}
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(item)}
          data-testid={`${kind}-delete-${item.id}`}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition-all hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-3.5 w-3.5" />
          {t("actionDelete")}
        </button>
      </div>
    </div>
  );
}
