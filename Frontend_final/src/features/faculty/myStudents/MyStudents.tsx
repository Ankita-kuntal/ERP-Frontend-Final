import React from "react";
import { StudentList } from "./StudentList";
import { useAuth } from "../../auth/store/customHooks";

export const MyStudentsPage = () => {
  // Get user object for department filtering or other logic if needed later
  const { user, selectedRole } = useAuth();
  const allowedRolesForScholarships = ["AD", "DEAN", "AC"];
  const canAccessSupervisedStudents = selectedRole === "FAC";
  const canAccessCollegeStudents =
    allowedRolesForScholarships.includes(selectedRole);
  const canAccessDepartmentStudents = selectedRole === "HOD";

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 space-y-4 max-w-4xl">
        {canAccessSupervisedStudents && (
          <h1 className="text-white text-3xl font-extrabold flex items-center space-x-3">
            <span>Students under my supervision</span>
          </h1>
        )}

        {canAccessDepartmentStudents && (
          <h1 className="text-white text-3xl font-extrabold flex items-center space-x-3">
            <span>
              Students in the{" "}
              <span className="underline decoration-wavy decoration-emerald-400 font-bold">
                {user?.department}
              </span>{" "}
              department
            </span>
          </h1>
        )}

        {canAccessCollegeStudents && (
          <h1 className="text-white text-3xl font-extrabold flex items-center space-x-3">
            <span>
              Students across the{" "}
              <span className="underline decoration-wavy decoration-purple-400 font-bold">
                {user?.university}
              </span>{" "}
              college
            </span>
          </h1>
        )}
      </div>

      <div className="mb-4">
        {canAccessSupervisedStudents && (
          <p className="text-gray-600">
            Showing students under your supervision
          </p>
        )}
        {canAccessDepartmentStudents && user?.department && (
          <p className="text-gray-600">
            Showing all students in the {user.department} department
          </p>
        )}
        {canAccessCollegeStudents && (
          <p className="text-gray-600">Showing all students in the college</p>
        )}
      </div>
      <StudentList />
    </div>
  );
};
