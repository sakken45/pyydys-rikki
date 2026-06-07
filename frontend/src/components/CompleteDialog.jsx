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
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-context";

export default function CompleteDialog({ open, onOpenChange, onConfirm }) {
  const { t, presets } = useApp();
  const [selected, setSelected] = useState([]);

  const toggle = (name) =>
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name],
    );

  const confirm = () => {
    onConfirm(selected);
    setSelected([]);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setSelected([]);
      }}
    >
      <DialogContent
        className="rounded-2xl sm:max-w-md"
        data-testid="complete-dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {t("completeTitle")}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {t("completeSubtitle")}
          </DialogDescription>
        </DialogHeader>

        {presets.people.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            {t("completeNoPeople")}
          </p>
        ) : (
          <div
            className="flex flex-wrap gap-2"
            data-testid="complete-people-list"
          >
            {presets.people.map((person) => {
              const active = selected.includes(person);
              return (
                <button
                  key={person}
                  type="button"
                  onClick={() => toggle(person)}
                  data-testid={`complete-person-${person}`}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                    active
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                  )}
                >
                  {active && <Check className="h-3.5 w-3.5" />}
                  {person}
                </button>
              );
            })}
          </div>
        )}

        <DialogFooter className="mt-2 gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
            data-testid="complete-cancel-btn"
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={confirm}
            className="rounded-full bg-blue-600 px-6 hover:bg-blue-700"
            data-testid="complete-confirm-btn"
          >
            {t("completeConfirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
