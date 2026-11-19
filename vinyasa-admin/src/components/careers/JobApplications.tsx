import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Code2,
  Download,
  Filter,
  GraduationCap,
  Mail,
  Phone,
  RefreshCw,
  Search,
  UserRound,
  X,
} from "lucide-react";

import { downloadApplicationPdf } from "../../lib/downloadApplicationPdf";

import {
  getApiError,
  getApplications,
  getApplicationsByJob,
  getJobs,
  updateApplication,
  type ApiApplication,
  type ApiJob,
  type ApplicationStatus,
} from "../../services/careersApi";

const statusOptions = [
  "All",
  "new",
  "reviewing",
  "shortlisted",
  "rejected",
  "hired",
] as const;

type StatusFilter = (typeof statusOptions)[number];

type Notice = {
  type: "success" | "warning";
  message: string;
};

const statusLabel = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const formatDate = (value?: string) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const getFullName = (app: ApiApplication) =>
  `${app.first_name} ${app.last_name ?? ""}`.trim() ||
  "Unnamed applicant";

const getStatusStyle = (status: ApplicationStatus) => {
  switch (status) {
    case "shortlisted":
      return "bg-[#EEF0FA] text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]";
    case "rejected":
      return "bg-[#FDECEC] text-[#B42318] dark:bg-[#572D38] dark:text-[#FFB8B8]";
    case "hired":
      return "bg-[#E9F7EF] text-[#1D7A46] dark:bg-[#214B3A] dark:text-[#A8E6C1]";
    case "reviewing":
      return "bg-[#FFF5E6] text-[#A96800] dark:bg-[#59452B] dark:text-[#FFD28A]";
    default:
      return "bg-[#F3F4F6] text-[#667085] dark:bg-[#454078] dark:text-[#D8D4F0]";
  }
};

const JobApplications = () => {
  const { jobId: routeJobId } = useParams();

  const numericJobId =
    routeJobId && /^\d+$/.test(routeJobId)
      ? Number(routeJobId)
      : null;

  const [applications, setApplications] = useState<ApiApplication[]>([]);
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");

  const [selectedApplication, setSelectedApplication] =
    useState<ApiApplication | null>(null);

  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    setNotice(null);

    try {
      const [jobResponse, appResponse] = await Promise.all([
        getJobs(),
        numericJobId !== null
          ? getApplicationsByJob(numericJobId)
          : getApplications(),
      ]);

      const jobData = jobResponse.data?.data;
      const appData = appResponse.data?.data;

      if (!Array.isArray(jobData) || !Array.isArray(appData)) {
        throw new Error(
          "The API did not return the expected jobs/applications list."
        );
      }

      setJobs(jobData);
      setApplications(appData);

      setSelectedApplication((current) => {
        if (!current) return null;

        return (
          appData.find(
            (application: ApiApplication) =>
              application.id === current.id
          ) ?? null
        );
      });
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, [numericJobId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const selectedJob =
    numericJobId === null
      ? undefined
      : jobs.find((job) => job.id === numericJobId);

  const filteredApplications = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return applications.filter((app) => {
      const qualificationText = (app.qualifications ?? [])
        .map(
          (qualification) =>
            `${qualification.course} ${qualification.year} ${qualification.collegeName}`
        )
        .join(" ");

      const skillsText = (app.technical_skills ?? []).join(" ");

      const searchableValues = [
        getFullName(app),
        app.email,
        app.phone ?? "",
        app.experience ?? "",
        app.job_title ?? "",
        qualificationText,
        skillsText,
      ];

      const matchesSearch =
        !search ||
        searchableValues.some((value) =>
          value.toLowerCase().includes(search)
        );

      const matchesStatus =
        statusFilter === "All" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const statusCounts = useMemo(
    () => ({
      all: applications.length,
      new: applications.filter((app) => app.status === "new").length,
      reviewing: applications.filter(
        (app) => app.status === "reviewing"
      ).length,
      shortlisted: applications.filter(
        (app) => app.status === "shortlisted"
      ).length,
      hired: applications.filter((app) => app.status === "hired").length,
    }),
    [applications]
  );

  const changeStatus = async (
    application: ApiApplication,
    status: ApplicationStatus
  ) => {
    if (application.status === status) return;

    setUpdatingId(application.id);
    setError("");
    setNotice(null);

    try {
      const response = await updateApplication(application.id, {
        status,
      });

      const updated = response.data?.data;
      const emailSent = response.data?.emailSent;

      const updatedApplication: ApiApplication = updated?.id
        ? updated
        : { ...application, status };

      setApplications((current) =>
        current.map((item) =>
          item.id === application.id
            ? { ...item, ...updatedApplication }
            : item
        )
      );

      setSelectedApplication((current) =>
        current?.id === application.id
          ? { ...current, ...updatedApplication }
          : current
      );

      if (emailSent === false) {
        setNotice({
          type: "warning",
          message:
            "Application status updated, but the email could not be sent. Please check the backend SMTP configuration.",
        });
      } else if (emailSent === true) {
        setNotice({
          type: "success",
          message:
            response.data?.message ||
            `Status updated to ${statusLabel(status)}. Email sent successfully.`,
        });
      } else {
        setNotice({
          type: "success",
          message:
            response.data?.message ||
            `Application status updated to ${statusLabel(status)}.`,
        });
      }
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setUpdatingId(null);
    }
  };

  if (routeJobId && numericJobId === null) {
    return (
      <div className="w-full p-3 sm:p-5 lg:p-6">
        <div className="rounded-xl border border-[#E7E6F1] bg-white p-8 text-center dark:border-[#514C87] dark:bg-[#302A78]">
          <BriefcaseBusiness
            size={25}
            className="mx-auto text-[#3F3A8F] dark:text-[#D8D4F0]"
          />
          <h2 className="mt-3 text-sm font-semibold text-[#0B2545] dark:text-white">
            Invalid job ID
          </h2>
          <p className="mt-1 text-xs sm:text-[10px] text-[#77778A] dark:text-[#BDB9DD]">
            The job ID in this URL is not valid.
          </p>
        </div>
      </div>
    );
  }

  const getJobTitle = (application: ApiApplication) =>
    application.job_title ??
    jobs.find((job) => job.id === application.job_id)?.title ??
    `Job #${application.job_id}`;

  return (
    <div className="w-full p-3 text-[#25224F] transition-colors sm:p-5 lg:p-6 dark:text-[#F5F3FB]">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] sm:text-[9px] font-semibold uppercase tracking-[0.14em] text-[#7779C6] dark:text-[#BDB9ED]">
            <BriefcaseBusiness size={13} />
            Recruitment Management
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="break-words text-xl sm:text-lg font-semibold tracking-tight text-[#0B2545] sm:text-xl dark:text-white">
              {selectedJob?.title ?? "Job Applications"}
            </h1>

            {selectedJob && (
              <span className="rounded-full bg-[#EEF0FA] px-2.5 py-1 text-[11px] sm:text-[9px] font-semibold text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]">
                {selectedJob.employment_type}
              </span>
            )}
          </div>

          <p className="mt-1 text-xs sm:text-[10px] leading-5 text-[#77778A] sm:text-xs dark:text-[#BDB9DD]">
            {selectedJob
              ? "Review and manage applicants for this position."
              : "Review, manage and track candidate applications."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadData()}
          disabled={loading}
          className="inline-flex h-10 sm:h-9 w-fit items-center justify-center gap-1.5 rounded-lg border border-[#D8D7ED] bg-white px-3 text-xs sm:text-[10px] font-medium text-[#3F3A8F] transition hover:bg-[#EEF0FA] disabled:opacity-50 dark:border-[#625D9A] dark:bg-[#302A78] dark:text-[#D8D4F0] dark:hover:bg-[#454078]"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ALERTS */}
      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start justify-between gap-3 rounded-lg border border-[#F2B8B5] bg-[#FDECEC] px-3 py-2.5 text-xs sm:text-[10px] text-[#B42318] dark:border-[#85434A] dark:bg-[#572D38] dark:text-[#FFB8B8]"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {notice && (
        <div
          role="status"
          className={`mt-4 flex items-start justify-between gap-3 rounded-lg border px-3 py-2.5 text-xs sm:text-[10px] ${
            notice.type === "warning"
              ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-[#80633B] dark:bg-[#59452B] dark:text-[#FFD28A]"
              : "border-[#B7E4C7] bg-[#E9F7EF] text-[#1D7A46] dark:border-[#37694F] dark:bg-[#214B3A] dark:text-[#A8E6C1]"
          }`}
        >
          <span>{notice.message}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss message"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {numericJobId !== null && !loading && !selectedJob && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs sm:text-[10px] text-amber-800 dark:border-[#80633B] dark:bg-[#59452B] dark:text-[#FFD28A]">
          The job opening could not be found. Showing any applications returned for this job ID.
        </div>
      )}

      {/* SUMMARY */}
      {!loading && (
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5 sm:gap-3">
          <SummaryCard
            label="Total Applicants"
            value={statusCounts.all}
            icon={<UserRound size={14} />}
            active={statusFilter === "All"}
            onClick={() => setStatusFilter("All")}
          />

          <SummaryCard
            label="New"
            value={statusCounts.new}
            icon={<BriefcaseBusiness size={14} />}
            active={statusFilter === "new"}
            onClick={() => setStatusFilter("new")}
          />

          <SummaryCard
            label="Reviewing"
            value={statusCounts.reviewing}
            icon={<Clock3 size={14} />}
            active={statusFilter === "reviewing"}
            onClick={() => setStatusFilter("reviewing")}
          />

          <SummaryCard
            label="Shortlisted"
            value={statusCounts.shortlisted}
            icon={<CheckCircle2 size={14} />}
            active={statusFilter === "shortlisted"}
            onClick={() => setStatusFilter("shortlisted")}
          />

          <SummaryCard
            label="Hired"
            value={statusCounts.hired}
            icon={<CheckCircle2 size={14} />}
            active={statusFilter === "hired"}
            onClick={() => setStatusFilter("hired")}
          />
        </div>
      )}

      {/* SEARCH AND FILTER */}
      <section className="mt-4 rounded-xl border border-[#E7E6F1] bg-white p-3 dark:border-[#514C87] dark:bg-[#302A78]">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7779C6]"
            />

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search applicants, email, course or skills..."
              className="h-10 sm:h-9 w-full rounded-lg border border-[#D8D7ED] bg-[#F8F7FC] pl-9 pr-3 text-xs sm:text-[11px] text-[#25224F] outline-none placeholder:text-[#9998A7] focus:border-[#6668B8] dark:border-[#625D9A] dark:bg-[#25235F] dark:text-white"
            />
          </div>

          <div className="relative">
            <Filter
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7779C6]"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="h-10 sm:h-9 w-full appearance-none rounded-lg border border-[#D8D7ED] bg-[#F8F7FC] pl-9 pr-8 text-xs sm:text-[11px] text-[#25224F] outline-none focus:border-[#6668B8] sm:w-44 dark:border-[#625D9A] dark:bg-[#25235F] dark:text-white"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "All"
                    ? "All Statuses"
                    : statusLabel(status)}
                </option>
              ))}
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7779C6]"
            />
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] sm:text-[9px] text-[#77778A] dark:text-[#BDB9DD]">
            Showing{" "}
            <span className="font-semibold text-[#3F3A8F] dark:text-[#D8D4F0]">
              {filteredApplications.length}
            </span>{" "}
            of {applications.length} applications
          </p>

          {(searchTerm || statusFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
              }}
              className="text-[11px] sm:text-[9px] font-semibold text-[#3F3A8F] hover:underline dark:text-[#D8D4F0]"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* APPLICANT RECORDS */}
      <section className="mt-3 overflow-hidden rounded-xl border border-[#E7E6F1] bg-white dark:border-[#514C87] dark:bg-[#302A78]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7E6F1] px-3.5 py-3 dark:border-[#514C87] sm:px-4">
          <div>
            <h2 className="text-sm sm:text-[11px] font-semibold text-[#25224F] dark:text-white">
              Applicant Records
            </h2>
            <p className="mt-0.5 text-[11px] sm:text-[9px] text-[#77778A] dark:text-[#BDB9DD]">
              View candidate information and update application status.
            </p>
          </div>

          <span className="rounded-full bg-[#EEF0FA] px-2.5 py-1 text-[11px] sm:text-[9px] font-semibold text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]">
            {filteredApplications.length} Records
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-2 text-[#3F3A8F] dark:text-[#D8D4F0]">
            <RefreshCw size={17} className="animate-spin" />
            <span className="text-xs sm:text-[10px] font-medium">
              Loading applications...
            </span>
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="divide-y divide-[#E7E6F1] dark:divide-[#514C87]">
            {filteredApplications.map((app) => {
              const fullName = getFullName(app);

              const courseNames = (app.qualifications ?? [])
                .map((qualification) => qualification.course)
                .filter(Boolean)
                .join(", ");

              const jobTitle = getJobTitle(app);

              return (
                <article
                  key={app.id}
                  className="p-3 transition hover:bg-[#FAF9FD] sm:p-3.5 dark:hover:bg-[#25235F]"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    {/* APPLICANT INFORMATION */}
                    <div className="flex min-w-0 items-start gap-2.5">
                      <div className="flex h-10 w-10 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FA] text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]">
                        <UserRound size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="break-words text-sm sm:text-[12px] font-semibold text-[#0B2545] dark:text-white">
                            {fullName}
                          </h3>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] sm:text-[9px] font-semibold capitalize ${getStatusStyle(
                              app.status
                            )}`}
                          >
                            {app.status}
                          </span>
                        </div>

                        <p className="mt-1 flex items-center gap-1 break-all text-xs sm:text-[10px] text-[#77778A] dark:text-[#BDB9DD]">
                          <Mail size={12} className="shrink-0" />
                          {app.email}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] sm:text-[9px] text-[#77778A] dark:text-[#BDB9DD]">
                          <span className="inline-flex items-center gap-1">
                            <Phone size={11} />
                            {app.phone || "No phone"}
                          </span>

                          <span className="inline-flex min-w-0 items-center gap-1">
                            <GraduationCap size={12} />
                            <span className="max-w-[220px] truncate">
                              {courseNames || "No qualification"}
                            </span>
                          </span>

                          <span className="inline-flex items-center gap-1">
                            <CalendarDays size={11} />
                            {formatDate(app.applied_at)}
                          </span>
                        </div>

                        {!selectedJob && (
                          <p className="mt-2 inline-flex max-w-full items-center gap-1 text-[11px] sm:text-[9px] font-medium text-[#3F3A8F] dark:text-[#D8D4F0]">
                            <BriefcaseBusiness
                              size={11}
                              className="shrink-0"
                            />
                            <span className="truncate">{jobTitle}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap items-center gap-2 border-t border-[#F0EFF5] pt-2.5 sm:flex-nowrap lg:border-0 lg:pt-0">
                      <button
                        type="button"
                        onClick={() => setSelectedApplication(app)}
                        className="inline-flex h-9 sm:h-8 flex-1 items-center justify-center gap-1 rounded-lg border border-[#D8D7ED] bg-white px-3 text-xs sm:text-[10px] font-semibold text-[#3F3A8F] transition hover:bg-[#EEF0FA] sm:flex-none dark:border-[#625D9A] dark:bg-[#25235F] dark:text-[#D8D4F0] dark:hover:bg-[#454078]"
                      >
                        View Details
                      </button>

                      <div className="relative min-w-0 flex-1 sm:flex-none">
                        <select
                          aria-label={`Update status for ${fullName}`}
                          disabled={updatingId === app.id}
                          value={app.status}
                          onChange={(event) =>
                            void changeStatus(
                              app,
                              event.target.value as ApplicationStatus
                            )
                          }
                          className="h-9 sm:h-8 w-full min-w-0 appearance-none rounded-lg border border-[#D8D7ED] bg-[#F8F7FC] pl-2.5 pr-7 text-xs sm:text-[10px] font-medium text-[#3F3A8F] outline-none focus:border-[#6668B8] disabled:opacity-50 sm:min-w-[135px] dark:border-[#625D9A] dark:bg-[#25235F] dark:text-[#D8D4F0]"
                        >
                          {statusOptions
                            .filter((status) => status !== "All")
                            .map((status) => (
                              <option key={status} value={status}>
                                {statusLabel(status)}
                              </option>
                            ))}
                        </select>

                        {updatingId === app.id ? (
                          <RefreshCw
                            size={12}
                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-[#3F3A8F]"
                          />
                        ) : (
                          <ChevronDown
                            size={12}
                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7779C6]"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-52 flex-col items-center justify-center px-5 py-10 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF0FA] text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]">
              <BriefcaseBusiness size={19} />
            </div>

            <h3 className="mt-3 text-sm sm:text-[12px] font-semibold text-[#0B2545] dark:text-white">
              No applications found
            </h3>

            <p className="mt-1 max-w-xs text-xs sm:text-[10px] leading-5 text-[#77778A] dark:text-[#BDB9DD]">
              No applicants match your current search or status filter.
            </p>

            {(searchTerm || statusFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="mt-3 text-xs sm:text-[10px] font-semibold text-[#3F3A8F] hover:underline dark:text-[#D8D4F0]"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* APPLICANT DETAILS MODAL */}
      {selectedApplication && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0B2545]/55 p-0 backdrop-blur-[3px] sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedApplication(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="applicant-details-title"
            className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-[#E7E6F1] bg-[#FAF9FD] shadow-2xl dark:border-[#514C87] dark:bg-[#25235F] sm:my-auto sm:max-h-[90vh] sm:max-w-[680px] sm:rounded-2xl"
          >
            {/* MODAL HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#E7E6F1] bg-white px-4 py-3 dark:border-[#514C87] dark:bg-[#302A78] sm:px-5">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-10 w-10 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FA] text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]">
                  <UserRound size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] sm:text-[9px] font-semibold uppercase tracking-[0.12em] text-[#7779C6] dark:text-[#BDB9ED]">
                    Applicant Information
                  </p>

                  <h3
                    id="applicant-details-title"
                    className="mt-0.5 truncate text-base sm:text-[13px] font-semibold text-[#0B2545] dark:text-white"
                  >
                    {getFullName(selectedApplication)}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                aria-label="Close applicant details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E7E6F1] text-[#77778A] transition hover:bg-[#EEF0FA] hover:text-[#3F3A8F] dark:border-[#625D9A] dark:text-[#D8D4F0] dark:hover:bg-[#454078]"
              >
                <X size={15} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#FAF9FD] p-3.5 dark:bg-[#25235F] sm:p-5">

              {/* STATUS */}
              <section className="flex flex-col gap-3 rounded-xl border border-[#E7E6F1] bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-[#514C87] dark:bg-[#302A78]">
                <div>
                  <p className="text-[11px] sm:text-[9px] font-semibold uppercase tracking-[0.1em] text-[#77778A] dark:text-[#BDB9DD]">
                    Current Application Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] sm:text-[9px] font-semibold capitalize ${getStatusStyle(
                      selectedApplication.status
                    )}`}
                  >
                    {selectedApplication.status}
                  </span>
                </div>

                <div className="sm:text-right">
                  <p className="text-[11px] sm:text-[9px] font-semibold uppercase tracking-[0.1em] text-[#77778A] dark:text-[#BDB9DD]">
                    Application ID
                  </p>
                  <p className="mt-1 text-sm sm:text-xs font-semibold text-[#3F3A8F] dark:text-[#D8D4F0]">
                    #{selectedApplication.id}
                  </p>
                </div>
              </section>

              {/* PERSONAL INFORMATION */}
              <section className="rounded-xl border border-[#E7E6F1] bg-white p-3.5 dark:border-[#514C87] dark:bg-[#302A78]">
                <SectionHeading
                  icon={<UserRound size={14} />}
                  title="Personal Information"
                />

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <DetailCard
                    label="Full Name"
                    value={getFullName(selectedApplication)}
                  />

                  <DetailCard
                    label="Email Address"
                    value={selectedApplication.email}
                  />

                  <DetailCard
                    label="Mobile Number"
                    value={selectedApplication.phone || "Not provided"}
                  />

                  <DetailCard
                    label="Experience"
                    value={selectedApplication.experience || "Not provided"}
                  />

                  <DetailCard
                    label="Applied Date"
                    value={formatDate(selectedApplication.applied_at)}
                  />

                  <DetailCard
                    label="Applied Position"
                    value={getJobTitle(selectedApplication)}
                  />
                </div>
              </section>

              {/* EDUCATION */}
              <section className="rounded-xl border border-[#E7E6F1] bg-white p-3.5 dark:border-[#514C87] dark:bg-[#302A78]">
                <SectionHeading
                  icon={<GraduationCap size={15} />}
                  title="Education Details"
                />

                {(selectedApplication.qualifications ?? []).length > 0 ? (
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {selectedApplication.qualifications.map(
                      (qualification, index) => (
                        <div
                          key={`${qualification.course}-${index}`}
                          className="rounded-lg border border-[#E7E6F1] bg-[#F8F7FC] p-3 dark:border-[#514C87] dark:bg-[#25235F]"
                        >
                          <p className="text-sm sm:text-[11px] font-semibold text-[#25224F] dark:text-white">
                            {qualification.course || "Course not provided"}
                          </p>

                          <p className="mt-1.5 text-xs sm:text-[10px] text-[#77778A] dark:text-[#BDB9DD]">
                            {qualification.collegeName ||
                              "College not provided"}
                          </p>

                          <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] sm:text-[9px] text-[#77778A] dark:text-[#BDB9DD]">
                            <CalendarDays size={11} />
                            Year: {qualification.year || "Not provided"}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-xs sm:text-[10px] text-[#77778A] dark:text-[#BDB9DD]">
                    No education details provided.
                  </p>
                )}
              </section>

              {/* TECHNICAL SKILLS */}
              <section className="rounded-xl border border-[#E7E6F1] bg-white p-3.5 dark:border-[#514C87] dark:bg-[#302A78]">
                <SectionHeading
                  icon={<Code2 size={15} />}
                  title="Technical Skills"
                />

                {(selectedApplication.technical_skills ?? []).length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selectedApplication.technical_skills.map(
                      (skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="rounded-full border border-[#D8D7ED] bg-[#EEF0FA] px-2.5 py-1 text-[11px] sm:text-[9px] font-medium text-[#3F3A8F] dark:border-[#625D9A] dark:bg-[#454078] dark:text-[#D8D4F0]"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-xs sm:text-[10px] text-[#77778A] dark:text-[#BDB9DD]">
                    No technical skills provided.
                  </p>
                )}
              </section>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#E7E6F1] bg-white px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-[#514C87] dark:bg-[#302A78]">
              <button
                type="button"
                onClick={() =>
                  downloadApplicationPdf(selectedApplication)
                }
                className="inline-flex h-10 sm:h-9 items-center justify-center gap-1.5 rounded-lg border border-[#D8D7ED] px-3 text-xs sm:text-[10px] font-semibold text-[#3F3A8F] transition hover:bg-[#EEF0FA] dark:border-[#625D9A] dark:text-[#D8D4F0] dark:hover:bg-[#454078]"
              >
                <Download size={13} />
                Download PDF
              </button>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setSelectedApplication(null)}
                  className="inline-flex h-10 sm:h-9 items-center justify-center rounded-lg border border-[#D8D7ED] px-4 text-xs sm:text-[10px] font-semibold text-[#55556A] transition hover:bg-[#EEF0FA] dark:border-[#625D9A] dark:text-[#D8D4F0] dark:hover:bg-[#454078]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function SummaryCard({
  label,
  value,
  icon,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-0 rounded-xl border p-3 text-left transition sm:p-3.5 ${
        active
          ? "border-[#BDB7DE] bg-[#F0EFFA] dark:border-[#7770B5] dark:bg-[#454078]"
          : "border-[#E7E6F1] bg-white hover:border-[#C9C5E5] dark:border-[#514C87] dark:bg-[#302A78]"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            active
              ? "bg-[#3F3A8F] text-white"
              : "bg-[#EEF0FA] text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]"
          }`}
        >
          {icon}
        </span>

        <span className="text-xl sm:text-lg font-semibold tabular-nums text-[#0B2545] dark:text-white">
          {value}
        </span>
      </div>

      <p className="mt-2.5 truncate text-[11px] sm:text-[9px] font-medium text-[#77778A] sm:text-[10px] dark:text-[#BDB9DD]">
        {label}
      </p>
    </button>
  );
}

function SectionHeading({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-[#EEF0FA] text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]">
        {icon}
      </span>

      <h4 className="text-sm sm:text-[11px] font-semibold text-[#25224F] dark:text-white">
        {title}
      </h4>
    </div>
  );
}

function DetailCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-[#E7E6F1] bg-[#F8F7FC] p-3 dark:border-[#514C87] dark:bg-[#25235F]">
      <p className="text-[11px] sm:text-[9px] font-semibold uppercase tracking-[0.06em] text-[#77778A] dark:text-[#BDB9DD]">
        {label}
      </p>

      <p className="mt-1.5 break-words text-xs sm:text-[10px] font-medium leading-5 text-[#25224F] dark:text-white">
        {value}
      </p>
    </div>
  );
}

export default JobApplications;
