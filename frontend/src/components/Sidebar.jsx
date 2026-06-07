import { NavLink } from "react-router-dom";
import { Wrench, Archive, Settings as SettingsIcon, Wifi } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";

function NavItem({ to, icon: Icon, children, testId }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      data-testid={testId}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
          isActive
            ? "bg-blue-600 text-white shadow-[0_6px_20px_-8px_rgba(37,99,235,0.7)]"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        )
      }
    >
      <Icon className="h-[18px] w-[18px]" />
      <span>{children}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const { t, services, oddJobs } = useApp();
  const open =
    services.filter((s) => s.status !== "done").length +
    oddJobs.filter((j) => j.status !== "done").length;
  const done =
    services.filter((s) => s.status === "done").length +
    oddJobs.filter((j) => j.status === "done").length;

  return (
    <aside
      className="flex h-dvh w-full shrink-0 flex-col gap-6 border-r border-slate-200 bg-slate-50/60 p-5 lg:w-72"
      data-testid="app-sidebar"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-[0_8px_24px_-10px_rgba(37,99,235,0.8)]">
          <Wrench className="h-6 w-6" />
        </div>
        <div className="leading-tight">
          <div
            className="font-heading text-lg font-semibold tracking-tight text-slate-900"
            data-testid="app-name"
          >
            {t("appName")}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Wifi className="h-3 w-3" />
            <span>{t("appTagline")}</span>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5">
        <NavItem to="/" icon={Wrench} testId="nav-active">
          {t("navActive")}
        </NavItem>
        <NavItem to="/archive" icon={Archive} testId="nav-archive">
          {t("navArchive")}
        </NavItem>
        <NavItem to="/settings" icon={SettingsIcon} testId="nav-settings">
          {t("navSettings")}
        </NavItem>
      </nav>

      <div className="mt-auto rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {t("statusHeading")}
        </div>
        <div
          className="mt-2 font-mono text-base text-slate-900"
          data-testid="status-counts"
        >
          <span className="text-blue-600">{open}</span>{" "}
          <span className="text-slate-500">{t("statusOpenSuffix")}</span>{" "}
          <span className="text-slate-300">/</span>{" "}
          <span className="text-emerald-600">{done}</span>{" "}
          <span className="text-slate-500">{t("statusDoneSuffix")}</span>
        </div>
      </div>
    </aside>
  );
}
