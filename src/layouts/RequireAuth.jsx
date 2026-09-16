import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

/** Wrap any protected page — no token → login. */
const RequireAuth = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return children;
};

export default RequireAuth;
