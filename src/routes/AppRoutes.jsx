import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "../pages/public/Landing";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import NotFound from "../pages/public/NotFound";
import StudentDashboard from "../pages/student/StudentDashboard";
import SubmitComplaint from "../pages/student/SubmitComplaint";
import MyComplaints from "../pages/student/MyComplaints";
import ComplaintDetails from "../pages/student/ComplaintDetails";
import FacultyDashboard from "../pages/faculty/FacultyDashboard";
import FacultyComplaintDetails from "../pages/faculty/FacultyComplaintDetails";
import WardenDashboard from "../pages/warden/WardenDashboard";
import HostelComplaints from "../pages/warden/HostelComplaints";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageComplaints from "../pages/admin/ManageComplaints";
import UserManagement from "../pages/admin/UserManagement";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={["student", "faculty", "warden", "admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/submit" element={<ProtectedRoute allowedRoles={["student"]}><SubmitComplaint /></ProtectedRoute>} />
        <Route path="/student/complaints" element={<ProtectedRoute allowedRoles={["student"]}><MyComplaints /></ProtectedRoute>} />
        <Route path="/student/complaints/:id" element={<ProtectedRoute allowedRoles={["student"]}><ComplaintDetails /></ProtectedRoute>} />

        <Route path="/faculty/dashboard" element={<ProtectedRoute allowedRoles={["faculty"]}><FacultyDashboard /></ProtectedRoute>} />
        <Route path="/faculty/complaints/:id" element={<ProtectedRoute allowedRoles={["faculty"]}><FacultyComplaintDetails /></ProtectedRoute>} />
        <Route path="/warden/dashboard" element={<ProtectedRoute allowedRoles={["warden"]}><WardenDashboard /></ProtectedRoute>} />
        <Route path="/warden/hostels" element={<ProtectedRoute allowedRoles={["warden"]}><HostelComplaints /></ProtectedRoute>} />

        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/manage" element={<ProtectedRoute allowedRoles={["admin"]}><ManageComplaints /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><UserManagement /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<NotFound />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
