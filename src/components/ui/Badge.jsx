import clsx from "../../utils/clsx";

function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "border border-slate-300/70 bg-white/70 text-slate-700 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-200",
    success: "border border-emerald-300 bg-emerald-100/80 text-emerald-700 dark:border-emerald-700/50 dark:bg-emerald-900/30 dark:text-emerald-300",
    warning: "border border-amber-300 bg-amber-100/80 text-amber-700 dark:border-amber-700/50 dark:bg-amber-900/30 dark:text-amber-300",
    danger: "border border-rose-300 bg-rose-100/80 text-rose-700 dark:border-rose-700/50 dark:bg-rose-900/30 dark:text-rose-300",
    info: "border border-sky-300 bg-sky-100/80 text-sky-700 dark:border-sky-700/50 dark:bg-sky-900/30 dark:text-sky-300"
  };

  return (
    <span className={clsx("inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide", variants[variant], className)}>
      {children}
    </span>
  );
}

export default Badge;
