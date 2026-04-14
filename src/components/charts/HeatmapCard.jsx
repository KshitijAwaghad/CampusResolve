import Card from "../ui/Card";

function colorByDensity(value) {
  if (value >= 8) return "bg-rose-600";
  if (value >= 6) return "bg-orange-500";
  if (value >= 4) return "bg-amber-500";
  if (value >= 2) return "bg-lime-500";
  return "bg-emerald-400";
}

function HeatmapCard({ title, data, xLabel = "Building", yLabel = "Category" }) {
  return (
    <Card>
      <p className="text-sm font-bold uppercase tracking-wider text-slate-500">{title}</p>
      <p className="mb-3 text-xs text-slate-500">{yLabel} vs {xLabel}</p>
      <div className="space-y-2">
        {data.map((row) => (
          <div key={row.name} className="grid grid-cols-6 gap-2 text-xs">
            <p className="col-span-1 truncate font-semibold text-slate-500">{row.name}</p>
            <div className="col-span-5 grid grid-cols-5 gap-2">
              {row.values.map((cell) => (
                <div key={`${row.name}-${cell.label}`} className={`rounded-xl p-2 text-center font-semibold text-white ${colorByDensity(cell.value)}`}>
                  {cell.label}: {cell.value}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default HeatmapCard;
