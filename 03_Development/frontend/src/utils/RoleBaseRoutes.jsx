import React from "react";
import { Navigate } from "react-router-dom";

const RoleBaseRoutes = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("accountRole");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RoleBaseRoutes;
