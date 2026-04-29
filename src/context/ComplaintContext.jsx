import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { analyzeComplaintWithAI, detectCategory, calculatePriorityScore, deriveBuilding, scoreToPriority } from "../utils/ai";
import { supabase } from "../utils/supabaseClient";

const ComplaintContext = createContext(null);
const NOTIFICATION_KEY = "cr-notifications";

function createTimelineEntry(label) {
  return { label, at: Date.now() };
}

function mapToCamelCase(item) {
  return {
    ...item,
    locationType: item.location_type,
    specificLocation: item.specific_location,
    priorityScore: item.priority_score,
    assignedTo: item.assigned_to,
    createdBy: item.created_by,
    createdByEmail: item.created_by_email,
    createdAt: item.created_at,
    resolutionProof: item.resolution_proof,
    timeline: typeof item.timeline === "string" ? JSON.parse(item.timeline) : item.timeline || [],
  };
}

export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem(NOTIFICATION_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const fetchComplaints = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("complaints").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      setComplaints(data.map(mapToCamelCase));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();

    const channel = supabase
      .channel("public-complaints")
      .on("postgres_changes", { event: "*", schema: "public", table: "complaints" }, (payload) => {
        fetchComplaints(); // Keep it simple: refetch on any remote change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  const addComplaint = async (payload) => {
    let aiCategory = "Building";
    let score = 10;
    
    try {
      const aiResult = await analyzeComplaintWithAI(payload.description, payload.locationType);
      aiCategory = aiResult.category;
      score = aiResult.score;
    } catch (e) {
      console.error("AI Analysis failed:", e);
    }
    
    const priority = scoreToPriority(score);

    const timeline = [createTimelineEntry("Submitted")];

    const { data, error } = await supabase
      .from("complaints")
      .insert([
        {
          title: payload.title,
          description: payload.description,
          category: aiCategory,
          location_type: payload.locationType,
          specific_location: payload.specificLocation,
          building: deriveBuilding(payload.locationType, payload.specificLocation),
          priority,
          priority_score: score,
          status: "Submitted",
          created_by: payload.createdBy || "Student",
          created_by_email: payload.createdByEmail || "",
          timeline: timeline,
          image: payload.image || "",
          resolution_proof: "",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase Insert Error:", error);
      throw error;
    }

    if (data) {
      setComplaints((prev) => [mapToCamelCase(data), ...prev]);
      pushNotification(`New complaint submitted: ${data.title}`, "info");
    }
  };

  const updateStatus = async (id, status) => {
    const target = complaints.find((c) => c.id === id);
    if (!target) return;

    const newTimeline = [...target.timeline, createTimelineEntry(status)];

    const { data, error } = await supabase
      .from("complaints")
      .update({ status, timeline: newTimeline })
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setComplaints((prev) => prev.map((item) => (item.id === id ? mapToCamelCase(data) : item)));
      if (status === "Resolved") {
        pushNotification(`Complaint resolved: ${data.title}`, "success");
      }
    }
  };

  const assignComplaint = async (id, assignedTo) => {
    const target = complaints.find((c) => c.id === id);
    if (!target) return;

    const newTimeline = [...target.timeline, createTimelineEntry("Assigned")];

    const { data, error } = await supabase
      .from("complaints")
      .update({ assigned_to: assignedTo, timeline: newTimeline })
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setComplaints((prev) => prev.map((item) => (item.id === id ? mapToCamelCase(data) : item)));
    }
  };

  const setResolutionProof = async (id, proof) => {
    const { data, error } = await supabase
      .from("complaints")
      .update({ resolution_proof: proof })
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setComplaints((prev) => prev.map((item) => (item.id === id ? mapToCamelCase(data) : item)));
    }
  };

  const escalateComplaint = async (id) => {
    const target = complaints.find((c) => c.id === id);
    if (!target || target.escalated || target.status === "Closed") return;

    const newTimeline = [...target.timeline, createTimelineEntry("Escalated")];

    const { data, error } = await supabase
      .from("complaints")
      .update({ status: "Escalated", escalated: true, timeline: newTimeline })
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      pushNotification(`Escalated: ${data.title}`, "alert");
      setComplaints((prev) => prev.map((item) => (item.id === id ? mapToCamelCase(data) : item)));
    }
  };

  const forceCloseComplaint = async (id) => {
    const target = complaints.find((c) => c.id === id);
    if (!target) return;

    const newTimeline = [...target.timeline, createTimelineEntry("Closed")];

    const { data, error } = await supabase
      .from("complaints")
      .update({ status: "Closed", timeline: newTimeline })
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setComplaints((prev) => prev.map((item) => (item.id === id ? mapToCamelCase(data) : item)));
    }
  };

  const value = useMemo(
    () => ({
      complaints,
      notifications,
      loading,
      addComplaint,
      updateStatus,
      assignComplaint,
      escalateComplaint,
      forceCloseComplaint,
      setResolutionProof,
      markNotificationRead,
      detectCategory,
      calculatePriorityScore,
      scoreToPriority,
    }),
    [complaints, notifications, loading]
  );

  return <ComplaintContext.Provider value={value}>{children}</ComplaintContext.Provider>;
}

export function useComplaints() {
  return useContext(ComplaintContext);
}
