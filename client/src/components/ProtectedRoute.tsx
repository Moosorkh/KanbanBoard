import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import auth from "../utils/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const isLoggedIn = auth.loggedIn();

  console.log("Protected Route Check:", {
    isLoggedIn,
    currentPath: location.pathname,
    token: auth.getToken(),
  });

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
