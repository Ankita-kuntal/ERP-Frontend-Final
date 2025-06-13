// Destructuring import from react-router-dom with aliasing
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// Recoil root provider
import { RecoilRoot } from "recoil";
// Auth initializer component
import { AuthInitializer } from "../features/auth/store/AuthInitializer";
// Route guard for protected routes
import { PrivateRoute } from "../shared/PrivateRoute";
// Dark Mode Context Provider
import { DarkModeProvider } from "../shared/layouts/DarkModeContext";

import { PublicLayout } from "../shared/layouts/PublicLayout";


import { Login, ResetPassword, ResetPasswordForm, SetPasswordForm } from "../features/auth";

// import { HomePage } from "../features/dashboard";
// import { DashboardLayout } from "../shared/components/layouts";

// import { ProfileRouter } from "../features/profile";

// import { DepartmentFaculty } from "../features/faculty";
// import { MyStudentsPage } from "../features/faculty";
// import { ManageScholarship } from "../features/faculty/scholarship/ManageScholarships";
// import { ApproveScholarship } from "../features/faculty/scholarship/ApproveScholarship";


// import { CurrentScholarship, PreviousScholarships } from "../features/students/scholarship";
// import { ScholarshipPage } from "../features/faculty/scholarship/Scholarship";
// import { Export } from "../features/faculty/scholarship/Export";



import { ROUTES } from "./routes";

import { ToastContainer } from "react-toastify";



function App() {
  return (
    <RecoilRoot>
      <DarkModeProvider>
        <Router>
          <AuthInitializer />
          <ToastContainer />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
            <Route
              path={ROUTES.LOGIN}
              element={
                <PublicLayout>
                  <Login />
                </PublicLayout>
              }
            />
            <Route
              path={ROUTES.RESET_PASSWORD}
              element={
                <PublicLayout>
                  <ResetPassword />
                </PublicLayout>
              }
            />
            <Route
              path={ROUTES.RESET_PASSWORD_LINK}
              element={
                <PublicLayout>
                  <ResetPasswordForm />
                </PublicLayout>
              }
            />
            <Route
              path={ROUTES.SET_PASSWORD}
              element={
                <PublicLayout>
                  <SetPasswordForm />
                </PublicLayout>
              }
            />


           
          </Routes>
        </Router>
      </DarkModeProvider>
    </RecoilRoot>
  );
}


export default App
