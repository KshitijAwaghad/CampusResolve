import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { useComplaints } from "../../context/ComplaintContext";
import ComplaintCard from "../../components/ComplaintCard";

function FacultyDashboard() {
  const { complaints } = useComplaints();
  const navigate = useNavigate();
  const [priority, setPriority] = useState("All");

  // Faculty should only see non-Hostel issues (academic/building issues)
  const activeComplaints = useMemo(
    () =>
      complaints.filter((c) => {
        const facultyComplaint = c.status !== "Closed" && c.category !== "Hostel" && !c.locationType?.includes("Hostel");
        const priorityOk = priority === "All" || c.priority === priority;
        return facultyComplaint && priorityOk;
      }),
    [complaints, priority]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Faculty Dashboard</h2>
        <p className="page-subtitle mt-1">Manage and resolve campus incidents.</p>
      </div>

      <div className="max-w-sm">
        <Select
          label="Filter by Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          options={["All", "Critical", "High", "Medium", "Low"]}
        />
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Complaints</p>
          <p className="text-3xl font-extrabold">{activeComplaints.length}</p>
        </Card>
        <Card>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Campus Incidents</p>
          <p className="text-3xl font-extrabold">{complaints.length}</p>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Complaint Feed</h3>
        <div className="grid gap-4">
          {activeComplaints.map((complaint) => (
            <ComplaintCard 
              key={complaint.id} 
              complaint={complaint} 
              actions={
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate(`/faculty/complaints/${complaint.id}`)}>
                  View Details & Manage
                </Button>
              }
            />
          ))}
          {activeComplaints.length === 0 && (
            <p className="text-slate-500 italic">No active complaints at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;
