import { Link } from "react-router-dom";
import ComplaintCard from "../../components/ComplaintCard";
import { useComplaints } from "../../context/ComplaintContext";

function MyComplaints() {
  const { complaints, escalateComplaint } = useComplaints();
  const myComplaints = complaints.filter((c) => c.createdBy === "Student" || c.createdBy === "Aarav Sharma");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="page-title">My Complaints</h2>
        <p className="page-subtitle">Monitor status updates, priority changes, and SLA timers.</p>
      </div>
      <div className="grid gap-4">
        {myComplaints.map((complaint) => (
          <div key={complaint.id}>
            <ComplaintCard
              complaint={complaint}
              onExpire={escalateComplaint}
              actions={<Link to={`/student/complaints/${complaint.id}`} className="text-sm text-brand-600">View Details</Link>}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyComplaints;
