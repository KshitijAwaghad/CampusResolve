import Card from "./ui/Card";
import PriorityBadge from "./PriorityBadge";
import CountdownTimer from "./CountdownTimer";
import Badge from "./ui/Badge";

function ComplaintCard({ complaint, onExpire, actions }) {
  const statusVariant =
    complaint.status === "Resolved" || complaint.status === "Closed"
      ? "success"
      : complaint.status === "Escalated"
        ? "danger"
        : "warning";

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-extrabold tracking-tight">{complaint.title}</p>
          <p className="text-xs font-medium text-slate-500">{complaint.id} | {complaint.specificLocation}</p>
        </div>
        <PriorityBadge priority={complaint.priority} />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{complaint.description}</p>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={statusVariant}>{complaint.status}</Badge>
        <CountdownTimer complaint={complaint} onExpire={onExpire} />
        {complaint.assignedTo && <Badge>{complaint.assignedTo}</Badge>}
      </div>
      {actions && <div className="pt-1">{actions}</div>}
    </Card>
  );
}

export default ComplaintCard;
