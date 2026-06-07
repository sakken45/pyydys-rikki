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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/lib/app-context";
import { uid } from "@/lib/storage";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { cn } from "@/lib/utils";

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function ServiceDialog({ open, onOpenChange, editing }) {
  const { t, presets, setServices } = useApp();
  const [vehicle, setVehicle] = useState(editing?.vehicle ?? "");
  const [action, setAction] = useState(editing?.action ?? "in");
  const [date, setDate] = useState(editing?.date ?? todayIso());
  const [place, setPlace] = useState(editing?.place ?? "");
  const [notes, setNotes] = useState(editing?.notes ?? "");

  // Reset form whenever dialog re-opens for a new item
  const resetForm = () => {
    setVehicle("");
    setAction("in");
    setDate(todayIso());
    setPlace("");
    setNotes("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vehicle.trim()) return;
    setServices((prev) => {
      if (editing) {
        return prev.map((s) =>
          s.id === editing.id
            ? { ...s, vehicle: vehicle.trim(), action, date, place, notes }
            : s,
        );
      }
      return [
        ...prev,
        {
          id: uid(),
          vehicle: vehicle.trim(),
          action,
          date,
          place,
          notes,
          people: [],
          status: "open",
          createdAt: new Date().toISOString(),
          completedAt: null,
        },
      ];
    });
    onOpenChange(false);
    if (!editing) resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-2xl sm:max-w-lg"
        data-testid="service-dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {editing ? t("serviceFormEdit") : t("serviceFormNew")}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {t("servicesTitle")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Action toggle */}
          <div>
            <Label className="text-slate-700">{t("fieldAction")}</Label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAction("in")}
                data-testid="service-action-in"
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                  action === "in"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                <ArrowDownToLine className="h-4 w-4" />
                {t("actionInService")}
              </button>
              <button
                type="button"
                onClick={() => setAction("out")}
                data-testid="service-action-out"
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                  action === "out"
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                <ArrowUpFromLine className="h-4 w-4" />
                {t("actionOutService")}
              </button>
            </div>
          </div>

          {/* Vehicle */}
          <div>
            <Label className="text-slate-700">{t("fieldVehicle")}</Label>
            {presets.vehicles.length > 0 && (
              <Select value={vehicle} onValueChange={setVehicle}>
                <SelectTrigger
                  className="mt-1.5 rounded-lg"
                  data-testid="service-vehicle-select"
                >
                  <SelectValue placeholder={t("placeholderSelectVehicle")} />
                </SelectTrigger>
                <SelectContent>
                  {presets.vehicles.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Input
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              placeholder={t("placeholderSelectVehicle")}
              className="mt-1.5 rounded-lg"
              data-testid="service-vehicle-input"
              required
            />
          </div>

          {/* Date */}
          <div>
            <Label className="text-slate-700">{t("fieldDate")}</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1.5 rounded-lg"
              data-testid="service-date-input"
              required
            />
          </div>

          {/* Place */}
          <div>
            <Label className="text-slate-700">{t("fieldPlace")}</Label>
            {presets.places.length > 0 ? (
              <Select value={place} onValueChange={setPlace}>
                <SelectTrigger
                  className="mt-1.5 rounded-lg"
                  data-testid="service-place-select"
                >
                  <SelectValue placeholder={t("placeholderSelectPlace")} />
                </SelectTrigger>
                <SelectContent>
                  {presets.places.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="mt-1.5 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                {t("noPresetsHint")}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label className="text-slate-700">{t("fieldNotes")}</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("placeholderNotes")}
              className="mt-1.5 rounded-lg"
              data-testid="service-notes-input"
              rows={3}
            />
          </div>

          <DialogFooter className="mt-2 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-full"
              data-testid="service-cancel-btn"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-blue-600 px-6 hover:bg-blue-700"
              data-testid="service-save-btn"
            >
              {t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
