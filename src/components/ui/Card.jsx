import clsx from "../../utils/clsx";

function Card({ children, className = "" }) {
  return (
    <div
      className={clsx(
        "glass-panel rounded-3xl p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Card;
