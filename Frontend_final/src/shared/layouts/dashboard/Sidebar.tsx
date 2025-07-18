import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  UserCircle,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Wallet,
  History,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileDown,
  Download,
} from "lucide-react";
import { useAuth } from "../../../features/auth/store/customHooks";
import { ROUTES } from "../../../app/routes";
import type { Roles } from "../../../types/Roles";

export const Sidebar = () => {
  const location = useLocation();
  const { user, selectedRole } = useAuth();

  // Sidebar toggle state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isScholarshipOpen, setIsScholarshipOpen] = useState(
    location.pathname.startsWith(ROUTES.SCHOLARSHIP)
  );

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleScholarship = () => {
    setIsScholarshipOpen(!isScholarshipOpen);
  };

  // Update scholarship dropdown state when route changes
  useEffect(() => {
    setIsScholarshipOpen(location.pathname.startsWith(ROUTES.SCHOLARSHIP));
  }, [location.pathname]);

  // FIX: Refine active state for light mode sidebar items for better contrast
  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD) {
      // Adjusted active state to use purple accent with stronger text
      return location.pathname === ROUTES.DASHBOARD ? "bg-purple-600 text-white" : "";
    }
    return location.pathname.startsWith(path) ? "bg-purple-600 text-white" : "";
  };
  const roles: Role[] | null =
    Array.isArray(user?.roles) && user.roles.length > 0 ? user.roles : null;

  // Role-based access control
  const isStudent = !roles || roles.length === 0;
  // Access control based on selectedRole
  const allowedRolesForStudents = ["FAC", "HOD", "AD", "DEAN", "AC"];
  const allowedRolesForScholarships = ["FAC", "HOD", "AD", "DEAN"];

  const canAccessMyStudents =
    selectedRole !== null && allowedRolesForStudents.includes(selectedRole);
  const canAccessDepartmentFaculty = selectedRole === "HOD";
  const canAccessScholarships =
    selectedRole !== null && allowedRolesForScholarships.includes(selectedRole);
  const canAccessExport = selectedRole === "AC";

  return (
    <div
      className={`bg-white dark:bg-gray-800 border-r dark:border-gray-700 min-h-screen transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex justify-between items-center p-4">
        {!isCollapsed && (
          <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-2">
            <Home className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span className="text-purple-600 dark:text-purple-400 font-medium text-sm">
              National Institute Of Technology, Srinagar
            </span>
          </Link>
        )}
        {isCollapsed && (
          <Link to={ROUTES.DASHBOARD} className="mx-auto">
            <Home className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>

      <nav className="mt-8 px-4 flex-1 space-y-2">
        {/* Dashboard */}
        <Link
          to={ROUTES.DASHBOARD}
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-2"
          } p-3 rounded-lg ${
            isActive(ROUTES.DASHBOARD)
              ? "bg-purple-600 text-white dark:bg-blue-900" // Light mode active bg and text
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          title="Home"
        >
          <Home className="w-5 h-5" />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>

        {/* Profile */}
        <Link
          to={ROUTES.MY_PROFILE}
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-2"
          } p-3 rounded-lg ${
            isActive(ROUTES.MY_PROFILE)
              ? "bg-purple-600 text-white dark:bg-blue-900" // Light mode active bg and text
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          title="My Profile"
        >
          <UserCircle className="w-5 h-5" />
          {!isCollapsed && <span>My Profile</span>}
        </Link>

        {/* My Students */}
        {canAccessMyStudents && (
          <Link
            to={ROUTES.MY_STUDENTS}
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "space-x-2"
            } p-3 rounded-lg ${
              isActive(ROUTES.MY_STUDENTS)
                ? "bg-purple-600 text-white dark:bg-blue-900" // Light mode active bg and text
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            title="My Students"
          >
            <GraduationCap className="w-5 h-5" />
            {!isCollapsed && (
              <span>
                {selectedRole === "HOD"
                  ? "Department Students"
                  : selectedRole === "FAC"
                  ? "My Students"
                  : "Phd Students"}
              </span>
            )}
          </Link>
        )}
        {/* Department Faculty Management */}
        {canAccessDepartmentFaculty && (
          <Link
            to={ROUTES.DEPARTMENT_FACULTY}
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "space-x-2"
            } p-3 rounded-lg ${
              isActive(ROUTES.DEPARTMENT_FACULTY)
                ? "bg-purple-600 text-white dark:bg-blue-900" // Light mode active bg and text
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            title="Department Faculty"
          >
            <Users className="w-5 h-5" />
            {!isCollapsed && <span>Department Staff</span>}
          </Link>
        )}

        {/* Scholarship Section */}
        {canAccessScholarships && (
          <div className="space-y-1">
            <div className="flex items-center">
              <Link
                to={ROUTES.SCHOLARSHIP}
                className={`flex-1 flex items-center p-3 rounded-lg ${
                  isActive(ROUTES.SCHOLARSHIP)
                    ? "bg-purple-600 text-white dark:bg-blue-900" // Light mode active bg and text
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Wallet className="w-5 h-5" />
                {!isCollapsed && <span className="ml-2">Scholarship</span>}
              </Link>
              {!isCollapsed && (
                <button
                  onClick={toggleScholarship}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isScholarshipOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
            {isScholarshipOpen && !isCollapsed && (
              <div className="ml-4 space-y-1">
                <Link
                  to={ROUTES.APPROVE_SCHOLARSHIP}
                  className={`flex items-center p-2 rounded-lg ${
                    isActive(ROUTES.APPROVE_SCHOLARSHIP)
                      ? "bg-purple-600 text-white dark:bg-blue-900" // Light mode active bg and text
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="ml-2">Approve Scholarship</span>
                </Link>
                <Link
                  to={ROUTES.SCHOLARSHIP_MANAGEMENT}
                  className={`flex items-center p-2 rounded-lg ${
                    isActive(ROUTES.SCHOLARSHIP_MANAGEMENT)
                      ? "bg-purple-600 text-white dark:bg-blue-900" // Light mode active bg and text
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span className="ml-2">Scholarship Management</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Export Section for AC role */}
        {canAccessExport && (
          <Link
            to={ROUTES.EXPORT}
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "space-x-2"
            } p-3 rounded-lg ${
              isActive(ROUTES.EXPORT)
                ? "bg-purple-600 text-white dark:bg-blue-900" // Light mode active bg and text
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            title="Export"
          >
            <Download className="w-5 h-5" />
            {!isCollapsed && <span>Export</span>}
          </Link>
        )}

        {/* Student Scholarship Section */}
        {isStudent && (
          <Link
            to={ROUTES.STUDENT_SCHOLARSHIP}
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "space-x-2"
            } p-3 rounded-lg ${
              isActive(ROUTES.STUDENT_SCHOLARSHIP)
                ? "bg-purple-600 text-white dark:bg-blue-900" // Light mode active bg and text
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            title="Scholarship"
          >
            <Wallet className="w-5 h-5" />
            {!isCollapsed && <span>Scholarship</span>}
          </Link>
        )}
      </nav>
    </div>
  );
};