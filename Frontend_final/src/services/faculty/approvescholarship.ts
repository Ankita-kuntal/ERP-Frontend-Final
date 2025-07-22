import axios from "axios";
import { getAccessToken } from '../auth';

// Types for the request and response
interface ScholarshipApprovalRequest {
  id: number;
  faculty: number;
  role: "FAC" | "HOD" | "AD" | "DEAN" | "AC";
  status: "accept" | "reject";
  comment?: string;
  deducted_days?: number;
}

interface ScholarshipApprovalResponse {
  success: string;
}

// API endpoint
const SCHOLARSHIP_MANAGEMENT_URL =
  "http://127.0.0.1:8000/api/scholarships/manage/";

/**
 * Approves or rejects a scholarship application
 * @param data The approval/rejection data
 * @returns Promise with the response
 *
 * @example
 * // Supervisor approval example
 * const supervisorApproval = {
 *   id: 12,
 *   faculty: 5,
 *   role: 'FAC',
 *   status: 'accept',
 *   comment: 'Approved after review',
 *   deducted_days: 2
 * };
 * // Response: { success: "Stage 'FAC' successfully updated to 'accept'." }
 *
 * @example
 * // HOD approval example
 * const hodApproval = {
 *   id: 12,
 *   faculty: 5,
 *   role: 'HOD',
 *   status: 'accept',
 *   comment: 'Approved by HOD',
 *   deducted_days: 2
 * };
 * // Response: { success: "Stage 'HOD' successfully updated to 'accept'." }
 *
 * @example
 * // Dean approval example
 * const deanApproval = {
 *   id: 12,
 *   faculty: 5,
 *   role: 'DEAN',
 *   status: 'accept',
 *   comment: 'Final approval by Dean',
 *   deducted_days: 2
 * };
 * // Response: { success: "Stage 'DEAN' successfully updated to 'accept'." }
 */
export const approveScholarship = async (
  data: ScholarshipApprovalRequest
): Promise<ScholarshipApprovalResponse> => {
  try {
    console.log("Making API request to:", SCHOLARSHIP_MANAGEMENT_URL);
    console.log("Request data:", data);

    const response = await axios.post<ScholarshipApprovalResponse>(
      SCHOLARSHIP_MANAGEMENT_URL,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    );

    console.log("Raw API Response:", response);
    console.log("Response data:", response.data);

    if (!response.data || !response.data.success) {
      console.error("Invalid response format:", response.data);
      throw new Error("Invalid response from server");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error Response:", error.response?.data);
      console.error("API Error Status:", error.response?.status);
      console.error("API Error Headers:", error.response?.headers);
      throw new Error(
        error.response?.data?.message ||
          "Failed to manage scholarship application"
      );
    }
    console.error("Non-Axios Error:", error);
    throw error;
  }
};

// Example usage for all roles:
/*
// Supervisor approval
const handleSupervisorApproval = async () => {
  try {
    const result = await approveScholarship({
      id: 12,
      faculty: 5,
      role: 'FAC',
      status: 'accept',
      comment: 'Approved after review',
      deducted_days: 2
    });
    console.log(result.success); // "Stage 'FAC' successfully updated to 'accept'."
  } catch (error) {
    console.error('Error:', error);
  }
};

// HOD approval
const handleHODApproval = async () => {
  try {
    const result = await approveScholarship({
      id: 12,
      faculty: 5,
      role: 'HOD',
      status: 'accept',
      comment: 'Approved by HOD',
      deducted_days: 2
    });
    console.log(result.success); // "Stage 'HOD' successfully updated to 'accept'."
  } catch (error) {
    console.error('Error:', error);
  }
};

// Dean approval
const handleDeanApproval = async () => {
  try {
    const result = await approveScholarship({
      id: 12,
      faculty: 5,
      role: 'DEAN',
      status: 'accept',
      comment: 'Final approval by Dean',
      deducted_days: 2
    });
    console.log(result.success); // "Stage 'DEAN' successfully updated to 'accept'."
  } catch (error) {
    console.error('Error:', error);
  }
};
*/
