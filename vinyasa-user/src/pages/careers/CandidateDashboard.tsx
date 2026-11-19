import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import {
  BriefcaseBusiness,
  LogOut,
  ArrowRight,
  MapPin,
  Clock3,
  FileText,
  CheckCircle2,
  CalendarDays,
  RefreshCw,
  ClipboardCheck,
  Search,
} from "lucide-react";

import { motion } from "motion/react";

import {
  getCandidate,
  logoutCandidate,
} from "@/lib/careersStorage";

import careersApi, {
  getOpenJobs,
  getApiError,
  type ApiJob,
  type ApiApplication,
  type ApplicationStatus,
} from "@/services/careersApi";

import CandidateApplicationForm from "@/components/careers/CandidateApplicationForm";

import {
  fadeUp,
  staggerContainer,
} from "@/lib/motion";

/* =====================================
   TYPES
===================================== */

interface Candidate {
  name: string;
  email: string;
}

interface DashboardApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  status: ApplicationStatus;
  appliedAt: string;
  location?: string;
  employmentType?: string;
}

interface ApiListResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/* =====================================
   HELPERS
===================================== */

function unwrapResponse<T>(response: unknown): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }

  if (
    response &&
    typeof response === "object" &&
    "data" in response
  ) {
    const data = (response as { data: unknown }).data;

    if (Array.isArray(data)) {
      return data as T[];
    }

    if (
      data &&
      typeof data === "object" &&
      "data" in data
    ) {
      const nested = (data as { data: unknown }).data;

      if (Array.isArray(nested)) {
        return nested as T[];
      }
    }
  }

  return [];
}

function formatAppliedDate(date?: string): string {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusDetails(status: ApplicationStatus) {
  switch (status) {
    case "new":
      return {
        label: "Application Submitted",
        description: "Your application has been received.",
        className: "bg-blue-50 text-blue-700 border-blue-200",
        dotClass: "bg-blue-500",
        icon: ClipboardCheck,
      };

    case "reviewing":
      return {
        label: "Under Review",
        description: "Your application is being reviewed.",
        className: "bg-amber-50 text-amber-700 border-amber-200",
        dotClass: "bg-amber-500",
        icon: Clock3,
      };

    case "shortlisted":
      return {
        label: "Shortlisted",
        description: "You have been shortlisted for this position.",
        className: "bg-violet-50 text-violet-700 border-violet-200",
        dotClass: "bg-violet-500",
        icon: CheckCircle2,
      };

    case "rejected":
      return {
        label: "Not Selected",
        description:
          "Thank you for your interest. We will keep your profile in mind for future opportunities.",
        className: "bg-rose-50 text-rose-700 border-rose-200",
        dotClass: "bg-rose-500",
        icon: ClipboardCheck,
      };

    case "hired":
      return {
        label: "Selected",
        description:
          "Congratulations! Our team will contact you with the next steps.",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dotClass: "bg-emerald-500",
        icon: CheckCircle2,
      };

    default:
      return {
        label: "Application Received",
        description: "Your application has been received.",
        className: "bg-gray-50 text-gray-700 border-gray-200",
        dotClass: "bg-gray-500",
        icon: ClipboardCheck,
      };
  }
}

/* =====================================
   APPLICATION STATUS BADGE
===================================== */

function ApplicationStatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  const details = getStatusDetails(status);
  const Icon = details.icon;

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold leading-4 sm:text-xs ${details.className}`}
    >
      <Icon size={13} className="shrink-0" />
      <span>{details.label}</span>
    </span>
  );
}

/* =====================================
   APPLICATION CARD
===================================== */

function ApplicationCard({
  application,
}: {
  application: DashboardApplication;
}) {
  const status = getStatusDetails(application.status);

  return (
    <motion.article
      variants={fadeUp}
      className="group relative min-w-0 overflow-hidden rounded-xl border border-[#E2E0F0] bg-white transition-all duration-300 hover:border-[#AAA5D5] hover:shadow-[0_10px_28px_rgba(63,58,143,0.08)]"
    >
      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#3F3A8F] via-[#6668B8] to-[#D8D4F0]" />

      <div className="p-4 sm:p-5">
        {/* Job heading */}
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0EFF9] text-[#3F3A8F] transition-colors group-hover:bg-[#3F3A8F] group-hover:text-white">
            <BriefcaseBusiness size={19} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#85839A]">
              Vinyasa Tech Careers
            </p>

            <h3 className="mt-1 break-words text-sm font-semibold leading-5 text-[#24215E] sm:text-base">
              {application.jobTitle}
            </h3>
          </div>
        </div>

        {/* Status */}
        <div className="mt-5 rounded-lg border border-[#EEEDF5] bg-[#FAFAFD] p-3 sm:p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#85839A]">
                Current Application Status
              </p>

              <div className="mt-2">
                <ApplicationStatusBadge status={application.status} />
              </div>
            </div>

            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-white text-[#6668B8] sm:flex">
              <CheckCircle2 size={19} />
            </div>
          </div>

          <p className="mt-3 text-xs leading-5 text-[#666477]">
            {status.description}
          </p>
        </div>

        {/* Application details */}
        <div className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
          <div className="flex min-w-0 items-start gap-2.5">
            <div className="mt-0.5 text-[#7773AE]">
              <CalendarDays size={15} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] text-[#85839A]">
                Applied on
              </p>

              <p className="mt-1 text-xs font-semibold text-[#302A78]">
                {formatAppliedDate(application.appliedAt)}
              </p>
            </div>
          </div>

          {application.location && (
            <div className="flex min-w-0 items-start gap-2.5">
              <div className="mt-0.5 text-[#7773AE]">
                <MapPin size={15} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] text-[#85839A]">
                  Location
                </p>

                <p className="mt-1 break-words text-xs font-semibold text-[#302A78]">
                  {application.location}
                </p>
              </div>
            </div>
          )}

          {application.employmentType && (
            <div className="flex min-w-0 items-start gap-2.5">
              <div className="mt-0.5 text-[#7773AE]">
                <Clock3 size={15} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] text-[#85839A]">
                  Employment Type
                </p>

                <p className="mt-1 break-words text-xs font-semibold text-[#302A78]">
                  {application.employmentType}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* =====================================
   CANDIDATE DASHBOARD
===================================== */

export default function CandidateDashboard() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const jobId = params.get("jobId") ?? "";

  const [candidate, setCandidate] = useState<Candidate | null>(
    () => getCandidate()
  );

  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [isLoadingJob, setIsLoadingJob] = useState(false);
  const [jobError, setJobError] = useState("");

  const [applications, setApplications] = useState<
    DashboardApplication[]
  >([]);

  const [isLoadingApplications, setIsLoadingApplications] =
    useState(true);

  const [applicationsError, setApplicationsError] = useState("");

  const [recentlySubmittedJobId, setRecentlySubmittedJobId] =
    useState<number | null>(null);

  /* =====================================
     SELECTED JOB
  ===================================== */

  const selectedJob = useMemo(() => {
    return jobs.find(
      (job) => String(job.id) === String(jobId)
    ) ?? null;
  }, [jobs, jobId]);

  /* =====================================
     LOAD OPEN JOBS
  ===================================== */

  const loadJobs = useCallback(async () => {
    if (!jobId) {
      setJobs([]);
      return;
    }

    try {
      setIsLoadingJob(true);
      setJobError("");

      const response = await getOpenJobs();
      const records = unwrapResponse<ApiJob>(response.data);

      setJobs(records);
    } catch (error) {
      console.error("Unable to load jobs:", error);
      setJobError(getApiError(error));
    } finally {
      setIsLoadingJob(false);
    }
  }, [jobId]);

  /* =====================================
     LOAD CANDIDATE APPLICATIONS
     
     Expected backend endpoint:
     GET /api/candidate-auth/applications/me

     Must return only the logged-in candidate's
     applications after verifying candidate JWT.
  ===================================== */

  const refreshApplications = useCallback(async () => {
    const currentCandidate = getCandidate();

    if (!currentCandidate) {
      setApplications([]);
      setIsLoadingApplications(false);
      return;
    }

    try {
      setIsLoadingApplications(true);
      setApplicationsError("");

      const response = await careersApi.get<
        ApiListResponse<ApiApplication[]>
      >("/candidate-auth/applications/me");

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
            "Unable to load your applications."
        );
      }

      const records = response.data.data;

      if (!Array.isArray(records)) {
        throw new Error(
          "The applications API did not return a valid list."
        );
      }

      const mapped: DashboardApplication[] = records.map(
        (application) => ({
          id: application.id,
          jobId: application.job_id,
          jobTitle:
            application.job_title || "Job Application",
          status: application.status,
          appliedAt: application.applied_at ?? "",
        })
      );

      setApplications(mapped);
    } catch (error) {
      console.error(
        "Unable to load candidate applications:",
        error
      );

      setApplicationsError(
        getApiError(error)
      );
    } finally {
      setIsLoadingApplications(false);
    }
  }, []);

  /* =====================================
     INITIAL LOAD
  ===================================== */

  useEffect(() => {
    const currentCandidate = getCandidate();

    if (!currentCandidate) {
      const query = jobId
        ? `?jobId=${encodeURIComponent(jobId)}`
        : "";

      navigate(`/careers/login${query}`, {
        replace: true,
      });

      return;
    }

    setCandidate(currentCandidate);

    void refreshApplications();
  }, [jobId, navigate, refreshApplications]);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  /* =====================================
     LOGOUT
  ===================================== */

  function handleLogout() {
    logoutCandidate();
    setCandidate(null);

    navigate("/careers", {
      replace: true,
    });
  }

  /* =====================================
     APPLICATION CHECK
  ===================================== */

  const alreadyApplied = selectedJob
    ? applications.some(
        (application) =>
          application.jobId === selectedJob.id
      )
    : false;

  if (!candidate) return null;

  /* =====================================
     RENDER
  ===================================== */

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#F5F3FB] text-[#0B2545]">

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="sticky top-0 z-30 border-b border-[#D8D7ED] bg-white">
        <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-3 px-3 py-3 sm:px-5 lg:px-8 2xl:max-w-[2100px] 2xl:px-12 min-[2400px]:max-w-[2400px] min-[2400px]:px-14">

          <Link
            to="/careers"
            className="flex min-w-0 items-center gap-2.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3F3A8F] text-white">
              <BriefcaseBusiness size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wider">
                VINYASA TECH
              </p>

              <p className="text-[10px] text-[#77778A]">
                Candidate Portal
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#D8D7ED] px-3 py-2 text-xs font-medium text-[#3F3A8F] transition-colors hover:bg-[#EEF0FA]"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      {/* =====================================
          MAIN CONTAINER
      ===================================== */}

      <div className="mx-auto w-full max-w-[1800px] px-3 py-7 sm:px-5 lg:px-8 2xl:max-w-[2100px] 2xl:px-12 2xl:py-10 min-[2400px]:max-w-[2400px] min-[2400px]:px-14">

        {/* WELCOME SECTION */}

        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-7"
        >
          <span className="text-[10px] font-medium uppercase tracking-widest text-[#3F3A8F]">
            Candidate Dashboard
          </span>

          <h1 className="mt-1.5 break-words text-2xl font-semibold text-[#24215E] sm:text-3xl">
            Welcome, {candidate.name}
          </h1>

          <p className="mt-2 text-xs leading-5 text-[#55556A] sm:text-sm">
            Manage your applications and explore career opportunities
            at Vinyasa Tech.
          </p>
        </motion.section>

        <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_290px] 2xl:grid-cols-[minmax(0,1fr)_320px]">

          {/* =====================================
              MAIN CONTENT
          ===================================== */}

          <div className="min-w-0 space-y-8">

            {/* SELECTED JOB */}

            {jobId && (
              <section className="min-w-0 rounded-xl border border-[#D8D7ED] bg-white p-4 sm:p-6">

                {isLoadingJob ? (
                  <div className="flex items-center gap-2 text-xs text-[#77778A]">
                    <RefreshCw
                      size={15}
                      className="animate-spin"
                    />
                    Loading selected job...
                  </div>
                ) : jobError ? (
                  <div className="text-xs text-red-700">
                    <p>{jobError}</p>

                    <button
                      type="button"
                      onClick={() => void loadJobs()}
                      className="mt-2 font-semibold underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : selectedJob ? (
                  <>
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F0EFF9] text-[#3F3A8F]">
                        <BriefcaseBusiness size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-widest text-[#3F3A8F]">
                          Selected Position
                        </p>

                        <h2 className="mt-1 break-words font-semibold text-[#24215E]">
                          {selectedJob.title}
                        </h2>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#77778A]">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {selectedJob.location}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock3 size={13} />
                        {selectedJob.experience}
                      </span>

                      <span>
                        {selectedJob.employment_type}
                      </span>
                    </div>

                    <div className="mt-5 border-t border-[#D8D7ED] pt-5">

                      {recentlySubmittedJobId === selectedJob.id ? (
                        <div
                          role="status"
                          aria-live="polite"
                          className="rounded-lg border border-[#D8D7ED] bg-[#F5F3FB] p-4 sm:p-5"
                        >
                          <div className="flex items-start gap-3">
                            <CheckCircle2
                              size={23}
                              className="mt-0.5 shrink-0 text-[#3F3A8F]"
                            />

                            <div>
                              <h3 className="text-sm font-semibold text-[#3F3A8F]">
                                Application Submitted Successfully!
                              </h3>

                              <p className="mt-2 text-xs leading-5 text-[#55556A]">
                                Your application for {selectedJob.title} has
                                been received. You can check its status in
                                My Applications.
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : alreadyApplied ? (
                        <div className="rounded-lg border border-[#D8D7ED] bg-[#F5F3FB] p-4">
                          <p className="text-sm font-medium text-[#302A78]">
                            You have already applied for this position.
                          </p>

                          <p className="mt-1 text-xs text-[#77778A]">
                            Check your application status in My Applications.
                          </p>
                        </div>
                      ) : (
                        <CandidateApplicationForm
                          jobDatabaseId={selectedJob.id}
                          jobTitle={selectedJob.title}
                          candidateName={candidate.name}
                          candidateEmail={candidate.email}
                          alreadyApplied={alreadyApplied}
                          onApplicationSubmitted={() => {
                            setRecentlySubmittedJobId(selectedJob.id);
                            void refreshApplications();
                          }}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <div>
                    <h2 className="font-semibold">
                      Selected job not available
                    </h2>

                    <p className="mt-2 text-xs leading-5 text-[#77778A]">
                      This position may have been closed or removed.
                    </p>

                    <Link
                      to="/careers"
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#3F3A8F] px-4 py-2.5 text-xs text-white transition-colors hover:bg-[#302A78]"
                    >
                      Browse Jobs
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </section>
            )}

            {/* =====================================
                MY APPLICATIONS
            ===================================== */}

            <section className="min-w-0">

              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-widest text-[#3F3A8F]">
                    Your Career Journey
                  </span>

                  <h2 className="mt-1 text-xl font-semibold text-[#24215E] sm:text-2xl">
                    My Applications
                  </h2>

                  <p className="mt-1 text-xs text-[#77778A] sm:text-sm">
                    Track the latest status of your applications.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {!isLoadingApplications &&
                    applications.length > 0 && (
                      <div className="flex w-fit items-center gap-2 rounded-lg border border-[#D8D7ED] bg-white px-3 py-2">
                        <BriefcaseBusiness
                          size={14}
                          className="text-[#3F3A8F]"
                        />

                        <span className="text-xs font-medium text-[#3F3A8F]">
                          {applications.length}{" "}
                          {applications.length === 1
                            ? "Application"
                            : "Applications"}
                        </span>
                      </div>
                    )}

                  {!isLoadingApplications && (
                    <button
                      type="button"
                      onClick={() => void refreshApplications()}
                      title="Refresh applications"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D8D7ED] bg-white text-[#3F3A8F] transition hover:bg-[#EEF0FA]"
                    >
                      <RefreshCw size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* LOADING */}

              {isLoadingApplications ? (
                <div className="rounded-xl border border-[#D8D7ED] bg-white p-10 text-center">
                  <RefreshCw
                    size={22}
                    className="mx-auto animate-spin text-[#3F3A8F]"
                  />

                  <p className="mt-3 text-xs text-[#77778A]">
                    Loading your applications...
                  </p>
                </div>
              ) : applicationsError ? (
                <div className="rounded-xl border border-red-200 bg-white p-5 text-xs text-red-700">
                  <p>{applicationsError}</p>

                  <button
                    type="button"
                    onClick={() => void refreshApplications()}
                    className="mt-3 inline-flex items-center gap-1.5 font-semibold underline"
                  >
                    <RefreshCw size={13} />
                    Try again
                  </button>
                </div>
              ) : applications.length === 0 ? (
                /* EMPTY STATE */

                <div className="overflow-hidden rounded-xl border border-dashed border-[#C9C5E8] bg-white">
                  <div className="px-5 py-10 text-center sm:px-8">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0EFF9] text-[#3F3A8F]">
                      <Search size={27} />
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-[#24215E]">
                      No applications yet
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#77778A]">
                      You haven't applied for any positions yet.
                      Explore our current openings and take the next
                      step in your career.
                    </p>

                    <Link
                      to="/careers"
                      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#3F3A8F] px-5 py-2.5 text-xs font-medium !text-white transition-colors hover:bg-[#302A78]"
                    >
                      Explore Openings
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ) : (
                /* APPLICATION CARDS */

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid min-w-0 grid-cols-1 gap-4 2xl:grid-cols-2"
                >
                  {applications.map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                    />
                  ))}
                </motion.div>
              )}
            </section>
          </div>

          {/* =====================================
              RIGHT SIDEBAR
          ===================================== */}

          <aside className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">

            {/* APPLICATION TIPS */}

            <section className="rounded-xl border border-[#D8D7ED] bg-white p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F0EFF9] text-[#3F3A8F]">
                  <FileText size={18} />
                </div>

                <h2 className="text-sm font-semibold text-[#24215E]">
                  Application Tips
                </h2>
              </div>

              <ul className="mt-4 space-y-3">
                {[
                  "Enter your full name correctly.",
                  "Use a valid mobile number.",
                  "Complete all qualification details.",
                  "List your technical skills clearly.",
                  "Review your details before submitting.",
                ].map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 text-[11px] leading-5 text-[#55556A] sm:text-xs"
                  >
                    <CheckCircle2
                      size={14}
                      className="mt-0.5 shrink-0 text-[#6668B8]"
                    />

                    {tip}
                  </li>
                ))}
              </ul>
            </section>

            {/* QUICK LINKS */}

            <section className="rounded-xl border border-[#D8D7ED] bg-white p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-[#24215E]">
                Quick Links
              </h2>

              <Link
                to="/careers"
                className="mt-3 flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-[#55556A] transition-colors hover:bg-[#F5F3FB] hover:text-[#3F3A8F]"
              >
                Explore openings
                <ArrowRight size={14} />
              </Link>

              <Link
                to="/"
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-[#55556A] transition-colors hover:bg-[#F5F3FB] hover:text-[#3F3A8F]"
              >
                Visit website
                <ArrowRight size={14} />
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}