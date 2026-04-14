import Card from "../../components/ui/Card";
import { useComplaints } from "../../context/ComplaintContext";
import ComplaintCard from "../../components/ComplaintCard";

function FacultyDashboard() {
  const { complaints, escalateComplaint } = useComplaints();
  const recent = complaints.slice(0, 5);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="page-title">Faculty Dashboard</h2>
        <p className="page-subtitle">Get quick visibility into campus incidents and live status.</p>
      </div>
      <Card><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Visible Campus Complaints</p><p className="text-3xl font-extrabold">{complaints.length}</p></Card>
      <div className="grid gap-4">
        {recent.map((complaint) => <ComplaintCard key={complaint.id} complaint={complaint} onExpire={escalateComplaint} />)}
      </div>
    </div>
  );
}

export default FacultyDashboard;
