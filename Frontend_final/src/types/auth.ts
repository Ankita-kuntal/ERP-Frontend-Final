import type { Faculty } from "./faculty";
import type { Roles } from "./Roles";
import type { Scholar } from "./scholar";


export interface Tokens {
  access: string;
  refresh: string;
}

export interface ApiResponse {
  tokens: Tokens;
  user: Scholar | Faculty;
}

export interface LoginPayload {
  username: string;
  password: string;
  type: "scholar" | "faculty";
}

export interface AuthState {
  scholar: Scholar | null;
  faculty: Faculty | null;
  tokens: Tokens | null;
  selectedRole: Roles | null;
  loading: boolean;
  error: string | null;
}


export interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: Roles[] | "scholar";
  requireAuth?: boolean;
  isNested?: boolean;
}