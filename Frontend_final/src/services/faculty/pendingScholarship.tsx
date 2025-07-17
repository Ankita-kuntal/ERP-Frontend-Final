
import axios from "axios";
import type { Scholarship } from "../../types/scholarship";

const API_BASE_URL = "http://127.0.0.1:8000/api";

import type { Roles as FacultyRole } from "../../types/Roles";

export interface PendingScholarship {
  id: number;
  scholar: number;
  month: number;
  year: number;
  days: number;
  total_pay: string;
  total_pay_per_day: string;
  release: boolean;
  status: string;
  student_name: string;
  category: string;
  selected?: boolean;
}

export interface PendingScholarshipResponse {
  data: Record<string, PendingScholarship[]>;
  message: string;
}

class PendingScholarshipService {
  private baseUrl = "http://127.0.0.1:8000/api";

  async getPendingScholarships(
    facultyId: number,
    roles: string | string[]
  ): Promise<PendingScholarshipResponse> {
    try {
      // Convert single role to array for consistent handling
      const roleArray = Array.isArray(roles) ? roles : [roles];

      // Make API requests for each role
      const responses = await Promise.all(
        roleArray.map(async (role) => {
          const response = await fetch(
            `${this.baseUrl}/scholarships/manage/?faculty=${facultyId}&role=${role}&type=pending`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch scholarships for role ${role}`);
          }
          const data = await response.json();
          console.log("API Response for role", role, ":", data); // Debug log
          return { role, data };
        })
      );

      // Create a map of role to scholarships
      const roleToScholarships = responses.reduce((acc, { role, data }) => {
        // Handle both array and object responses
        const scholarships = Array.isArray(data)
          ? data
          : data.data
          ? data.data
          : data.scholarships
          ? data.scholarships
          : [];
        acc[role] = scholarships as PendingScholarship[];
        return acc;
      }, {} as Record<string, PendingScholarship[]>);

      return {
        data: roleToScholarships,
        message: "Successfully fetched all pending scholarships",
      };
    } catch (error) {
      console.error("Error fetching pending scholarships:", error);
      throw error;
    }
  }

  async approveScholarship(
    scholarshipId: number,
    facultyId: number,
    role: string,
    comment: string
  ): Promise<void> {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      await axios.post(
        `${API_BASE_URL}/scholarships/approve/`,
        {
          scholarship_id: scholarshipId,
          faculty_id: facultyId,
          role: role,
          comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error approving scholarship:", error.response?.data);
        throw new Error(
          error.response?.data?.message || "Failed to approve scholarship"
        );
      }
      throw error;
    }
  }

  async rejectScholarship(
    scholarshipId: number,
    facultyId: number,
    role: string,
    comment: string
  ): Promise<void> {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      await axios.post(
        `${API_BASE_URL}/scholarships/reject/`,
        {
          scholarship_id: scholarshipId,
          faculty_id: facultyId,
          role: role,
          comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error rejecting scholarship:", error.response?.data);
        throw new Error(
          error.response?.data?.message || "Failed to reject scholarship"
        );
      }
      throw error;
    }
  }

  async updateScholarshipDays(
    scholarshipId: number,
    days: number
  ): Promise<PendingScholarship> {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.patch(
        `${API_BASE_URL}/scholarships/${scholarshipId}/days/`,
        {
          days: days,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error updating scholarship days:", error.response?.data);
        throw new Error(
          error.response?.data?.message || "Failed to update scholarship days"
        );
      }
      throw error;
    }
  }
}

export const pendingScholarshipService = new PendingScholarshipService();
