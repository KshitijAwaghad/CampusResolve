import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Card from "../ui/Card";

function LineChartCard({ title, data, xKey = "month", yKey = "complaints" }) {
  return (
    <Card>
      <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">{title}</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey={xKey} stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
            <Line type="monotone" dataKey={yKey} stroke="#fb923c" strokeWidth={3} dot={{ r: 4, fill: "#fb923c" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default LineChartCard;
