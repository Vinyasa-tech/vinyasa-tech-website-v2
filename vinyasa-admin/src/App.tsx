
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import type { ReactNode } from "react";

import AdminLayout from "./components/layout/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

import MentorshipApplications from "./components/mentorship/MentorshipApplications";
import SuccessStories from "./components/mentorship/SuccessStories";
import MentorshipPrograms from "./components/mentorship/MentorshipPrograms";

import JobOpenings from "./components/careers/JobOpenings";
import JobApplications from "./components/careers/JobApplications";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

// PROTECTED ROUTE

const RequireAdmin = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// APPLICATION ROUTES

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* PROTECTED ADMIN ROUTES */}

      <Route
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        {/* DASHBOARD */}

        <Route
          path="/"
          element={<Dashboard />}
        />

        {/* PROJECTS */}

        <Route
          path="/projects"
          element={<Projects />}
        />

        {/* MENTORSHIP */}

        <Route
          path="/mentorship/applications"
          element={<MentorshipApplications />}
        />

        <Route
          path="/mentorship/success-stories"
          element={<SuccessStories />}
        />

        <Route
          path="/mentorship/programs"
          element={<MentorshipPrograms />}
        />

        {/* CAREERS */}

        <Route
          path="/careers/jobs"
          element={<JobOpenings />}
        />

        <Route
          path="/careers/applications"
          element={<JobApplications />}
        />

        <Route
          path="/careers/jobs/:jobId/applications"
          element={<JobApplications />}
        />

        {/* SETTINGS */}

        <Route
          path="/settings"
          element={<Settings />}
        />
      </Route>

      {/* FALLBACK ROUTE */}

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
};

// MAIN APP

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
