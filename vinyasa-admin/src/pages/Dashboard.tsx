
import { useEffect, useState } from "react";
import type { ComponentType } from "react";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  Clock3,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";
import { motion } from "motion/react";

import {
  getJobs,
  getApplications,
  getApiError,
} from "../services/careersApi";

import {
  getMentorshipApplications,
  type MentorshipApplication,
} from "../services/mentorshipApplicationApi";

import {
  getMentorshipPrograms,
} from "../services/mentorshipProgramApi";

import type {
  ApiJob,
  ApiApplication,
} from "../services/careersApi";



interface StatCardProps {
  label: string;
  value: number | string;
  detail: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  loading: boolean;
}

interface DashboardProgram {
  id?: number | string;
  title?: string;
}

const quickActions = [
  {
    title: "Job Openings",
    icon: BriefcaseBusiness,
    to: "/careers/jobs",
  },
  {
    title: "Job Applications",
    icon: UserRound,
    to: "/careers/applications",
  },
  {
    title: "Mentorship Applications",
    icon: Users,
    to: "/mentorship/applications",
  },
  {
    title: "Mentorship Programs",
    icon: GraduationCap,
    to: "/mentorship/programs",
  },
  {
    title: "Projects",
    icon: FolderKanban,
    to: "/projects",
  },
  {
    title: "Settings",
    icon: Settings,
    to: "/settings",
  },
];

// EXTRACT ARRAY FROM API RESPONSE

const extractArray = <T,>(
  response: unknown,
  possibleKeys: string[] = [],
): T[] => {
  if (Array.isArray(response)) {
    return response as T[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const result = response as Record<string, unknown>;

  if (Array.isArray(result.data)) {
    return result.data as T[];
  }

  for (const key of possibleKeys) {
    if (Array.isArray(result[key])) {
      return result[key] as T[];
    }
  }

  if (result.data && typeof result.data === "object") {
    const nested = result.data as Record<string, unknown>;

    for (const key of possibleKeys) {
      if (Array.isArray(nested[key])) {
        return nested[key] as T[];
      }
    }
  }

  return [];
};

// STAT CARD

const StatCard = ({
  label,
  value,
  detail,
  icon: Icon,
  loading,
}: StatCardProps) => (
  <div className="flex h-full min-w-0 flex-col rounded-xl border border-[#E7E6F1] bg-white p-3 transition-all duration-200 hover:border-[#BDB9DD] hover:shadow-[0_6px_20px_rgba(37,35,95,0.05)] sm:p-3.5 md:p-4 xl:p-4">
    <div className="flex min-w-0 items-center justify-between gap-2">
      <p className="min-w-0 flex-1 text-[12px] font-medium leading-5 text-[#77778A] sm:text-[11px] md:text-xs">
        {label}
      </p>

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FA] text-[#3F3A8F] sm:h-8 sm:w-8 md:h-9 md:w-9">
        <Icon size={16} />
      </div>
    </div>

    <p className="mt-2 text-2xl font-semibold tracking-tight text-[#25224F] sm:mt-2.5 sm:text-2xl xl:text-3xl">
      {loading ? "—" : value}
    </p>

    <p className="mt-0.5 break-words text-[11px] leading-4 text-[#9998A7] sm:text-[10px] md:text-[11px]">
      {loading ? "Loading data..." : detail}
    </p>
  </div>
);

// DATE FORMAT

const formatDate = (date?: string) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// APPLICANT NAME

const getApplicantName = (application: ApiApplication) => {
  const fullName = [
    application.first_name,
    application.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return fullName || "Applicant";
};

// DASHBOARD

const Dashboard = () => {
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [applications, setApplications] = useState<ApiApplication[]>([]);

  const [mentorshipPrograms, setMentorshipPrograms] = useState<
    DashboardProgram[]
  >([]);

  const [mentorshipApplications, setMentorshipApplications] = useState<
    MentorshipApplication[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          jobsResponse,
          applicationsResponse,
          programsResponse,
          mentorshipApplicationsResponse,
        ] = await Promise.all([
          getJobs(),
          getApplications(),
          getMentorshipPrograms(),
          getMentorshipApplications(),
        ]);

        if (!active) return;

        // JOB DATA

        const jobsData = jobsResponse.data.data;
        const applicationsData = applicationsResponse.data.data;

        setJobs(
          Array.isArray(jobsData) ? jobsData : [],
        );

        setApplications(
          Array.isArray(applicationsData)
            ? applicationsData
            : [],
        );

        // MENTORSHIP PROGRAM DATA

        const programsData = extractArray<DashboardProgram>(
          programsResponse,
          ["programs", "mentorshipPrograms"],
        );

        setMentorshipPrograms(programsData);

        // MENTORSHIP APPLICATION DATA

        setMentorshipApplications(
          Array.isArray(mentorshipApplicationsResponse)
            ? mentorshipApplicationsResponse
            : [],
        );

      } catch (err) {
        if (!active) return;

        console.error("Dashboard loading error:", err);
        setError(getApiError(err));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  // JOB STATISTICS

  const activeJobs = jobs.filter(
    (job) => job.status === "open",
  ).length;

  // APPLICATION STATISTICS

  const newApplications = applications.filter(
    (application) => application.status === "new",
  ).length;

  const pendingMentorshipApplications =
    mentorshipApplications.filter(
      (application) => application.status === "pending",
    ).length;

  // LATEST FIVE JOB APPLICATIONS

  const recentApplications = [...applications]
    .sort((a, b) => {
      const dateA = new Date(a.applied_at || 0).getTime();
      const dateB = new Date(b.applied_at || 0).getTime();

      return dateB - dateA;
    })
    .slice(0, 5);

  // FOUR MAIN DASHBOARD STATISTICS

  const stats = [
    {
      label: "Total Mentorship Programs",
      value: mentorshipPrograms.length,
      detail: "Available mentorship programs",
      icon: GraduationCap,
    },
    {
      label: "Total Job Openings",
      value: jobs.length,
      detail: `${activeJobs} currently active`,
      icon: BriefcaseBusiness,
    },
    {
      label: "Mentorship Applications",
      value: mentorshipApplications.length,
      detail: `${pendingMentorshipApplications} waiting for review`,
      icon: Users,
    },
    {
      label: "Job Applications",
      value: applications.length,
      detail: `${newApplications} waiting for review`,
      icon: UserRound,
    },
  ];

  return (
    <main className="min-h-full w-full min-w-0 max-w-full overflow-x-clip bg-[#F5F6FC] p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8">

      <div className="dashboard-content mx-auto w-full min-w-0 max-w-[1800px] space-y-4 sm:space-y-5 lg:space-y-6">

        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex w-full min-w-0 flex-col justify-between gap-3 rounded-xl border border-[#E7E6F1] bg-white p-4 sm:p-4 md:flex-row md:items-center md:p-5 xl:p-6"
        >
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#3F3A8F]" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7779C6] sm:text-[10px]">
                Vinyasa Admin / Overview
              </p>
            </div>

            <h1 className="break-words text-xl font-semibold tracking-tight text-[#25224F] sm:text-xl md:text-2xl xl:text-3xl">
              Dashboard
            </h1>

            <p className="mt-1.5 break-words text-[12px] leading-5 text-[#77778A] sm:text-[11px] md:text-xs">
              Manage your careers, mentorship, projects and website content.
            </p>
          </div>

          <div className="flex h-9 w-fit max-w-full shrink-0 items-center gap-2 rounded-lg border border-[#E7E6F1] bg-[#F8F8FC] px-3 sm:h-9">
            <LayoutDashboard
              size={16}
              className="shrink-0 text-[#3F3A8F]"
            />

            <span className="text-[11px] font-medium text-[#55516F] sm:text-[10px]">
              Admin Overview
            </span>
          </div>
        </motion.div>

        {/* LIVE STATISTICS */}

        <section className="w-full min-w-0">

          <div className="mb-3 flex min-w-0 items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-[#25224F] sm:text-base">
                Overview
              </h2>

              <p className="mt-1 text-[11px] text-[#9998A7] sm:text-[10px] md:text-[11px]">
                Live information from your database.
              </p>
            </div>

            <span className="shrink-0 text-[10px] text-[#7779C6] sm:text-[10px]">
              {loading
                ? "Updating..."
                : error
                  ? "Connection issue"
                  : "Data loaded"}
            </span>
          </div>

          {/* FOUR STATISTICS */}

          <div className="grid w-full min-w-0 grid-cols-[repeat(2,minmax(0,1fr))] gap-2 sm:gap-3 md:gap-4 lg:grid-cols-4 xl:gap-5">

            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="min-w-0"
              >
                <StatCard
                  label={stat.label}
                  value={stat.value}
                  detail={stat.detail}
                  icon={stat.icon}
                  loading={loading}
                />
              </motion.div>
            ))}

          </div>

          {error && (
            <div className="mt-3 break-words rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[11px] text-red-600 sm:text-xs">
              Unable to load dashboard data: {error}
            </div>
          )}
        </section>

        {/* RECENT APPLICATIONS + QUICK ACCESS */}

        <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] xl:gap-6">

          {/* RECENT JOB APPLICATIONS */}

          <section className="w-full min-w-0 overflow-hidden rounded-xl border border-[#E7E6F1] bg-white">

            <div className="flex min-w-0 items-center justify-between gap-2 border-b border-[#E7E6F1] px-3.5 py-4 sm:px-4 sm:py-3.5 md:px-5">
              <div className="min-w-0 flex-1">
                <h2 className="break-words text-sm font-semibold text-[#25224F] sm:text-sm md:text-base">
                  Recent Job Applications
                </h2>

                <p className="mt-1 text-[11px] leading-5 text-[#9998A7] sm:mt-0.5 sm:text-[10px]">
                  Latest applications received from candidates.
                </p>
              </div>

              <Link
                to="/careers/applications"
                className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-[#3F3A8F] transition-colors hover:text-[#7779C6] sm:text-[10px]"
              >
                View all
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="px-4 py-8 text-center text-[11px] text-[#9998A7] sm:text-xs">
                Loading applications...
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <UserRound
                  size={28}
                  className="mx-auto text-[#BDB9DD]"
                />

                <p className="mt-2 text-[12px] font-medium text-[#55516F] sm:text-xs">
                  No applications received yet
                </p>

                <p className="mt-1 text-[11px] leading-5 text-[#9998A7] sm:text-[10px]">
                  New candidate applications will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#EEEFF5]">

                {recentApplications.map((application) => (
                  <div
                    key={application.id}
                    className="flex min-w-0 items-center justify-between gap-2.5 px-3.5 py-3.5 transition-colors hover:bg-[#FAFAFD] sm:gap-3 sm:px-4 sm:py-3 md:px-5"
                  >

                    <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF0FA] text-[#3F3A8F] sm:h-9 sm:w-9">
                        <UserRound size={16} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-semibold text-[#25224F] sm:text-[11px] md:text-xs">
                          {getApplicantName(application)}
                        </p>

                        <p className="mt-1 truncate text-[11px] text-[#7779C6] sm:mt-0.5 sm:text-[10px]">
                          {application.job_title || "Job application"}
                        </p>

                        <p className="mt-1 text-[10px] text-[#9998A7] sm:mt-0.5 sm:text-[9px]">
                          {formatDate(application.applied_at)}
                        </p>
                      </div>

                    </div>

                    <span
                      className={`max-w-[40%] shrink-0 truncate rounded-full px-2.5 py-1.5 text-[10px] font-medium capitalize sm:max-w-[35%] sm:px-2 sm:py-1 sm:text-[9px] ${
                        application.status === "shortlisted"
                          ? "bg-[#EEF0FA] text-[#3F3A8F]"
                          : application.status === "rejected"
                            ? "bg-red-50 text-red-600"
                            : application.status === "hired"
                              ? "bg-green-50 text-green-700"
                              : "bg-[#F5F6FC] text-[#77778A]"
                      }`}
                    >
                      {application.status || "New"}
                    </span>

                  </div>
                ))}

              </div>
            )}
          </section>

          {/* QUICK ACCESS */}

          <section className="w-full min-w-0 rounded-xl border border-[#E7E6F1] bg-white p-3.5 sm:p-4 md:p-5">

            <div className="mb-3.5 sm:mb-3">
              <h2 className="text-base font-semibold text-[#25224F] sm:text-base">
                Quick Access
              </h2>

              <p className="mt-1 text-[11px] text-[#9998A7] sm:mt-0.5 sm:text-[10px]">
                Navigate to admin sections.
              </p>
            </div>

            <div className="grid w-full min-w-0 grid-cols-2 gap-2.5 sm:gap-3 xl:gap-4">

              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.title}
                    to={action.to}
                    className="group flex min-h-[68px] min-w-0 items-center gap-2 rounded-lg border border-[#E7E6F1] bg-[#FAFAFD] px-2.5 py-2 transition-all duration-200 hover:border-[#BDB9DD] hover:bg-[#EEF0FA] sm:min-h-[72px] sm:gap-3 sm:p-3"
                  >

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FA] text-[#3F3A8F] group-hover:bg-white sm:h-9 sm:w-9">
                      <Icon size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold leading-4 text-[#45416E] sm:text-[10px] md:text-[11px]">
                        {action.title}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={14}
                      className="shrink-0 text-[#A5A2BD] transition-colors group-hover:text-[#3F3A8F]"
                    />

                  </Link>
                );
              })}

            </div>
          </section>
        </div>

        {/* MANAGEMENT SUMMARY */}

        <section className="w-full min-w-0 rounded-xl border border-[#E7E6F1] bg-white p-3.5 sm:p-4 md:p-5 xl:p-6">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FA] text-[#3F3A8F] sm:h-9 sm:w-9">
              <Clock3 size={16} />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-[#25224F] sm:text-sm">
                Dashboard Summary
              </h2>

              <p className="mt-1 text-[11px] text-[#9998A7] sm:mt-0.5 sm:text-[10px]">
                Current careers and mentorship information.
              </p>
            </div>

          </div>

          <div className="mt-3.5 grid w-full min-w-0 grid-cols-[repeat(2,minmax(0,1fr))] gap-2.5 sm:mt-3 sm:gap-3 md:gap-4 lg:grid-cols-4 xl:gap-5">

            <div className="min-w-0 rounded-lg bg-[#F8F8FC] p-3 sm:p-3 md:p-4">
              <p className="break-words text-[11px] leading-5 text-[#9998A7] sm:text-[10px]">
                Mentorship Programs
              </p>

              <p className="mt-1.5 text-base font-semibold text-[#25224F] sm:mt-1 sm:text-base md:text-lg">
                {loading ? "—" : mentorshipPrograms.length}
              </p>
            </div>

            <div className="min-w-0 rounded-lg bg-[#F8F8FC] p-3 sm:p-3 md:p-4">
              <p className="break-words text-[11px] leading-5 text-[#9998A7] sm:text-[10px]">
                Job Openings
              </p>

              <p className="mt-1.5 text-base font-semibold text-[#3F3A8F] sm:mt-1 sm:text-base md:text-lg">
                {loading ? "—" : jobs.length}
              </p>
            </div>

            <div className="min-w-0 rounded-lg bg-[#F8F8FC] p-3 sm:p-3 md:p-4">
              <p className="break-words text-[11px] leading-5 text-[#9998A7] sm:text-[10px]">
                Mentorship Applications
              </p>

              <p className="mt-1.5 text-base font-semibold text-[#25224F] sm:mt-1 sm:text-base md:text-lg">
                {loading ? "—" : mentorshipApplications.length}
              </p>
            </div>

            <div className="min-w-0 rounded-lg bg-[#F8F8FC] p-3 sm:p-3 md:p-4">
              <p className="break-words text-[11px] leading-5 text-[#9998A7] sm:text-[10px]">
                Job Applications
              </p>

              <p className="mt-1.5 text-base font-semibold text-[#3F3A8F] sm:mt-1 sm:text-base md:text-lg">
                {loading ? "—" : applications.length}
              </p>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
};

export default Dashboard;
