import { useMemo, useState } from "react";
import { useComplaints } from "../../context/ComplaintContext";
import Select from "../../components/ui/Select";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import ComplaintCard from "../../components/ComplaintCard";
import { useAuth } from "../../context/AuthContext";
import { buildings } from "../../data/mockCategories";

function WardenDashboard() {
  const { complaints, assignComplaint } = useComplaints();
  const { userName, userEmail } = useAuth();
  const [hostel, setHostel] = useState("All");
  const [priority, setPriority] = useState("All");

  const hostelOptions = buildings.filter((building) => building.includes("Hostel"));

  const filtered = useMemo(
    () =>
      complaints.filter((c) => {
        const hostelComplaint = c.locationType?.includes("Hostel") || c.building?.includes("Hostel");
        const buildingOk = hostel === "All" || c.building === hostel;
        const priorityOk = priority === "All" || c.priority === priority;
        return hostelComplaint && buildingOk && priorityOk;
      }),
    [hostel, complaints, priority]
  );

  const alerts = filtered.filter((c) => c.status === "Escalated" || c.priority === "Critical");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="page-title">Warden Dashboard</h2>
        <p className="page-subtitle">Monitor hostel complaints, assign ownership, and act on urgent resident issues.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Select label="Filter by Hostel" value={hostel} onChange={(e) => setHostel(e.target.value)} options={["All", ...hostelOptions]} />
        <Select label="Filter by Priority" value={priority} onChange={(e) => setPriority(e.target.value)} options={["All", "Critical", "High", "Medium", "Low"]} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Hostel Complaints</p><p className="text-3xl font-extrabold">{filtered.length}</p></Card>
        <Card><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Priority Alerts</p><p className="text-3xl font-extrabold text-rose-500">{alerts.length}</p></Card>
        <Card><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Assigned</p><p className="text-3xl font-extrabold">{filtered.filter((c) => c.assignedTo).length}</p></Card>
      </div>

      <div className="grid gap-4">
        {filtered.map((complaint) => (
          <ComplaintCard
            key={complaint.id}
            complaint={complaint}
            actions={
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => assignComplaint(complaint.id, userName || userEmail || "Warden")}>Assign To Me</Button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default WardenDashboard;
