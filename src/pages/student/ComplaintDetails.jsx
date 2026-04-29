import { useParams } from "react-router-dom";
import { useComplaints } from "../../context/ComplaintContext";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import PriorityBadge from "../../components/PriorityBadge";

const stages = ["Submitted", "Assigned", "In Progress", "Resolved", "Closed", "Escalated"];

function ComplaintDetails() {
  const { id } = useParams();
  const { complaints } = useComplaints();
  const { userEmail, userName } = useAuth();
  const complaint = complaints.find((c) => c.id === id);

  if (!complaint) return <p>Complaint not found.</p>;
  const isOwner = complaint.createdByEmail === userEmail || (!complaint.createdByEmail && complaint.createdBy === userName);
  if (!isOwner) return <p>You do not have access to this complaint.</p>;

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="page-title">{complaint.title}</h2>
        <p className="mt-2 text-slate-500">{complaint.description}</p>
        <div className="mt-3 flex items-center gap-3">
          <PriorityBadge priority={complaint.priority} />
          <p className="text-sm">Status: {complaint.status}</p>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-semibold">Complaint Timeline</h3>
        <div className="space-y-4">
          {stages.map((stage, idx) => {
            const hit = complaint.timeline.some((t) => t.label === stage);
            return (
              <div key={stage} className="flex items-start gap-3">
                <div className={`mt-1 h-3 w-3 rounded-full ${hit ? "bg-brand-600" : "bg-slate-300"}`} />
                <div>
                  <p className={hit ? "font-semibold" : "text-slate-500"}>{stage}</p>
                  {idx < stages.length - 1 && <div className="ml-1 mt-1 h-6 w-px bg-slate-300" />}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export default ComplaintDetails;
