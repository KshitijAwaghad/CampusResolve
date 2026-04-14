import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { mockComplaints } from "../data/mockComplaints";
import { detectCategory, calculatePriorityScore, deriveBuilding, getSlaMinutes, scoreToPriority } from "../utils/ai";

const ComplaintContext = createContext(null);

const STORAGE_KEY = "cr-complaints";
const NOTIFICATION_KEY = "cr-notifications";

function createTimelineEntry(label) {
  return { label, at: Date.now() };
}

export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : mockComplaints;
  });

  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem(NOTIFICATION_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const pushNotification = (message, type = "info") => {
    const item = { id: crypto.randomUUID(), message, type, createdAt: Date.now(), read: false };
    setNotifications((prev) => [item, ...prev].slice(0, 25));
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== item.id || n.read));
    }, 15000);
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const addComplaint = (payload) => {
    const aiCategory = detectCategory(payload.description, payload.locationType);
    const score = calculatePriorityScore({
      category: aiCategory,
      description: payload.description,
      locationType: payload.locationType
    });
    const priority = scoreToPriority(score);
    const slaMinutes = getSlaMinutes(priority);

    const complaint = {
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: payload.title,
      description: payload.description,
      category: aiCategory,
      locationType: payload.locationType,
      specificLocation: payload.specificLocation,
      building: deriveBuilding(payload.locationType, payload.specificLocation),
      priority,
      priorityScore: score,
      status: "Submitted",
      assignedTo: "",
      createdBy: payload.createdBy || "Student",
      createdAt: Date.now(),
      slaMinutes,
      escalated: false,
      timeline: [createTimelineEntry("Submitted")],
      image: payload.image || "",
      resolutionProof: ""
    };

    setComplaints((prev) => [complaint, ...prev]);
    pushNotification(`New complaint submitted: ${complaint.title}`, "info");
  };

  const updateStatus = (id, status) => {
    setComplaints((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, status, timeline: [...item.timeline, createTimelineEntry(status)] };
        if (status === "Resolved") {
          pushNotification(`Complaint resolved: ${item.title}`, "success");
        }
        return updated;
      })
    );
  };

  const assignComplaint = (id, assignedTo) => {
    setComplaints((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, assignedTo, timeline: [...item.timeline, createTimelineEntry("Assigned")] }
          : item
      )
    );
  };

  const setResolutionProof = (id, proof) => {
    setComplaints((prev) => prev.map((item) => (item.id === id ? { ...item, resolutionProof: proof } : item)));
  };

  const escalateComplaint = (id) => {
    setComplaints((prev) =>
      prev.map((item) => {
        if (item.id !== id || item.escalated || item.status === "Closed") return item;
        pushNotification(`Escalated: ${item.title}`, "alert");
        return {
          ...item,
          status: "Escalated",
          escalated: true,
          timeline: [...item.timeline, createTimelineEntry("Escalated")]
        };
      })
    );
  };

  const forceCloseComplaint = (id) => {
    setComplaints((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "Closed", timeline: [...item.timeline, createTimelineEntry("Closed")] }
          : item
      )
    );
  };

  const value = useMemo(
    () => ({
      complaints,
      notifications,
      addComplaint,
      updateStatus,
      assignComplaint,
      escalateComplaint,
      forceCloseComplaint,
      setResolutionProof,
      markNotificationRead,
      detectCategory,
      calculatePriorityScore,
      scoreToPriority
    }),
    [complaints, notifications]
  );

  return <ComplaintContext.Provider value={value}>{children}</ComplaintContext.Provider>;
}

export function useComplaints() {
  return useContext(ComplaintContext);
}
