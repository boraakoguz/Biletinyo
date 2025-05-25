import { Navigate, useLocation } from "react-router-dom";

const AuthRoute = ({ children, requireOrganizer, requireAdmin = false }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireOrganizer) {
    try {
      const user = JSON.parse(userStr);
      if (user.user_type !== 1) {
        return <Navigate to="/" replace />;
      }
    } catch (e) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }
  if (requireAdmin) {
    try {
      const user = JSON.parse(userStr);
      if (user.user_type !== 2) {
        return <Navigate to="/" replace />;
      }
    } catch (e) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default AuthRoute;
