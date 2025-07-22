// -------- Custom Hooks --------
// These hooks simplify access to the Recoil authentication state

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import axios from 'axios';

import {
  authStateAtom,
  userSelector,
  isAuthenticatedSelector,
  loadingSelector,
  errorSelector,
  selectedRoleSelector,
} from './authAtoms';

import type { Scholar } from '../../../types/scholar';
import type { Faculty } from '../../../types/faculty';
import type { Roles } from '../../../types/Roles';
import type { LoginPayload, ApiResponse, Tokens } from '../../../types/auth';

import { loginUser, setAuthCookies, clearAuthCookies, getAccessToken, getRefreshToken } from '../../../services/auth';
import Cookies from 'js-cookie';

// --- JWT Decode Utility ---
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Hook to access full authentication state object
export const useAuthState = () => useRecoilValue(authStateAtom);

// Hooks to access individual derived pieces of auth state
export const useUser = () => useRecoilValue(userSelector);
export const useIsAuthenticated = () => useRecoilValue(isAuthenticatedSelector);
export const useAuthLoading = () => useRecoilValue(loadingSelector);
export const useAuthError = () => useRecoilValue(errorSelector);
export const useSelectedRole = () => useRecoilValue(selectedRoleSelector);

// ---------- HOOK: useAuth ----------
// Combines authentication-related methods and state access
export const useAuth = () => {
  const [authState, setAuthState] = useRecoilState(authStateAtom);

  // Start login — show loading spinner, clear error
  const startLoading = () => {
    setAuthState((prevState) => ({
      ...prevState,
      loading: true,
      error: null,
    }));
  };

  // Handle login success — update tokens, user, roles
  const setSuccess = (response: ApiResponse, type: LoginPayload['type']) => {
    const { tokens, user } = response;

    const isFaculty = type === 'faculty';
    const isScholar = type === 'scholar';

    // Type-safe casting based on login type
    const faculty: Faculty | null = isFaculty
      ? { ...user as Faculty, roles: (user as Faculty).roles ?? [] }
      : null;

    const scholar: Scholar | null = isScholar ? user as Scholar : null;

    // Set role: if scholar, it's always 'scholar'; otherwise take the first role of faculty
    const selectedRole: Roles | null = isScholar
      ? 'Scholar'
      : (faculty?.roles?.[0] as Roles) ?? null;

    setAuthState({
      faculty,
      scholar,
      tokens,
      selectedRole,
      loading: false,
      error: null,
    });
  };

  // Handle login failure — stop loading and store error
  const setFailure = (error: string) => {
    setAuthState((prevState) => ({
      ...prevState,
      loading: false,
      error,
    }));
  };

  // Perform login: call backend, process response
  const login = async ({ username, password, type }: LoginPayload) => {
    startLoading();
    try {
      const response = await loginUser({ username, password, type });
      setSuccess(response, type);
      // No longer store userId or userType in cookies
      return response;
    } catch (error) {
      if (error instanceof Error) {
        setFailure(error.message);
      }
      throw error; // Still throw to allow local error handling
    }
  };

  // Allow switching role if needed (e.g. if multiple roles are available)
  const setSelectedRole = (role: Roles | null) => {
    setAuthState((prev) => ({
      ...prev,
      selectedRole: role,
    }));
  };

  // Logout: clear the entire authentication state
  const logout = () => {
    clearAuthCookies();
    setAuthState({
      faculty: null,
      scholar: null,
      tokens: null,
      selectedRole: null,
      loading: false,
      error: null,
    });
  };

  // Clear only the error field in auth state
  const clearError = () => {
    setAuthState((prev) => ({
      ...prev,
      error: null,
    }));
  };

  // Return everything the consuming component might need
  return {
    login,
    logout,
    setSelectedRole,
    clearError,
    isAuthenticated: useIsAuthenticated(),
    user: useUser(),
    loading: useAuthLoading(),
    error: useAuthError(),
    selectedRole: useSelectedRole(),
  };
};

// ---------- HOOK: useInitAuth ----------
// Initializes auth state on app load using cookies
export const useInitAuth = () => {
  const setAuthState = useSetRecoilState(authStateAtom);

  const initializeAuth = async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    const access = getAccessToken();
    const refresh = getRefreshToken();
    if (!access || !refresh) {
      console.log("No tokens found in cookies");
      setAuthState((prev) => ({ ...prev, loading: false }));
      return;
    }
    try {
      const decoded = decodeJWT(access);
      if (!decoded) throw new Error('Invalid access token');
      // Assume JWT contains id, type, roles, etc.
      const userId = decoded.id;
      const userType = decoded.type; // 'scholar' or 'faculty'
      let endpoint = '';
      let isScholar = false;
      if (userType === 'scholar') {
        endpoint = `http://127.0.0.1:8000/api/users/student/?id=${userId}`;
        isScholar = true;
      } else if (userType === 'faculty') {
        endpoint = `http://127.0.0.1:8000/api/users/faculty/?id=${userId}`;
        isScholar = false;
      } else {
        throw new Error('Unknown userType in token: ' + userType);
      }
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${access}` },
      });
      const user = response.data;
      const facultyObj: Faculty | null = isScholar ? null : user;
      const scholarObj: Scholar | null = isScholar ? user : null;
      const selectedRole: Roles | null = isScholar
        ? 'Scholar'
        : (facultyObj?.roles?.[0] as Roles) ?? null;
      setAuthState({
        faculty: facultyObj,
        scholar: scholarObj,
        tokens: { access, refresh },
        selectedRole,
        loading: false,
        error: null,
      });
      console.log('Set auth state:', {
        faculty: facultyObj,
        scholar: scholarObj,
        tokens: { access, refresh },
        selectedRole,
      });
      console.log("✅ Auth initialized from token:", { faculty: facultyObj, scholar: scholarObj, selectedRole });
    } catch (error) {
      console.error("❌ Auth initialization failed:", error);
      clearAuthCookies();
      setAuthState({
        faculty: null,
        scholar: null,
        tokens: null,
        selectedRole: null,
        loading: false,
        error: 'Session expired. Please login again.',
      });
    }
  };

  return { initializeAuth };
};
