import React from "react";
import { useAuth } from "../auth/store/customHooks";
import StudentProfile from "./student-profile/StudentProfile";
import FacultyProfile from "./faculty-profile/FacultyProfile";

const ProfileRouter: React.FC = () => {
  const { user, selectedRole } = useAuth();
  if (!user) return null;

  if (selectedRole === "Scholar") return <StudentProfile />;
  return <FacultyProfile />;
};

export default ProfileRouter;
