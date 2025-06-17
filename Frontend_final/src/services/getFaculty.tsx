import axios from "axios";
import config from "../conf.json";
import { logMessage } from "../utils/logger";
const API = axios.create({
  baseURL: `${config.backend}/api`,
});

export const getFaculty = async (
  faculty_id: number | null = null,
  department: string | null = null,
  student: number | null = null,
  university: string | null = null
) => {
  const context = "getFaculty";

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (faculty_id !== null) queryParams.append("faculty", faculty_id.toString());
  if (department) queryParams.append("department", department);
  if (university) queryParams.append("university", university);
  if (student) queryParams.append("student", student.toString());

  const queryString = queryParams.toString();
  const url = `/users/faculty/${queryString ? `?${queryString}` : ""}`;

  try {
    const res = await API.get(url);
    logMessage("info", "Student data fetched", context, res.data);
    return res.data;
  } catch (err) {
    logMessage("error", "Failed to fetch student data", context, err);
    throw err;
  }
};