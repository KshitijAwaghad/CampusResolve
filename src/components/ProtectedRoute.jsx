import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRoles, children }) {
  const { role } = useAuth();
  const location = useLocation();

  if (!role) return <Navigate to="/" replace state={{ from: location }} />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute;
