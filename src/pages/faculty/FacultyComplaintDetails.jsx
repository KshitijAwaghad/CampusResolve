import { useParams, useNavigate } from "react-router-dom";
import { useComplaints } from "../../context/ComplaintContext";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import PriorityBadge from "../../components/PriorityBadge";
import Button from "../../components/ui/Button";

const stages = ["Submitted", "Assigned", "In Progress", "Resolved", "Closed", "Escalated"];

function FacultyComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { complaints, assignComplaint, updateStatus, setResolutionProof } = useComplaints();
  const { userName } = useAuth();
  
  const complaint = complaints.find((c) => c.id === id);

  if (!complaint) return <p>Complaint not found.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="page-title">Complaint Details</h2>
        <Button variant="outline" onClick={() => navigate("/faculty/dashboard")}>Back to Dashboard</Button>
      </div>

      <Card>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-extrabold">{complaint.title}</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Submitted by: {complaint.createdBy} {complaint.createdByEmail ? `(${complaint.createdByEmail})` : ""}
            </p>
          </div>
          <PriorityBadge priority={complaint.priority} />
        </div>
        <p className="mt-4 text-slate-700 dark:text-slate-300">{complaint.description}</p>
        
        <div className="mt-6 flex flex-wrap gap-2 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
          <div className="w-1/2 md:w-1/4">
            <p className="text-xs font-semibold uppercase text-slate-500">Category</p>
            <p className="font-medium">{complaint.category}</p>
          </div>
          <div className="w-1/2 md:w-1/4">
            <p className="text-xs font-semibold uppercase text-slate-500">Location</p>
            <p className="font-medium">{complaint.building} / {complaint.specificLocation}</p>
          </div>
          <div className="w-1/2 md:w-1/4">
            <p className="text-xs font-semibold uppercase text-slate-500">Status</p>
            <p className="font-medium">{complaint.status}</p>
          </div>
          <div className="w-1/2 md:w-1/4">
            <p className="text-xs font-semibold uppercase text-slate-500">Assigned To</p>
            <p className="font-medium">{complaint.assignedTo || "Unassigned"}</p>
          </div>
        </div>
        
        {complaint.image && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Attached Image</p>
            <img src={complaint.image} alt="Complaint" className="max-h-64 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
          </div>
        )}
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-semibold">Faculty Actions</h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            {!complaint.assignedTo && (
              <Button onClick={() => assignComplaint(complaint.id, userName)}>
                Assign To Me
              </Button>
            )}
            {complaint.status !== "In Progress" && complaint.status !== "Resolved" && complaint.status !== "Closed" && (
              <Button onClick={() => updateStatus(complaint.id, "In Progress")}>
                Mark In Progress
              </Button>
            )}
            {complaint.status !== "Resolved" && complaint.status !== "Closed" && (
               <Button variant="outline" onClick={() => updateStatus(complaint.id, "Resolved")}>
                Mark as Resolved
              </Button>
            )}
          </div>
          
          {(complaint.assignedTo === userName || complaint.status === "Resolved") && (
            <div className="mt-2 border-t border-slate-200 pt-4 dark:border-slate-700">
              <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Resolution Proof</p>
              {!complaint.resolutionProof ? (
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setResolutionProof(complaint.id, reader.result);
                    reader.readAsDataURL(file);
                  }} 
                  className="block w-full text-sm" 
                />
              ) : (
                <div>
                  <img src={complaint.resolutionProof} alt="Resolution Proof" className="max-h-48 rounded-lg object-cover border border-emerald-200 dark:border-emerald-800" />
                  {complaint.status !== "Closed" && (
                     <Button variant="danger" className="mt-2 text-xs py-1 px-2" onClick={() => setResolutionProof(complaint.id, "")}>
                       Remove Proof
                     </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-semibold">Complaint Timeline</h3>
        <div className="space-y-4">
          {stages.map((stage, idx) => {
            const hit = complaint.timeline.some((t) => t.label === stage);
            return (
              <div key={stage} className="flex items-start gap-3">
                <div className={`mt-1 h-3 w-3 rounded-full ${hit ? "bg-brand-600" : "bg-slate-300 dark:bg-slate-600"}`} />
                <div>
                  <p className={hit ? "font-semibold" : "text-slate-500"}>{stage}</p>
                  {idx < stages.length - 1 && <div className="ml-1 mt-1 h-6 w-px bg-slate-300 dark:bg-slate-600" />}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export default FacultyComplaintDetails;
