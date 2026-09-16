import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

/** Wrap auth pages — already logged in → dashboard. */
const GuestOnly = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/app/admin-panel" replace />;
  }
  return children;
};

export default GuestOnly;
