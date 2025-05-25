import React from "react";
import { Navigate } from "react-router-dom";
import MainPage from "./MainPage";

export default function HomeRedirect() {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);

      if (user.user_type === 2) {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (user.user_type === 1) {
        return <Navigate to="/organizer/dashboard" replace />;
      }
    } catch (err) {}
  }

  return <MainPage />;
}
