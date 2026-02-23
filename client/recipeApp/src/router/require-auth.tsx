import { Navigate, Outlet, useLocation } from "react-router-dom";
import { readToken } from "../data-access/token.storage";

export function RequireAuth() {
  const token = readToken();
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
