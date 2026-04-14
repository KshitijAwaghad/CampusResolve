import { useEffect, useMemo, useState } from "react";
import Badge from "./ui/Badge";

function CountdownTimer({ complaint, onExpire }) {
  const endTime = useMemo(() => complaint.createdAt + complaint.slaMinutes * 60 * 1000, [complaint.createdAt, complaint.slaMinutes]);
  const [remaining, setRemaining] = useState(Math.max(0, endTime - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.max(0, endTime - Date.now());
      setRemaining(diff);
      if (diff === 0) {
        clearInterval(timer);
        if (!complaint.escalated && !["Resolved", "Closed"].includes(complaint.status)) {
          onExpire?.(complaint.id);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [complaint.escalated, complaint.id, complaint.status, endTime, onExpire]);

  const min = String(Math.floor(remaining / 60000)).padStart(2, "0");
  const sec = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");

  if (remaining === 0 && complaint.escalated) {
    return <Badge variant="danger">Escalated</Badge>;
  }

  return <Badge variant={remaining < 60000 ? "danger" : "info"}>SLA {min}:{sec}</Badge>;
}

export default CountdownTimer;
