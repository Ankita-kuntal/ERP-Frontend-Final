import type { Roles } from "./Roles";
import config from "../conf.json";

export type Status = keyof typeof config.status;
// states = 1|2|3

export interface Stage {
  id: number;
  scholarship: number;
  role?: Roles;
  status: Status;
  comments?: string | null;
  active: boolean;
}