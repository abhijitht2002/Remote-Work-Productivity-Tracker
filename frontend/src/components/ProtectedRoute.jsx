import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * roleRequired: string or array of strings, allowed roles for the route
 */
const ProtectedRoute = ({ roleRequired }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // User not logged in
  if (!user) return <Navigate to="/login" replace />;

  // If multiple roles allowed
  const allowedRoles = Array.isArray(roleRequired)
    ? roleRequired
    : [roleRequired];

  // User role not allowed
  if (roleRequired && !allowedRoles.includes(user.role))
    return <Navigate to="/dashboard" replace />;

  // Authorized
  return <Outlet />;
};

export default ProtectedRoute;
