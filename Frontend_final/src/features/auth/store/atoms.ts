import { atom } from 'recoil';
import type { AuthState } from '../../../types/auth';

export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    isAuthenticated: false,
    user: null,
    loading: false,
    selectedRole: null,
    error: null,
  },
}); 