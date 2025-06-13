export interface Scholarship {
  id: number;
  scholar: number; // Foreign key to student ID
  month: number; // 1-12
  year: number;
  days: number;
  total_pay: string; // Decimal sent as string from DRF
  total_pay_per_day: string; // Same
  release: boolean;
  status: string; // Possibly an enum like "1" | "2" | etc.
  student_name: string; // Annotated in serializer, not in model directly
}

export type ScholarshipStatus = "pending" | "approved" | "rejected" | "paid";

export type ScholarshipCategory =
  | "sponsered"
  | "self-sponsored"
  | "govt-sponsored"
  | "other";

export type ScholarshipId =
  | "f1"
  | "f2"
  | "f3"
  | "f4"
  | "f5"
  | "f6"
  | "f7"
  | "f8"
  | "f9"
  | "f10";

export type StageStatus =
  | "pending"
  | "in_progress"
  | "approved"
  | "rejected"
  | "completed";