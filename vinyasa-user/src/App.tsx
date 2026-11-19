import { BrowserRouter, Route, Routes } from "react-router-dom";

import ScrollToTop from "@/components/common/ScrollToTop";
import Layout from "@/components/layout/Layout";

// Main pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Careers from "@/pages/Careers";
import Mentorship from "@/pages/Mentorship";
import MentorshipApply from "@/pages/MentorshipApply";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

// Career application pages
import CareerAuthCheck from "@/pages/careers/CareerAuthCheck";
import JobDetails from "@/pages/careers/JobDetails";
import CandidateLogin from "@/pages/careers/CandidateLogin";
import CandidateRegister from "@/pages/careers/CandidateRegister";
import CandidateDashboard from "@/pages/careers/CandidateDashboard";
import ApplyJob from "@/pages/careers/ApplyJob";
import ApplicationSuccess from "@/pages/careers/ApplicationSuccess";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route element={<Layout />}>
          {/* Main pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          <Route path="/services" element={<Services />} />
          <Route
            path="/services/:service"
            element={<ServiceDetail />}
          />

          {/* Careers */}
          <Route path="/careers" element={<Careers />} />

          <Route
            path="/careers/jobs/:jobId"
            element={<JobDetails />}
          />

          <Route
            path="/careers/auth"
            element={<CareerAuthCheck />}
          />

          <Route
            path="/careers/login"
            element={<CandidateLogin />}
          />

          <Route
            path="/careers/register"
            element={<CandidateRegister />}
          />

          <Route
            path="/careers/dashboard"
            element={<CandidateDashboard />}
          />

          <Route
            path="/careers/apply/:jobId"
            element={<ApplyJob />}
          />

          <Route
            path="/careers/application-success"
            element={<ApplicationSuccess />}
          />

          {/* Mentorship */}
          <Route path="/mentorship" element={<Mentorship />} />

          <Route
            path="/mentorship/apply"
            element={<MentorshipApply />}
          />

          {/* Contact and fallback */}
          <Route path="/contact" element={<Contact />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
