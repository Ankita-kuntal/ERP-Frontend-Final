import axios from "axios";
import config from "../conf.json";
import { logMessage } from "../utils/logger";
import type { Roles } from "../types/Roles";
const API = axios.create({
  baseURL: `${config.backend}/api`,
});

export const getScholarships = async ({
  id = null,
  scholar = null,
  faculty = null,
  role = null,
  type = null,
}: {
  id?: number | null;
  scholar?: number | null;
  faculty?: number | null;
  role?: Roles | null;
  type?: string | null;
}) => {
  const context = "getScholarships";

  const queryParams = new URLSearchParams();
  if (id !== null) queryParams.append("id", id.toString());
  if (scholar !== null) queryParams.append("scholar", scholar.toString());
  if (faculty !== null) queryParams.append("faculty", faculty.toString());
  if (role !== null) queryParams.append("role", role);
  if (type !== null) queryParams.append("type", type);

  const queryString = queryParams.toString();
  const url = `/scholarships/manage${queryString ? `?${queryString}` : ""}`;

  try {
    const res = await API.get(url);
    logMessage("info", "Scholarships fetched", context, res.data);
    return res.data;
  } catch (err) {
    logMessage("error", "Failed to fetch scholarships", context, err);
    throw err;
  }
};