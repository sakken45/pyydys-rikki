import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import InstallPrompt from "@/components/InstallPrompt";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-[1400px] flex-col lg:flex-row">
        {/* Sidebar: sticky on desktop, top bar on mobile */}
        <div className="hidden lg:block lg:sticky lg:top-0 lg:self-start">
          <Sidebar />
        </div>
        <div className="lg:hidden">
          <Sidebar />
        </div>

        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          <Outlet />
        </main>
      </div>
      <Toaster richColors position="top-right" />
      <InstallPrompt />
    </div>
  );
}
