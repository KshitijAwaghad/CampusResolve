import { Bell, Menu } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { useComplaints } from "../../context/ComplaintContext";
import Badge from "../ui/Badge";
import { useState } from "react";

function capitalizeFirst(value = "") {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function Navbar({ onMenuClick }) {
  const { role, userName, userEmail, logout } = useAuth();
  const { notifications, markNotificationRead } = useComplaints();
  const [show, setShow] = useState(false);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/50 bg-white/65 px-4 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/65">
      <div className="flex items-center gap-3">
        <button
          className="rounded-2xl bg-white/70 p-2 transition hover:bg-white dark:bg-slate-800/70 dark:hover:bg-slate-800 lg:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <Menu />
        </button>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight">Campus Resolve</h1>
          <p className="-mt-0.5 text-xs text-slate-500 dark:text-slate-400">Live Grievance Intelligence</p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <div className="relative">
          <button
            className="flex items-center gap-2 rounded-2xl border border-slate-300/70 bg-white/80 px-3 py-2 text-sm font-semibold transition hover:bg-white dark:border-slate-700 dark:bg-slate-800/70"
            onClick={() => setShow((prev) => !prev)}
            type="button"
          >
            <Bell size={16} />
            Alerts
            {unread > 0 && (
              <Badge variant="danger" className="ml-1">
                {unread}
              </Badge>
            )}
          </button>
          {show && (
            <div className="absolute right-0 mt-2 max-h-72 w-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-soft dark:border-slate-700 dark:bg-slate-900/95">
              {notifications.length === 0 ? (
                <p className="p-2 text-sm text-slate-500">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className="mb-1 w-full rounded-xl p-2 text-left text-sm transition hover:bg-slate-100/80 dark:hover:bg-slate-800"
                    onClick={() => markNotificationRead(n.id)}
                  >
                    <p className={n.read ? "text-slate-500" : "font-semibold"}>{n.message}</p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        <ThemeToggle />
        <Badge>{capitalizeFirst(role || "Guest")}</Badge>
        {userName && userEmail && (
          <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 xl:block">
            {userName} ({userEmail})
          </span>
        )}
        <button
          className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
