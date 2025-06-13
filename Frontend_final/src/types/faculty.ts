import type { Roles } from "./Roles";

export interface Faculty {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  name: string;
  email: string;
  phone_number: string;
  department: string;
  university: string;
  designation: string;
  profile_pic: string | null;
  date_of_birth: string;
  type_of_employee: string;
  nature_of_employment: string;
  address: string;
  user: number;
  roles: Roles;
  is_student: boolean;
}
