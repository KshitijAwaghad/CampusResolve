import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import { useComplaints } from "../../context/ComplaintContext";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

function StudentDashboard() {
  const { complaints } = useComplaints();
  const { userEmail, userName } = useAuth();
  const myComplaints = complaints.filter(
    (c) => c.createdByEmail === userEmail || (!c.createdByEmail && c.createdBy === userName)
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="page-title">Student Dashboard</h2>
        <p className="page-subtitle">Track your complaints, status, and resolution progress.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Submitted</p><p className="text-3xl font-extrabold">{myComplaints.length}</p></Card>
        <Card><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Open</p><p className="text-3xl font-extrabold">{myComplaints.filter((c) => !["Resolved", "Closed"].includes(c.status)).length}</p></Card>
        <Card><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Resolved</p><p className="text-3xl font-extrabold">{myComplaints.filter((c) => c.status === "Resolved").length}</p></Card>
      </div>
      <div className="flex gap-3">
        <Link to="/student/submit"><Button>Submit Complaint</Button></Link>
        <Link to="/student/complaints"><Button variant="secondary">View Complaints</Button></Link>
      </div>
    </div>
  );
}

export default StudentDashboard;
