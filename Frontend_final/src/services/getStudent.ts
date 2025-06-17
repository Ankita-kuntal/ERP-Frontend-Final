import axios from "axios";
import config from "../conf.json";
import { logMessage } from "../utils/logger";

const API = axios.create({
  baseURL: `${config.backend}/api`,
});

export const getStudent = async (
  faculty_id: number | null = null,
  department: string | null = null,
  university: string | null = null
) => {
  const context = "getStudent";

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (faculty_id !== null) queryParams.append("faculty", faculty_id.toString());
  if (department) queryParams.append("department", department);
  if (university) queryParams.append("university", university);

  const queryString = queryParams.toString();
  const url = `/users/student/${queryString ? `?${queryString}` : ""}`;

  try {
    const res = await API.get(url);
    console.log("API Response:", res);
    logMessage("info", "Student data fetched", context, res.data);
    return res.data;
  } catch (err) {
    console.error("API Error:", err);
    logMessage("error", "Failed to fetch student data", context, err);
    throw err;
  }
};