import { Navigate, Outlet } from "react-router-dom";
import { roleHome } from "../utils/roles";

function ProtectedRoute({ roles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!token || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={roleHome[user.role] || "/login"} replace />;
  return <Outlet />;
}

export default ProtectedRoute;
