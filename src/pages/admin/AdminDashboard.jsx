import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import PieChartCard from "../../components/charts/PieChartCard";
import BarChartCard from "../../components/charts/BarChartCard";
import LineChartCard from "../../components/charts/LineChartCard";
import HeatmapCard from "../../components/charts/HeatmapCard";
import { useComplaints } from "../../context/ComplaintContext";
import { AlertTriangle, Clock } from "lucide-react";

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

  // Dynamic Buildings for Heatmap
  const buildings = Array.from(new Set(complaints.map((c) => c.building).filter(Boolean)));
  const severities = ["Critical", "High", "Medium", "Low", "Escalated"];
  const heatData = buildings.map((b) => ({
    name: b,
    values: severities.map((s) => ({
      label: s.slice(0, 3),
      value: complaints.filter((c) => c.building === b && (s === "Escalated" ? c.status === "Escalated" : c.priority === s)).length
    }))
  }));

  // Dynamic Monthly Trend
  const monthlyTrendMap = complaints.reduce((acc, c) => {
    const date = new Date(c.createdAt);
    if (!isNaN(date.getTime())) {
      const month = date.toLocaleString("default", { month: "short" });
      acc[month] = (acc[month] || 0) + 1;
    }
    return acc;
  }, {});

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toLocaleString("default", { month: "short" });
  }).reverse();

  const monthlyTrendData = last6Months.map((month) => ({
    month,
    complaints: monthlyTrendMap[month] || 0,
  }));

  // Average Resolution Time Calculation
  let totalResolveTime = 0;
  let resolvedCount = 0;

  complaints.forEach((c) => {
    if (c.status === "Resolved" || c.status === "Closed") {
      const submittedEvent = c.timeline.find((t) => t.label === "Submitted");
      const resolvedEvent = c.timeline.find((t) => t.label === "Resolved" || t.label === "Closed");
      
      if (submittedEvent && resolvedEvent && submittedEvent.at && resolvedEvent.at) {
        const start = new Date(submittedEvent.at).getTime();
        const end = new Date(resolvedEvent.at).getTime();
        if (!isNaN(start) && !isNaN(end) && end > start) {
          totalResolveTime += (end - start);
          resolvedCount++;
        }
      }
    }
  });

  const avgResolveTimeMs = resolvedCount > 0 ? totalResolveTime / resolvedCount : 0;
  let avgResolveText = "N/A";
  if (avgResolveTimeMs > 0) {
    const hours = avgResolveTimeMs / (1000 * 60 * 60);
    if (hours > 24) {
      avgResolveText = `${(hours / 24).toFixed(1)} Days`;
    } else {
      avgResolveText = `${hours.toFixed(1)} Hours`;
    }
  }

  const criticalAlerts = complaints.filter((c) => c.priority === "Critical" || c.status === "Escalated");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="page-title">Admin Analytics Dashboard</h2>
        <p className="page-subtitle">Live metrics, category trends, and critical incident intelligence.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        <Card><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total</p><p className="text-3xl font-extrabold">{complaints.length}</p></Card>
        <Card><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending</p><p className="text-3xl font-extrabold">{pending}</p></Card>
        <Card><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Resolved</p><p className="text-3xl font-extrabold">{resolved}</p></Card>
        <Card><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Escalated</p><p className="text-3xl font-extrabold text-rose-500">{complaints.filter((c) => c.status === "Escalated").length}</p></Card>
        <Card className="flex flex-col justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Resolve Time</p>
          <div className="flex items-center gap-2 text-brand-600">
            <Clock className="h-5 w-5" />
            <p className="text-2xl font-extrabold">{avgResolveText}</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PieChartCard title="Pending vs Resolved" data={pieData} />
        <BarChartCard title="Category Distribution" data={barData} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LineChartCard title="Monthly Complaint Trend" data={monthlyTrendData} />
        <HeatmapCard title="Severity Heat Map" data={heatData} xLabel="Building" yLabel="Severity" />
      </div>

      <Card>
        <div className="mb-3 flex items-center gap-2 text-rose-500">
          <AlertTriangle className="animate-pulse" />
          <h3 className="text-lg font-semibold">Critical Issue Alerts</h3>
        </div>
        <div className="space-y-2">
          {criticalAlerts.length > 0 ? criticalAlerts.map((c) => (
            <Link 
              to="/admin/manage" 
              key={c.id} 
              className="block rounded-xl border border-rose-300 bg-rose-100 p-3 text-sm text-rose-700 hover:bg-rose-200 transition-colors dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{c.title}</span>
                <span className="text-xs font-bold px-2 py-1 bg-rose-200 dark:bg-rose-800 rounded-md">View details ➔</span>
              </div>
              <div className="mt-1 flex items-center gap-2 opacity-80 text-xs">
                <span>ID: {c.id.slice(0, 8)}...</span>
                <span>•</span>
                <span>Status: {c.status}</span>
                <span>•</span>
                <span>Location: {c.building}</span>
              </div>
            </Link>
          )) : (
            <p className="text-slate-500 italic">No critical issues or escalations at the moment. Good job!</p>
          )}
        </div>
      </Card>
    </div>
  );
}

export default AdminDashboard;
