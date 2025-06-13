import axios from 'axios';
import type { ApiResponse, Tokens } from '../types/auth';
import type { Faculty } from '../types/faculty';
import type { Scholar } from '../types/scholar';
import type { LoginPayload } from '../types/auth';

import { logMessage } from '../utils/logger';

let currentUser: Scholar | Faculty | null = null;

/**
 * Performs login and returns user + tokens.
 * Also stores tokens in localStorage and logs login result.
 */
export async function loginUser(payload: LoginPayload): Promise<ApiResponse> {
  try {
    console.log('Sending login request with payload:', payload);
    
    const response = await axios.post(
      'http://localhost:8000/api/users/token/',
      payload
    );

    console.log('Raw server response:', response);
    console.log('Response data:', response.data);

    const { tokens, faculty, scholar } = response.data;

    // Validate response data
    if (!tokens || !tokens.access || !tokens.refresh) {
      console.error('Invalid tokens in response:', tokens);
      throw new Error('Invalid tokens in server response');
    }

    // Get user data based on login type
    const user = payload.type === 'faculty' ? faculty : scholar;

    if (!user) {
      console.error('No user data in response');
      throw new Error('No user data in server response');
    }

    // Save user in memory
    currentUser = user;

    // Persist tokens to localStorage
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);

    // Optional logging (student vs faculty)
    if (user && 'enroll' in user) {
      console.log('Logged in as Scholar:', user);
    } else if (user) {
      console.log('Logged in as Faculty:', user);
    }

    logMessage('info', 'Login successful', 'login', { tokens, user });

    return { tokens, user };
  } catch (error) {
    console.error('Login error details:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });

      const status = error.response?.status;
      if (status === 401) {
        throw new Error('Invalid credentials');
      } else if (status === 404) {
        throw new Error('Endpoint not found');
      } else if (status === 400) {
        throw new Error(error.response?.data?.detail || 'Invalid request');
      } else {
        throw new Error('Login failed: ' + (error.response?.data?.detail || error.message));
      }
    }

    throw new Error('An unexpected error occurred during login');
  }
}
