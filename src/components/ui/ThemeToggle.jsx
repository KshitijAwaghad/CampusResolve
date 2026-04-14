import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("cr-theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("cr-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      className="rounded-2xl border border-slate-300/70 bg-white/80 p-2 transition hover:bg-white dark:border-slate-700 dark:bg-slate-800/70 dark:hover:bg-slate-800"
      onClick={() => setDark((prev) => !prev)}
      type="button"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export default ThemeToggle;
