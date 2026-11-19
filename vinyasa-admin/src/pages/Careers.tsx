
import { useState } from "react";
import { BriefcaseBusiness, Users, RefreshCw } from "lucide-react";

import JobOpenings from "../components/careers/JobOpenings";
import JobApplications from "../components/careers/JobApplications";

type CareerTab = "openings" | "applications";

export default function Careers() {
  const [activeTab, setActiveTab] = useState<CareerTab>("openings");

  return (
    <div className="min-h-screen bg-[#F5F3FB] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-[#6668B8]">
              Vinyasa Tech / Administration
            </p>

            <h1 className="text-2xl font-bold text-[#302A78] sm:text-3xl">
              Careers Management
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Manage job openings and review candidate applications.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#D8D4F0] bg-white px-4 py-2.5 text-sm font-medium text-[#40358C] transition hover:bg-[#EEF0FA]"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 border-b border-[#D8D4F0]">
          <button
            type="button"
            onClick={() => setActiveTab("openings")}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === "openings"
                ? "border-[#40358C] text-[#40358C]"
                : "border-transparent text-gray-500 hover:text-[#40358C]"
            }`}
          >
            <BriefcaseBusiness size={18} />
            Job Openings
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("applications")}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === "applications"
                ? "border-[#40358C] text-[#40358C]"
                : "border-transparent text-gray-500 hover:text-[#40358C]"
            }`}
          >
            <Users size={18} />
            Job Applications
          </button>
        </div>

        {/* Content */}
        <div className="rounded-xl border border-[#E4E0F4] bg-white p-4 shadow-sm sm:p-6">
          {activeTab === "openings" ? (
            <JobOpenings />
          ) : (
            <JobApplications />
          )}
        </div>
      </div>
    </div>
  );
}
