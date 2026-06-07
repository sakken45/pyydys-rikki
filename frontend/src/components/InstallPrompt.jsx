import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

/**
 * Floating "Install Pyydys" prompt that appears when the browser
 * fires beforeinstallprompt (Chrome / Edge / Android). Safari iOS
 * does not fire this event — users add to Home Screen manually.
 */
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return window.localStorage.getItem("pyydys.installDismissed") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferred(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    const installed = () => setDeferred(null);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  if (dismissed || !deferred) return null;

  const install = async () => {
    deferred.prompt();
    try {
      await deferred.userChoice;
    } catch {
      /* user dismissed */
    }
    setDeferred(null);
  };

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem("pyydys.installDismissed", "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className="fixed bottom-6 left-1/2 z-40 flex w-[min(420px,calc(100%-2rem))] -translate-x-1/2 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]"
      data-testid="install-prompt"
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white">
        <Download className="h-5 w-5" />
      </div>
      <div className="flex-1 leading-tight">
        <div className="text-sm font-semibold text-slate-900">
          Install Pyydys
        </div>
        <div className="text-xs text-slate-500">
          Add to your device — works fully offline.
        </div>
      </div>
      <button
        type="button"
        onClick={install}
        className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-blue-700 active:scale-95"
        data-testid="install-prompt-install"
      >
        Install
      </button>
      <button
        type="button"
        onClick={dismiss}
        className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        aria-label="Dismiss"
        data-testid="install-prompt-dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
