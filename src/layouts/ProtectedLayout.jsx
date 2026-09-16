import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

/**
 * Guards /app/* routes. No token → login (other browser / cleared session).
 */
const ProtectedLayout = () => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedLayout;
