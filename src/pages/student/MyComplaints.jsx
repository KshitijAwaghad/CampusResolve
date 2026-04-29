import { Link } from "react-router-dom";
import ComplaintCard from "../../components/ComplaintCard";
import { useComplaints } from "../../context/ComplaintContext";
import { useAuth } from "../../context/AuthContext";

function MyComplaints() {
  const { complaints } = useComplaints();
  const { userEmail, userName } = useAuth();
  const myComplaints = complaints.filter(
    (c) => c.createdByEmail === userEmail || (!c.createdByEmail && c.createdBy === userName)
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="page-title">My Complaints</h2>
        <p className="page-subtitle">Monitor status updates, priority changes, and complaint progress.</p>
      </div>
      <div className="grid gap-4">
        {myComplaints.map((complaint) => (
          <div key={complaint.id}>
            <ComplaintCard
              complaint={complaint}
              actions={<Link to={`/student/complaints/${complaint.id}`} className="text-sm text-brand-600">View Details</Link>}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyComplaints;
