function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
