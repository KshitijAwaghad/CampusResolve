function Input({ label, className = "", ...props }) {
  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>}
      <input
        className={`w-full rounded-2xl border border-slate-300/90 bg-white/90 px-4 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-800/80 dark:focus:ring-brand-900 ${className}`}
        {...props}
      />
    </label>
  );
}

export default Input;
