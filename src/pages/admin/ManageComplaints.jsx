import ComplaintCard from "../../components/ComplaintCard";
import Button from "../../components/ui/Button";
import { useComplaints } from "../../context/ComplaintContext";

function ManageComplaints() {
  const { complaints, escalateComplaint, forceCloseComplaint } = useComplaints();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="page-title">Manage Complaints</h2>
        <p className="page-subtitle">Take direct action on escalations and final closure decisions.</p>
      </div>
      <div className="grid gap-4">
        {complaints.map((complaint) => (
          <ComplaintCard
            key={complaint.id}
            complaint={complaint}
            onExpire={escalateComplaint}
            actions={
              <div className="flex gap-2">
                <Button variant="danger" onClick={() => escalateComplaint(complaint.id)}>Escalate</Button>
                <Button variant="secondary" onClick={() => forceCloseComplaint(complaint.id)}>Force Close</Button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default ManageComplaints;
