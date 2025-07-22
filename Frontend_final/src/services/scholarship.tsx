import axios from "axios";
import config from "../conf.json";
import { logMessage } from "../utils/logger";
import type { Roles } from "../types/Roles";
import type { PostScholarshipPayload } from "../types";

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

export const postScholarship = async (data: PostScholarshipPayload) => {
  const context = "postScholarship";

  if (!data.id) throw new Error("Scholarship ID is required.");

  if ("faculty" in data) {
    if (!data.role) throw new Error("Role is required for faculty.");
    if (!["accept", "reject"].includes(data.status)) {
      throw new Error("Status must be either 'accept' or 'reject'.");
    }
  }

  try {
    const res = await API.post("/scholarships/manage/", data);
    logMessage("info", "Scholarship posted", context, res.data);
    return res.data;
  } catch (err: any) {
    const errorMessage = err?.response?.data?.error || "Unknown error";
    logMessage("error", errorMessage, context, err);
    throw new Error(errorMessage);
  }
};

export const getStages = async ({
  id = null,
  type = null,
}: {
  id?: number | null;
  type?: "latest" | string | null;
}) => {
  const context = "getStages";

  const queryParams = new URLSearchParams();
  if (id !== null) queryParams.append("id", id.toString());
  if (type !== null) queryParams.append("type", type);

  const queryString = queryParams.toString();
  const url = `/scholarships/stage/${queryString ? `?${queryString}` : ""}`;

  try {
    const res = await API.get(url);
    logMessage("info", "Stages fetched", context, res.data);
    return res.data;
  } catch (err) {
    logMessage("error", "Failed to fetch stages", context, err);
    throw err;
  }
};
