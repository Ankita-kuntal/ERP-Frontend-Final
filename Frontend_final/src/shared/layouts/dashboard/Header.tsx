import { Link, useNavigate } from "react-router-dom";
import { UserCircle, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../../features/auth/store/customHooks";
import { ROUTES } from "../../../app/routes";
import { useState, useEffect } from "react";
import type { Roles } from "../../../types/Roles";

// Custom Tooltip
const Tooltip = ({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="group relative">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

export const Header = () => {
  const { user, logout, loading, selectedRole, setSelectedRole } = useAuth();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const roles =
    Array.isArray(user?.roles) && user.roles.length > 0 ? user.roles : null;

  useEffect(() => {
    if (!user) return;

    if (user.profile_pic) {
      setProfileImage(user.profile_pic);
    }

    // If selectedRole is null or not in user roles, set default role
    if (roles && roles.length > 0) {
      // If selectedRole is missing or invalid, set roles[0]
      if (!selectedRole || !roles.includes(selectedRole)) {
        setSelectedRole(roles[0]);
      }
    }

    console.log("selectedRole: ", selectedRole);
  }, [user]);
  useEffect(() => {
    console.log("selectedRole changed:", selectedRole);
  }, [selectedRole]);
  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const handleSelect = (role: Roles) => {
    setSelectedRole(role);
    setIsOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-700">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Role Selector */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            <div className="relative">
              {roles ? (
                <>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  >
                    {selectedRole}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>

                  {isOpen && (
                    <ul className="absolute left-0 mt-2 w-36 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 border dark:border-gray-700">
                      {roles.map((role) => (
                        <li
                          key={role}
                          onClick={() => handleSelect(role)}
                          className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            role === selectedRole
                              ? "font-semibold bg-gray-100 dark:bg-gray-700"
                              : ""
                          }`}
                        >
                          {role}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg">
                  SCHOLAR
                </span>
              )}
            </div>
          </h2>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Loading...
              </span>
            ) : (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome,{" "}
                  <span className="font-medium">{user?.name || "Guest"}</span>
                </span>

                <Link
                  to={ROUTES.MY_PROFILE}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                      onError={() => setProfileImage(null)}
                    />
                  ) : (
                    <UserCircle className="w-8 h-8" />
                  )}
                </Link>

                <Tooltip text="Logout">
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </Tooltip>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
