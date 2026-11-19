
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  Eye,
  RefreshCw,
  Search,
  Users,
  X,
  UserRound,
  GraduationCap,
  BookOpen,
  MessageSquareText,
  ClipboardList,
} from "lucide-react";
import { motion } from "motion/react";

import {
  getMentorshipApplications,
  updateMentorshipApplicationStatus,
  type MentorshipApplication,
  type MentorshipApplicationStatus,
} from "../../services/mentorshipApplicationApi";

type StatusFilter = "all" | MentorshipApplicationStatus;

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const applicationStatuses: {
  value: MentorshipApplicationStatus;
  label: string;
}[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const getStatusClass = (status: MentorshipApplicationStatus) => {
  switch (status) {
    case "approved":
      return "bg-[#E9F7EF] text-[#1D7A46] dark:bg-[#214B3B] dark:text-[#A8E6C1]";
    case "pending":
      return "bg-[#FFF5E6] text-[#A96800] dark:bg-[#59452B] dark:text-[#FFD28A]";
    case "rejected":
      return "bg-[#FDECEC] text-[#B42318] dark:bg-[#572D38] dark:text-[#FFB8B8]";
    default:
      return "bg-[#F3F4F6] text-[#667085] dark:bg-[#454078] dark:text-[#D8D4F0]";
  }
};

const getStatusLabel = (status: MentorshipApplicationStatus) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const getFullName = (application: MentorshipApplication) =>
  [application.first_name, application.last_name]
    .filter(Boolean)
    .join(" ");

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const MentorshipApplications = () => {
  const [applications, setApplications] = useState<MentorshipApplication[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [selectedApplication, setSelectedApplication] =
    useState<MentorshipApplication | null>(null);

  const [draftStatus, setDraftStatus] =
    useState<MentorshipApplicationStatus>("pending");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // LOAD APPLICATIONS
  const loadApplications = useCallback(async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");
    setSuccess("");

    try {
      const records = await getMentorshipApplications();

      setApplications(records);

      setSelectedApplication((current) => {
        if (!current) return null;

        return records.find((item) => item.id === current.id) ?? null;
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load mentorship applications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  // KEEP DROPDOWN IN SYNC WITH THE SELECTED APPLICATION
  useEffect(() => {
    setDraftStatus(selectedApplication?.status ?? "pending");
  }, [selectedApplication?.id, selectedApplication?.status]);

  // SEARCH AND FILTER
  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((application) => {
      const name = getFullName(application);
      const program = application.program_title || "";

      const matchesSearch =
        !query ||
        name.toLowerCase().includes(query) ||
        application.email.toLowerCase().includes(query) ||
        program.toLowerCase().includes(query) ||
        String(application.id).includes(query);

      const matchesStatus =
        statusFilter === "all" || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  // UPDATE STATUS IN DATABASE FIRST
  const handleUpdateStatus = async () => {
    if (!selectedApplication || savingStatus) return;

    if (draftStatus === selectedApplication.status) {
      setError("Please select a different status before updating.");
      return;
    }

    setSavingStatus(true);
    setError("");
    setSuccess("");

    try {
      // STEP 1: Send the selected status to the backend.
      await updateMentorshipApplicationStatus(
        selectedApplication.id,
        draftStatus
      );

      // STEP 2: Fetch the latest record from the database.
      const latestRecords = await getMentorshipApplications();

      const updatedApplication = latestRecords.find(
        (item) => item.id === selectedApplication.id
      );

      // STEP 3: Verify the saved status.
      if (!updatedApplication || updatedApplication.status !== draftStatus) {
        throw new Error(
          `The server did not confirm the ${draftStatus} status. Please check your backend and database.`
        );
      }

      // STEP 4: Update the frontend with the saved record.
      setApplications(latestRecords);
      setSelectedApplication(updatedApplication);

      setSuccess(
        `Application status updated to ${getStatusLabel(draftStatus)} successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update application status."
      );

      try {
        const latestRecords = await getMentorshipApplications();

        setApplications(latestRecords);

        const latestSelected = latestRecords.find(
          (item) => item.id === selectedApplication.id
        );

        setSelectedApplication(latestSelected ?? null);
      } catch {
        // Keep the original error message.
      }
    } finally {
      setSavingStatus(false);
    }
  };

  // CLOSE POPUP
  const closeDrawer = () => {
    if (savingStatus) return;

    setSelectedApplication(null);
    setError("");
    setSuccess("");
  };

  return (
    <div className="w-full p-3 text-[#25224F] transition-colors sm:p-5 lg:p-6 dark:text-[#F5F3FB]">
      {/* PAGE HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7779C6] sm:text-[9px] dark:text-[#BDB9ED]">
              Mentorship
            </p>

            <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#0B2545] sm:text-xl dark:text-white">
              Applications
            </h1>

            <p className="mt-1 max-w-xl text-xs leading-5 text-[#77778A] sm:text-xs dark:text-[#BDB9DD]">
              Review mentorship applications and manage applicant status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF0FA] text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]">
              <Users size={16} />
            </div>

            <div>
              <p className="text-base font-semibold text-[#0B2545] sm:text-sm dark:text-white">
                {applications.length}
              </p>
              <p className="text-[11px] text-[#77778A] sm:text-[9px] dark:text-[#BDB9DD]">
                Total Applications
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadApplications(true)}
              disabled={refreshing || loading}
              className="ml-2 inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D8D7ED] bg-white px-3 text-xs font-medium text-[#3F3A8F] transition hover:bg-[#EEF0FA] disabled:opacity-50 sm:text-[10px] dark:border-[#625D9A] dark:bg-[#302A78] dark:text-[#D8D4F0] dark:hover:bg-[#454078]"
            >
              <RefreshCw
                size={12}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>
      </motion.div>

      {/* FEEDBACK */}
      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start justify-between gap-3 rounded-lg border border-[#F2B8B5] bg-[#FDECEC] px-3 py-2.5 text-sm text-[#B42318] sm:text-xs dark:border-[#85434A] dark:bg-[#572D38] dark:text-[#FFB8B8]"
        >
          <span>{error}</span>

          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setError("")}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-[#B7E4C7] bg-[#E9F7EF] px-3 py-2.5 text-sm text-[#1D7A46] sm:text-xs dark:border-[#386B51] dark:bg-[#214B3B] dark:text-[#A8E6C1]"
        >
          <span>{success}</span>

          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setSuccess("")}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="mt-5 flex flex-col gap-2 rounded-xl border border-[#E7E6F1] bg-white p-3 sm:flex-row dark:border-[#514C87] dark:bg-[#302A78]">
        <div className="relative min-w-0 flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7779C6]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, program or ID"
            className="h-10 w-full rounded-lg border border-[#D8D7ED] bg-[#F8F7FC] pl-9 pr-3 text-sm text-[#25224F] outline-none placeholder:text-[#9998A7] focus:border-[#6668B8] sm:text-xs dark:border-[#625D9A] dark:bg-[#25235F] dark:text-white dark:placeholder:text-[#BDB9DD]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as StatusFilter)
          }
          className="h-10 rounded-lg border border-[#D8D7ED] bg-[#F8F7FC] px-3 text-sm font-medium text-[#25224F] outline-none focus:border-[#6668B8] sm:w-44 sm:text-xs dark:border-[#625D9A] dark:bg-[#25235F] dark:text-white"
        >
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* APPLICATION TABLE */}
      <div className="mt-3 overflow-hidden rounded-xl border border-[#E7E6F1] bg-white dark:border-[#514C87] dark:bg-[#302A78]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-b border-[#E7E6F1] bg-[#F5F3FB] text-left dark:border-[#514C87] dark:bg-[#25235F]">
                {["Applicant", "Program", "Status", "Submitted", "Action"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#77778A] sm:text-[9px] dark:text-[#BDB9DD]"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-sm text-[#77778A] sm:text-xs dark:text-[#BDB9DD]"
                  >
                    Loading applications from the database...
                  </td>
                </tr>
              ) : filteredApplications.length > 0 ? (
                filteredApplications.map((application) => (
                  <tr
                    key={application.id}
                    className="border-b border-[#F0EFF7] transition-colors last:border-0 hover:bg-[#FAF9FD] dark:border-[#514C87] dark:hover:bg-[#353187]"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-[#25224F] sm:text-xs dark:text-white">
                        {getFullName(application) || "—"}
                      </p>

                      <p className="mt-0.5 text-xs text-[#77778A] sm:text-[10px] dark:text-[#BDB9DD]">
                        {application.email}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-[#25224F] sm:text-[11px] dark:text-[#F5F3FB]">
                        {application.program_title || "—"}
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#9998A7] sm:text-[9px] dark:text-[#A6A3C8]">
                        Application #{application.id}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-[9px] ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {getStatusLabel(application.status)}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-xs text-[#77778A] sm:text-[10px] dark:text-[#BDB9DD]">
                      {formatDate(application.applied_at)}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setSuccess("");
                          setSelectedApplication(application);
                        }}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#EEF0FA] px-3 text-xs font-semibold text-[#3F3A8F] transition hover:bg-[#3F3A8F] hover:text-white sm:text-[10px] dark:bg-[#454078] dark:text-[#F5F3FB] dark:hover:bg-[#6668B8]"
                      >
                        <Eye size={13} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <p className="text-base font-semibold text-[#25224F] sm:text-sm dark:text-white">
                      No applications found
                    </p>

                    <p className="mt-1 text-xs text-[#77778A] sm:text-[10px] dark:text-[#BDB9DD]">
                      {applications.length === 0
                        ? "Applications submitted through the website will appear here."
                        : "Try changing your search or status filter."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CENTERED APPLICATION POPUP */}
      {selectedApplication && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[#0B2545]/55 p-3 backdrop-blur-[3px] dark:bg-[#100D35]/75 sm:p-5">
          <button
            type="button"
            aria-label="Close application details"
            onClick={closeDrawer}
            disabled={savingStatus}
            className="absolute inset-0 cursor-default disabled:cursor-not-allowed"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-dialog-title"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl border border-[#E7E6F1] bg-[#FAF9FD] shadow-2xl dark:border-[#514C87] dark:bg-[#25235F]"
          >
            {/* POPUP HEADER */}
            <div className="shrink-0 border-b border-[#E7E6F1] bg-white px-4 py-4 dark:border-[#514C87] dark:bg-[#302A78] sm:px-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7779C6] sm:text-[9px] dark:text-[#BDB9ED]">
                    Mentorship Application
                  </p>

                  <h2
                    id="application-dialog-title"
                    className="mt-1 text-xl font-semibold text-[#0B2545] sm:text-lg dark:text-white"
                  >
                    Application Details
                  </h2>

                  <p className="mt-1 text-xs text-[#77778A] sm:text-[10px] dark:text-[#BDB9DD]">
                    Application #{selectedApplication.id} · Submitted{" "}
                    {formatDate(selectedApplication.applied_at)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeDrawer}
                  disabled={savingStatus}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E6F1] text-[#77778A] transition hover:bg-[#EEF0FA] hover:text-[#3F3A8F] disabled:opacity-50 dark:border-[#625D9A] dark:text-[#D8D4F0] dark:hover:bg-[#454078]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* APPLICANT SUMMARY */}
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#E7E6F1] bg-[#F5F3FB] p-3 dark:border-[#514C87] dark:bg-[#25235F]">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3F3A8F] text-white">
                  <UserRound size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-[#25224F] sm:text-sm dark:text-white">
                    {getFullName(selectedApplication) || "Applicant"}
                  </h3>

                  <p className="mt-0.5 truncate text-xs text-[#77778A] sm:text-[10px] dark:text-[#BDB9DD]">
                    {selectedApplication.email}
                  </p>

                  <p className="mt-1 text-xs font-medium text-[#3F3A8F] sm:text-[10px] dark:text-[#D8D4F0]">
                    {selectedApplication.program_title || "Mentorship Program"}
                  </p>
                </div>
              </div>
            </div>

            {/* POPUP CONTENT */}
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:px-6">
              {/* STATUS CONTROL */}
              <section className="rounded-xl border border-[#D8D4F0] bg-white p-4 dark:border-[#625D9A] dark:bg-[#302A78]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#77778A] sm:text-[9px] dark:text-[#BDB9DD]">
                      Current Application Status
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold sm:text-[10px] ${getStatusClass(
                        selectedApplication.status
                      )}`}
                    >
                      {getStatusLabel(selectedApplication.status)}
                    </span>
                  </div>

                  <div className="sm:w-52">
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#77778A] sm:text-[9px] dark:text-[#BDB9DD]">
                      Change Status
                    </label>

                    <select
                      aria-label="Change application status"
                      value={draftStatus}
                      disabled={savingStatus}
                      onChange={(event) => {
                        setDraftStatus(
                          event.target.value as MentorshipApplicationStatus
                        );
                        setError("");
                        setSuccess("");
                      }}
                      className="h-10 w-full rounded-lg border border-[#D8D7ED] bg-[#F8F7FC] px-3 text-sm font-medium text-[#25224F] outline-none focus:border-[#6668B8] disabled:opacity-50 sm:text-xs dark:border-[#625D9A] dark:bg-[#25235F] dark:text-white"
                    >
                      {applicationStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {savingStatus && (
                  <p className="mt-3 text-right text-xs text-[#77778A] sm:text-[10px] dark:text-[#BDB9DD]">
                    Updating status in the database. Please wait...
                  </p>
                )}
              </section>

              {/* APPLICANT INFORMATION */}
              <DetailSection
                icon={<UserRound size={15} />}
                title="Applicant Information"
              >
                <div className="grid gap-2 sm:grid-cols-2">
                  <Detail
                    label="First Name"
                    value={selectedApplication.first_name}
                  />

                  <Detail
                    label="Last Name"
                    value={selectedApplication.last_name}
                  />

                  <Detail
                    label="Email Address"
                    value={selectedApplication.email}
                  />

                  <Detail
                    label="Phone Number"
                    value={selectedApplication.phone}
                  />

                  <Detail
                    label="City"
                    value={selectedApplication.city}
                  />

                  <Detail
                    label="Submitted Date"
                    value={formatDate(selectedApplication.applied_at)}
                  />
                </div>
              </DetailSection>

              {/* EDUCATION DETAILS */}
              <DetailSection
                icon={<GraduationCap size={15} />}
                title="Education Details"
              >
                <div className="grid gap-2 sm:grid-cols-2">
                  <Detail
                    label="College"
                    value={selectedApplication.college}
                  />

                  <Detail
                    label="Course"
                    value={selectedApplication.course}
                  />

                  <Detail
                    label="Graduation Year"
                    value={selectedApplication.graduation_year}
                  />

                  <Detail
                    label="Education"
                    value={selectedApplication.education}
                  />
                </div>
              </DetailSection>

              {/* SELECTED PROGRAM */}
              <DetailSection
                icon={<BookOpen size={15} />}
                title="Selected Mentorship Program"
              >
                <div className="rounded-lg border border-[#E7E6F1] bg-[#F5F3FB] p-3 dark:border-[#514C87] dark:bg-[#25235F]">
                  <p className="text-base font-semibold text-[#3F3A8F] sm:text-sm dark:text-[#D8D4F0]">
                    {selectedApplication.program_title || "—"}
                  </p>

                  <div className="mt-2">
                    <Detail
                      label="Duration"
                      value={selectedApplication.duration}
                    />
                  </div>
                </div>
              </DetailSection>

              {/* GOALS */}
              <DetailSection
                icon={<ClipboardList size={15} />}
                title="Goals and Expectations"
              >
                <ContentText
                  value={selectedApplication.goals}
                  emptyText="No goals or expectations provided."
                />
              </DetailSection>

              {/* ADDITIONAL MESSAGE */}
              {selectedApplication.additional_message && (
                <DetailSection
                  icon={<MessageSquareText size={15} />}
                  title="Additional Message"
                >
                  <ContentText
                    value={selectedApplication.additional_message}
                  />
                </DetailSection>
              )}
            </div>

            {/* POPUP FOOTER */}
            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#E7E6F1] bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-[#514C87] dark:bg-[#302A78]">
              <p className="text-[11px] text-[#77778A] sm:text-[9px] dark:text-[#BDB9DD]">
                {draftStatus !== selectedApplication.status
                  ? "You have an unsaved status change."
                  : "Application status is up to date."}
              </p>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeDrawer}
                  disabled={savingStatus}
                  className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[#D8D7ED] px-5 text-xs font-semibold text-[#55556A] transition hover:bg-[#EEF0FA] disabled:opacity-50 sm:text-[10px] dark:border-[#625D9A] dark:text-[#D8D4F0] dark:hover:bg-[#454078]"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => void handleUpdateStatus()}
                  disabled={savingStatus}
                  className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-[#3F3A8F] px-5 text-xs font-semibold text-white transition hover:bg-[#302A78] disabled:cursor-not-allowed disabled:opacity-50 sm:text-[10px]"
                >
                  {savingStatus ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check size={13} />
                      Update
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// DETAIL SECTION
function DetailSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#E7E6F1] bg-white p-4 dark:border-[#514C87] dark:bg-[#302A78]">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF0FA] text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]">
          {icon}
        </div>

        <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#3F3A8F] sm:text-[10px] dark:text-[#D8D4F0]">
          {title}
        </h3>
      </div>

      {children}
    </section>
  );
}

// DETAIL FIELD
function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-[#E7E6F1] bg-[#FAF9FD] p-3 dark:border-[#514C87] dark:bg-[#25235F]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#77778A] sm:text-[9px] dark:text-[#BDB9DD]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-[#25224F] sm:text-xs dark:text-[#F5F3FB]">
        {value === null || value === undefined || value === "" ? "—" : value}
      </p>
    </div>
  );
}

// MULTILINE CONTENT
function ContentText({
  value,
  emptyText = "No information provided.",
}: {
  value?: string | null;
  emptyText?: string;
}) {
  return (
    <p className="whitespace-pre-wrap break-words rounded-lg bg-[#F8F7FC] p-3 text-sm leading-6 text-[#55556A] sm:text-[11px] sm:leading-5 dark:bg-[#25235F] dark:text-[#D8D4F0]">
      {value?.trim() || emptyText}
    </p>
  );
}

export default MentorshipApplications;
