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

import { loginUser } from '../../../services/auth';

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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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
// Initializes auth state on app load using localStorage tokens
export const useInitAuth = () => {
  const setAuthState = useSetRecoilState(authStateAtom);

  const initializeAuth = async () => {
    const access = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');

    if (!access || !refresh) return;

    try {
      const response = await axios.get('/api/users/me', {
        headers: { Authorization: `Bearer ${access}` },
      });

      const user = response.data;
      const tokens: Tokens = { access, refresh };

      const isScholar = 'enroll' in user;

      const faculty: Faculty | null = isScholar ? null : {
        ...user as Faculty,
        roles: (user as Faculty).roles ?? [],
      };

      const scholar: Scholar | null = isScholar ? user as Scholar : null;

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

      console.log("✅ Auth initialized from localStorage");
    } catch (error) {
      console.error("❌ Auth initialization failed", error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  return { initializeAuth };
};
