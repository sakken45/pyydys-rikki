import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/app-context";
import { uid } from "@/lib/storage";

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function OddJobDialog({ open, onOpenChange, editing }) {
  const { t, presets, setOddJobs } = useApp();
  const [title, setTitle] = useState(editing?.title ?? "");
  const [date, setDate] = useState(editing?.date ?? todayIso());
  const [vehicle, setVehicle] = useState(editing?.vehicle ?? "");
  const [notes, setNotes] = useState(editing?.notes ?? "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setOddJobs((prev) => {
      if (editing) {
        return prev.map((j) =>
          j.id === editing.id
            ? { ...j, title: title.trim(), date, vehicle, notes }
            : j,
        );
      }
      return [
        ...prev,
        {
          id: uid(),
          title: title.trim(),
          date,
          vehicle,
          notes,
          people: [],
          status: "open",
          createdAt: new Date().toISOString(),
          completedAt: null,
        },
      ];
    });
    onOpenChange(false);
    if (!editing) {
      setTitle("");
      setDate(todayIso());
      setVehicle("");
      setNotes("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-2xl sm:max-w-lg"
        data-testid="oddjob-dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {editing ? t("oddJobFormEdit") : t("oddJobFormNew")}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {t("oddJobsTitle")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label className="text-slate-700">{t("fieldTitle")}</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("placeholderTitle")}
              className="mt-1.5 rounded-lg"
              data-testid="oddjob-title-input"
              required
            />
          </div>

          <div>
            <Label className="text-slate-700">{t("fieldDate")}</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1.5 rounded-lg"
              data-testid="oddjob-date-input"
              required
            />
          </div>

          <div>
            <Label className="flex items-center gap-1 text-slate-700">
              {t("fieldVehicle")}
              <span className="text-xs text-slate-400">
                {t("fieldOptional")}
              </span>
            </Label>
            <Input
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              placeholder={t("placeholderSelectVehicle")}
              className="mt-1.5 rounded-lg"
              data-testid="oddjob-vehicle-input"
            />
            {presets.vehicles.length > 0 && (
              <div
                className="mt-2 flex flex-wrap gap-1.5"
                data-testid="oddjob-vehicle-presets"
              >
                {presets.vehicles.map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setVehicle(v)}
                    data-testid={`oddjob-vehicle-preset-${v}`}
                    className={
                      vehicle === v
                        ? "rounded-full border border-blue-600 bg-blue-600 px-2.5 py-1 text-xs font-medium text-white transition-all"
                        : "rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition-all hover:border-slate-300"
                    }
                  >
                    {v}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label className="text-slate-700">{t("fieldNotes")}</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("placeholderNotes")}
              className="mt-1.5 rounded-lg"
              data-testid="oddjob-notes-input"
              rows={3}
            />
          </div>

          <DialogFooter className="mt-2 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-full"
              data-testid="oddjob-cancel-btn"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-blue-600 px-6 hover:bg-blue-700"
              data-testid="oddjob-save-btn"
            >
              {t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
