import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";

function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:pl-72">
        <Navbar onMenuClick={() => setMobileOpen((prev) => !prev)} />
        <main className="h-[calc(100vh-4rem)] overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
