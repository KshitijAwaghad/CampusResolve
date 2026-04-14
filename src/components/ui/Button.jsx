import clsx from "../../utils/clsx";

function Button({ children, className = "", variant = "primary", ...props }) {
  const variants = {
    primary:
      "bg-gradient-to-r from-brand-600 to-cyan-500 text-white shadow-lg shadow-brand-500/30 hover:brightness-110 hover:shadow-glow",
    secondary:
      "border border-slate-300 bg-white/80 text-slate-900 hover:bg-white dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-100",
    danger:
      "bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-lg shadow-rose-500/30 hover:brightness-110",
    ghost:
      "bg-transparent text-slate-800 hover:bg-slate-200/70 dark:text-slate-100 dark:hover:bg-slate-800/70"
  };

  return (
    <button
      className={clsx(
        "rounded-2xl px-4 py-2 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
