import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

/**
 * Auth screens (/auth/*). Already logged in → dashboard.
 */
const AuthLayout = () => {
  if (isAuthenticated()) {
    return <Navigate to="/app/admin-panel" replace />;
  }

  return <Outlet />;
};

export default AuthLayout;
