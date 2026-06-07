import { useState } from "react";
import { Plus, X, Settings as SettingsIcon, RotateCcw, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { DEFAULT_LABELS } from "@/lib/defaults";
import { toast } from "sonner";

function PresetList({ title, items, onAdd, onRemove, testId, placeholder }) {
  const [draft, setDraft] = useState("");
  const submit = (e) => {
    e?.preventDefault?.();
    const val = draft.trim();
    if (!val) return;
    if (items.includes(val)) {
      toast.error("Already exists", { description: val });
      return;
    }
    onAdd(val);
    setDraft("");
  };
  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      data-testid={testId}
    >
      <h2 className="font-heading text-lg font-semibold text-slate-900">
        {title}
      </h2>
      <form onSubmit={submit} className="mt-4 flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          className="rounded-lg"
          data-testid={`${testId}-input`}
        />
        <Button
          type="submit"
          className="shrink-0 rounded-full bg-blue-600 px-4 hover:bg-blue-700"
          data-testid={`${testId}-add`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.length === 0 ? (
          <p className="text-xs text-slate-400">No items yet.</p>
        ) : (
          items.map((it) => (
            <span
              key={it}
              className="group inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
              data-testid={`${testId}-item-${it}`}
            >
              {it}
              <button
                type="button"
                onClick={() => onRemove(it)}
                className="text-slate-400 transition-colors hover:text-red-600"
                aria-label={`Remove ${it}`}
                data-testid={`${testId}-remove-${it}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
}

function LabelEditor() {
  const { t, labelOverrides, setLabel, resetLabels } = useApp();
  const keys = Object.keys(DEFAULT_LABELS);

  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      data-testid="labels-editor"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold text-slate-900">
            {t("settingsLabels")}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Override the wording of any button, heading or message.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetLabels();
            toast.success("Labels reset");
          }}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-200"
          data-testid="labels-reset"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t("settingsResetLabels")}
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {keys.map((k) => (
          <div key={k} className="grid gap-1">
            <Label className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              {k}
            </Label>
            <Input
              value={labelOverrides[k] ?? DEFAULT_LABELS[k]}
              onChange={(e) => setLabel(k, e.target.value)}
              className="rounded-lg text-sm"
              data-testid={`label-input-${k}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { t, presets, setPresets, clearAll } = useApp();

  const addPreset = (bucket, val) =>
    setPresets((prev) => ({ ...prev, [bucket]: [...prev[bucket], val] }));
  const removePreset = (bucket, val) =>
    setPresets((prev) => ({
      ...prev,
      [bucket]: prev[bucket].filter((p) => p !== val),
    }));

  const handleClearAll = () => {
    if (window.confirm(t("settingsClearConfirm"))) {
      clearAll();
      toast.success("All local data erased");
    }
  };

  return (
    <div className="space-y-8" data-testid="settings-page">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600">
            <SettingsIcon className="h-5 w-5" />
          </div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {t("settingsTitle")}
          </h1>
        </div>
        <p className="text-base text-slate-500">{t("settingsSubtitle")}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <PresetList
          title={t("settingsPlaces")}
          items={presets.places}
          onAdd={(v) => addPreset("places", v)}
          onRemove={(v) => removePreset("places", v)}
          testId="preset-places"
          placeholder={t("settingsAddPlaceholder")}
        />
        <PresetList
          title={t("settingsPeople")}
          items={presets.people}
          onAdd={(v) => addPreset("people", v)}
          onRemove={(v) => removePreset("people", v)}
          testId="preset-people"
          placeholder={t("settingsAddPlaceholder")}
        />
        <PresetList
          title={t("settingsVehicles")}
          items={presets.vehicles}
          onAdd={(v) => addPreset("vehicles", v)}
          onRemove={(v) => removePreset("vehicles", v)}
          testId="preset-vehicles"
          placeholder={t("settingsAddPlaceholder")}
        />
      </div>

      <LabelEditor />

      <div
        className="rounded-2xl border border-red-200 bg-red-50/40 p-6"
        data-testid="danger-zone"
      >
        <h2 className="font-heading text-lg font-semibold text-red-700">
          {t("settingsDangerZone")}
        </h2>
        <p className="mt-1 text-sm text-red-700/80">
          {t("settingsClearConfirm")}
        </p>
        <Button
          type="button"
          onClick={handleClearAll}
          className="mt-4 rounded-full bg-red-600 px-5 hover:bg-red-700"
          data-testid="clear-all-btn"
        >
          <Trash2 className="mr-1.5 h-4 w-4" />
          {t("settingsClearAll")}
        </Button>
      </div>
    </div>
  );
}
