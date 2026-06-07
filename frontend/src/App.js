import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ActivePage from "@/pages/Active";
import ArchivePage from "@/pages/Archive";
import SettingsPage from "@/pages/Settings";
import { AppProvider } from "@/lib/app-context";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ActivePage />} />
            <Route path="archive" element={<ArchivePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
