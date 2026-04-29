import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { BarChart3, Building2, ClipboardList, Home, LayoutDashboard, School, ShieldAlert, Users } from "lucide-react";
import clsx from "../../utils/clsx";
import { useAuth } from "../../context/AuthContext";

const navByRole = {
  student: [
    { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/student/submit", label: "Submit", icon: ClipboardList },
    { to: "/student/complaints", label: "My Complaints", icon: Home }
  ],
  faculty: [{ to: "/faculty/dashboard", label: "Faculty", icon: School }],
  warden: [
    { to: "/warden/dashboard", label: "Dashboard", icon: ShieldAlert },
    { to: "/warden/hostels", label: "Hostel Cases", icon: Building2 }
  ],
  admin: [
    { to: "/admin/dashboard", label: "Admin", icon: BarChart3 },
    { to: "/admin/manage", label: "Manage", icon: ClipboardList },
    { to: "/admin/users", label: "Users", icon: Users }
  ]
};

function Sidebar({ mobileOpen, onClose }) {
  const { role } = useAuth();
  const links = navByRole[role] || [];

  return (
    <>
      <div className={clsx("fixed inset-0 z-20 bg-slate-950/40 lg:hidden", !mobileOpen && "hidden")} onClick={onClose} />
      <aside
        className={clsx(
          "fixed left-0 top-0 z-30 h-full w-72 border-r border-white/50 bg-gradient-to-b from-cyan-50/90 via-white/85 to-lime-50/90 p-4 backdrop-blur-xl transition-transform dark:border-slate-700/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="mb-8 rounded-3xl border border-white/60 bg-white/70 p-3 shadow-soft dark:border-slate-700 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Campus Resolve" className="h-11 w-11 rounded-2xl" />
            <div>
              <p className="font-extrabold tracking-tight">Campus Resolve</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Smart Grievance System</p>
            </div>
          </div>
        </div>
        <nav className="space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all",
                  isActive
                    ? "bg-gradient-to-r from-brand-600 to-cyan-500 text-white shadow-lg shadow-brand-600/30"
                    : "text-slate-700 hover:bg-white/90 dark:text-slate-300 dark:hover:bg-slate-800"
                )
              }
            >
              <Icon size={16} className="transition group-hover:scale-105" /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
