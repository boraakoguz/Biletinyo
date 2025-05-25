import { Navigate, useLocation } from "react-router-dom";

// AuthRoute component to protect routes that require authentication
const AuthRoute = ({ children, requireOrganizer, requireAdmin = false }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  // If no token or user data exists, redirect to login
  if (!token || !userStr) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If organizer role is required, check user type
  if (requireOrganizer) {
    try {
      const user = JSON.parse(userStr);
      if (user.user_type !== 1) {
        // Redirect non-organizers to main page
        return <Navigate to="/" replace />;
      }
    } catch (e) {
      // If JSON parsing fails, redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }
  if (requireAdmin) {
    try {
      const user = JSON.parse(userStr);
      if (user.user_type !== 2) {
        // Redirect non-organizers to main page
        return <Navigate to="/" replace />;
      }
    } catch (e) {
      // If JSON parsing fails, redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // Render children for authenticated users
  return children;
};

export default AuthRoute;
