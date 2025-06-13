import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";


import { ROUTES } from "../app/routes";
import type { PrivateRouteProps } from '../types/auth';
import { useAuth } from "../features/auth/store/customHooks";

/**
 * Props for the PrivateRoute component
 * @property {React.ReactNode} children - Child components to render if authenticated
 * @property {Role[]} allowedRoles - Optional list of roles allowed to access this route
 * @property {boolean} requireAuth - Whether authentication is required (default: true)
 * @property {boolean} isNested - Whether this route is nested inside another PrivateRoute (default: false)
 */

/**
 * PrivateRoute Component
 * Protects routes by requiring authentication and optionally specific roles
 * Redirects to login page if not authenticated or dashboard if not authorized
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
  requireAuth = true,
  isNested = false,
}) => {
  const { isAuthenticated, user, loading, selectedRole } = useAuth();
  const location = useLocation();

  // Add immediate prop logging
  console.log("PrivateRoute props received:", {
    allowedRoles,
    requireAuth,
    isNested,
    path: location.pathname,
  });

  // Log authentication state for debugging
  useEffect(() => {
    console.log("PrivateRoute - Auth State:", {
      isAuthenticated,
      user,
      loading,
      currentPath: location.pathname,
      allowedRoles,
      isNested,
    });
  }, [
    isAuthenticated,
    user,
    loading,
    location.pathname,
    allowedRoles,
    isNested,
  ]);

  // Log access attempts for security monitoring
  useEffect(() => {
    if (!isAuthenticated && requireAuth) {
      console.info(`Unauthorized access attempt to ${location.pathname}`);
    }

    if (
      allowedRoles &&
      user &&
      selectedRole &&
      !allowedRoles.includes(selectedRole)
    ) {
      console.warn(
        `User ${user.name} with role ${selectedRole} attempted to access restricted route ${location.pathname}`
      );
    }
  }, [isAuthenticated, user, location.pathname, allowedRoles, requireAuth]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Skip authentication check if this is a nested route and the parent already checked
  if (!isNested) {
    // Redirect to login if not authenticated
    if (!isAuthenticated && requireAuth) {
      console.log("Not authenticated, redirecting to faculty login");
      return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }
  }

  // Always check role permissions
  if (
    allowedRoles &&
    user &&
    selectedRole &&
    !allowedRoles.includes(selectedRole)
  ) {
    console.log(
      `User role ${selectedRole} not allowed, redirecting to dashboard`
    );
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // Render children if authenticated and authorized
  console.log("Rendering protected content for:", user?.name);
  console.log(children);
  return <>{children}</>;
};
