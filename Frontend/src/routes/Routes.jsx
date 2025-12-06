import React from "react";
import { Navigate, Route } from "react-router-dom";

export function IsUserRedirect({ user, loggedInPath, children }) {
  // If the user is logged in, navigate to the loggedInPath
  if (user) {
    return <Navigate to={loggedInPath} replace />;
  }
  // Otherwise, render the children (public component)
  return children;
}

export function ProtectedRoute({ user, children }) {
  // If the user is not logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/classroomlogin" replace />;
  }
  // If the user is logged in, render the children (protected component)
  return children;
}
