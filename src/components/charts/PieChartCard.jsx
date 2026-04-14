import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Card from "../ui/Card";

const COLORS = ["#0d95ff", "#22d3ee", "#97f22d", "#fb923c"];

function PieChartCard({ title, data }) {
  return (
    <Card>
      <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">{title}</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={85}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default PieChartCard;
