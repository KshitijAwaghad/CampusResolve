import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import Card from "../ui/Card";

function BarChartCard({ title, data, xKey = "name", yKey = "value" }) {
  return (
    <Card>
      <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">{title}</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey={xKey} stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
            <Bar dataKey={yKey} fill="#0d95ff" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default BarChartCard;
