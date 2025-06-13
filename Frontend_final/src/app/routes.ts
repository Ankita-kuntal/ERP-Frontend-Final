export const ROUTES = {

  LOGIN: '/login',
  RESET_PASSWORD: '/reset-password',
  RESET_PASSWORD_LINK: '/reset-password/:userId/:token',
  SET_PASSWORD: '/set-password/:userId/:token', 

  DASHBOARD: '/dashboard',

  /* Protected Routes (/dashboard/route)*/
  MY_PROFILE: '/my-profile',

  MY_STUDENTS: '/my-students',
  DEPARTMENT_FACULTY: '/department-faculty',

  SCHOLARSHIP: '/scholarship',
  APPROVE_SCHOLARSHIP: '/scholarship/approve',
  SCHOLARSHIP_MANAGEMENT: '/scholarship/scholarship-management',

  STUDENT_SCHOLARSHIP: '/student/scholarship/',
  // PREVIOUS_SCHOLARSHIPS: '/dashboard/scholarship/previous',

  EXPORT: "/dashboard/export",

  // SUPERVISOR: '/dashboard/supervisor',
  // STUDENT_VERIFICATION: '/dashboard/supervisor/student-verification',
  // SUBJECT_ASSIGNMENT: '/dashboard/supervisor/subject-assignment',
  // SEMESTER: '/dashboard/supervisor/semester',

} as const;

// as const tells TypeScript to:
//   Treat object values as literal types, not just string or number.  
//   Make the object and its properties readonly (immutable).