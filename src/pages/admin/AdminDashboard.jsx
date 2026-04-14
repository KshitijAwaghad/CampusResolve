import Card from "../../components/ui/Card";
import PieChartCard from "../../components/charts/PieChartCard";
import BarChartCard from "../../components/charts/BarChartCard";
import LineChartCard from "../../components/charts/LineChartCard";
import HeatmapCard from "../../components/charts/HeatmapCard";
import { useComplaints } from "../../context/ComplaintContext";
import { mockAnalytics } from "../../data/mockAnalytics";
import { AlertTriangle } from "lucide-react";

function AdminDashboard() {
  const { complaints } = useComplaints();

  const pending = complaints.filter((c) => !["Resolved", "Closed"].includes(c.status)).length;
  const resolved = complaints.filter((c) => ["Resolved", "Closed"].includes(c.status)).length;

  const pieData = [
    { name: "Pending", value: pending },
    { name: "Resolved", value: resolved }
  ];

  const categoryMap = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  const buildings = ["Block A", "Block B", "Main Library", "Hostel 1", "Hostel 2"];
  const severities = ["Critical", "High", "Medium", "Low", "Escalated"];
  const heatData = buildings.map((b) => ({
    name: b,
    values: severities.map((s) => ({
      label: s.slice(0, 3),
      value: complaints.filter((c) => c.building === b && (s === "Escalated" ? c.status === "Escalated" : c.priority === s)).length
    }))
  }));

  const criticalAlerts = complaints.filter((c) => c.priority === "Critical" || c.status === "Escalated");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="page-title">Admin Analytics Dashboard</h2>
        <p className="page-subtitle">Live metrics, category trends, and critical incident intelligence.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Complaints</p><p className="text-3xl font-extrabold">{complaints.length}</p></Card>
        <Card><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending</p><p className="text-3xl font-extrabold">{pending}</p></Card>
        <Card><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Resolved</p><p className="text-3xl font-extrabold">{resolved}</p></Card>
        <Card><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Escalated</p><p className="text-3xl font-extrabold text-rose-500">{complaints.filter((c) => c.status === "Escalated").length}</p></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PieChartCard title="Pending vs Resolved" data={pieData} />
        <BarChartCard title="Category Distribution" data={barData} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LineChartCard title="Monthly Complaint Trend" data={mockAnalytics.monthlyTrend} />
        <HeatmapCard title="Severity Heat Map" data={heatData} xLabel="Building" yLabel="Severity" />
      </div>

      <Card>
        <div className="mb-3 flex items-center gap-2 text-rose-500">
          <AlertTriangle className="animate-pulse" />
          <h3 className="text-lg font-semibold">Critical Issue Alerts</h3>
        </div>
        <div className="space-y-2">
          {criticalAlerts.map((c) => (
            <div key={c.id} className="rounded-xl border border-rose-300 bg-rose-100 p-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
              {c.id} | {c.title} | {c.status}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default AdminDashboard;
