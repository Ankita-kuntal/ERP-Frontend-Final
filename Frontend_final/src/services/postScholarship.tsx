import axios from "axios";
import config from "../conf.json";
import { logMessage } from "../utils/logger";
import { getAccessToken } from "./auth";
const API = axios.create({
  baseURL: `${config.backend}/api`,
});


import type { PostScholarshipPayload } from "../types/index";


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