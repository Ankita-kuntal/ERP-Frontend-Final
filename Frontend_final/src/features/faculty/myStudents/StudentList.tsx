import { useEffect, useState } from "react";
import { useAuth } from "../../auth/store/customHooks";
import type { Scholar } from "../../../types/scholar";
import { getStudent } from "../../../services/getStudent";

import conf from "../../../conf.json";
const get = (val: string, obj: Record<string, string>, ci = false) => {
  if (!val) return val;
  if (ci) {
    const match = Object.keys(obj).find(
      (k) => k.toLowerCase() === val.toLowerCase()
    );
    return match ? obj[match] : val;
  }
  return obj[val] || val;
};
export const StudentList = () => {
  const { user, selectedRole } = useAuth();
  const [students, setStudents] = useState<Scholar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);

  const isFaculty = selectedRole === "FAC";
  const isHOD = selectedRole === "HOD";
  const isDean = selectedRole === "DEAN" || selectedRole === "AD";

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        let data: Scholar[] = [];

        if (!user || !selectedRole) return;

        if (isDean) {
          data = await getStudent(null, null, user.university || null);
        } else if (isHOD) {
          data = await getStudent(null, user.department || null, null);
        } else if (isFaculty) {
          data = await getStudent(user.id, null, null);
        }

        setStudents(data);

        const uniqueDepartments = [
          ...new Set(data.map((s) => s.department).filter(Boolean)),
        ];
        if (uniqueDepartments.length > 0) {
          setDepartments(uniqueDepartments);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to fetch students");
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user?.id, user?.department, user?.university, selectedRole]);

  if (loading) {
    return (
      <div className="p-4">
        <p>Loading students...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Apply search filter
  const searchedStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.enroll.toLowerCase().includes(searchLower) ||
      student.registration.toLowerCase().includes(searchLower) ||
      student.department.toLowerCase().includes(searchLower) ||
      student.course.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower)
    );
  });
  const departmentFilteredStudents =
    isDean && filterDepartment
      ? searchedStudents.filter((s) => s.department === filterDepartment)
      : searchedStudents;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search by name, enrollment, registration, department, course, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />

        {isDean && (
          <div className="flex items-center space-x-2">
            <label
              htmlFor="departmentFilter"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Filter by Department:
            </label>
            <select
              id="departmentFilter"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Student list */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Enrollment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Scholarship Status
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th> */}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {departmentFilteredStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  {searchTerm || filterDepartment
                    ? "No students found matching your criteria"
                    : "No students available"}
                </td>
              </tr>
            ) : (
              departmentFilteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {student.enroll}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {get(student.department, conf.college.departments)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {get(student.gender, conf.gender)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {get(student.admission_category, conf.admission_category)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.admission_category === "INST_FEL" ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        None
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
