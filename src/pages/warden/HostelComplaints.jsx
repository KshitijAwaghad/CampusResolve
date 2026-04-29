import { useState } from "react";
import ComplaintCard from "../../components/ComplaintCard";
import { useComplaints } from "../../context/ComplaintContext";
import Button from "../../components/ui/Button";

function HostelComplaints() {
  const { complaints, updateStatus, setResolutionProof } = useComplaints();
  const [proofMap, setProofMap] = useState({});

  const assigned = complaints.filter(
    (c) => (c.locationType?.includes("Hostel") || c.building?.includes("Hostel")) && c.assignedTo
  );

  const uploadProof = (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProofMap((prev) => ({ ...prev, [id]: reader.result }));
      setResolutionProof(id, reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="page-title">Hostel Complaints</h2>
        <p className="page-subtitle">Track assigned hostel issues, update statuses, and upload resolution proof.</p>
      </div>
      <div className="grid gap-4">
        {assigned.map((complaint) => (
          <ComplaintCard
            key={complaint.id}
            complaint={complaint}
            actions={
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => updateStatus(complaint.id, "In Progress")}>In Progress</Button>
                  <Button onClick={() => updateStatus(complaint.id, "Resolved")}>Resolved</Button>
                </div>
                <input type="file" accept="image/*" onChange={(e) => uploadProof(complaint.id, e.target.files?.[0])} className="text-sm" />
                {proofMap[complaint.id] && <img src={proofMap[complaint.id]} alt="proof" className="max-h-32 rounded-lg" />}
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default HostelComplaints;
