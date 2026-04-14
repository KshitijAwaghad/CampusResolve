import { AlertTriangle } from "lucide-react";
import Badge from "./ui/Badge";

function PriorityBadge({ priority }) {
  const map = {
    Critical: "danger",
    High: "warning",
    Medium: "info",
    Low: "success"
  };

  return (
    <Badge variant={map[priority] || "default"} className="gap-1">
      {priority === "Critical" && <AlertTriangle size={12} />} {priority}
    </Badge>
  );
}

export default PriorityBadge;
