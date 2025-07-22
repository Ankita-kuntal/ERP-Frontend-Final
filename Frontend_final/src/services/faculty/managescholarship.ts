import axios from 'axios';
import type { Scholarship } from "../../types/scholarship";
import { getAccessToken } from '../auth';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

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

interface ScholarshipResponse {
  scholarships: PendingScholarship[];
}

export const scholarshipService = {
  /**
   * Get scholarships based on faculty role
   * @param facultyId - The ID of the faculty member
   * @param role - The role of the faculty member
   * @returns Promise<PendingScholarship[]> - List of scholarships
   */
  async getScholarshipsByFacultyRole(facultyId: number, role: string): Promise<PendingScholarship[]> {
    try {
      const token = getAccessToken();
      if (!token) {
        console.error('No access token found in cookies');
        throw new Error('Authentication required. Please log in again.');
      }

      const url = `${API_BASE_URL}/scholarships/manage/?faculty=${facultyId}&role=${role}`;
      console.log('Making API request to:', url);

      const response = await axios.get<ScholarshipResponse>(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response:', response.data);

      if (!response.data) {
        console.error('Empty response received from server');
        throw new Error('Invalid response from server');
      }

      if (!response.data.scholarships) {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }

      return response.data.scholarships;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
        
        if (error.response?.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        
        throw new Error(error.response?.data?.message || 'Failed to fetch scholarships');
      }
      console.error('Non-API Error:', error);
      throw error;
    }
  },

  /**
   * Update scholarship status
   * @param scholarshipId - The ID of the scholarship
   * @param status - The new status
   * @returns Promise<PendingScholarship> - Updated scholarship
   */
  async updateScholarshipStatus(scholarshipId: number, status: string): Promise<PendingScholarship> {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axios.patch<PendingScholarship>(
        `${API_BASE_URL}/scholarships/${scholarshipId}/`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error updating scholarship:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to update scholarship');
      }
      throw error;
    }
  },

  /**
   * Update scholarship days
   * @param scholarshipId - The ID of the scholarship
   * @param days - The number of days
   * @returns Promise<PendingScholarship> - Updated scholarship
   */
  async updateScholarshipDays(scholarshipId: number, days: number): Promise<PendingScholarship> {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axios.patch<PendingScholarship>(
        `${API_BASE_URL}/scholarships/${scholarshipId}/`,
        { days },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error updating scholarship days:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to update scholarship days');
      }
      throw error;
    }
  }
}; 