import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function DashboardHome() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "ADMIN") {
    return <Navigate to="/dashboard/summary" replace />;
  }

  if (user.role === "MANAGER") {
    return <Navigate to="/dashboard/tasks/assigned" replace />;
  }

  if (user.role === "EMPLOYEE") {
    return <Navigate to="/dashboard/tasks/upcoming" replace />;
  }

  return null;
}

export default DashboardHome;
