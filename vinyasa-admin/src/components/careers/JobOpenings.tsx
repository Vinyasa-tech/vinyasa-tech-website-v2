import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Edit3,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
  RefreshCw,
  Clock3,
} from "lucide-react";

import {
  createJob,
  deleteJob,
  getApiError,
  getJobs,
  updateJob,
  type ApiJob,
  type CreateJobPayload,
  type UpdateJobPayload,
} from "../../services/careersApi";

type JobStatus = ApiJob["status"];
type WorkMode = ApiJob["work_mode"];

type JobForm = {
  title: string;
  location: string;
  experience: string;
  employment_type: ApiJob["employment_type"];
  work_mode: WorkMode;
  description: string;
  responsibilities: string;
  required_skills: string;
  qualifications: string;
  status: JobStatus;
};

const EMPTY_FORM: JobForm = {
  title: "",
  location: "",
  experience: "",
  employment_type: "Full Time",
  work_mode: "On-site",
  description: "",
  responsibilities: "",
  required_skills: "",
  qualifications: "",
  status: "open",
};

const statuses = ["All Status", "open", "closed", "draft"] as const;

const statusLabel = (status: JobStatus) =>
  status === "open" ? "Open" : status === "closed" ? "Closed" : "Draft";

const toText = (value: string | string[] | null | undefined) =>
  Array.isArray(value) ? value.join("\n") : value ?? "";

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

const toLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const inputClass =
  "h-9 w-full rounded-lg border border-[#D8D7ED] bg-white px-3 text-[12px] sm:text-[11px] text-[#25224F] outline-none transition placeholder:text-[#9998A7] focus:border-[#6668B8] focus:ring-2 focus:ring-[#3F3A8F]/10 dark:border-[#625D9A] dark:bg-[#25235F] dark:text-white dark:placeholder:text-[#A9A5C9]";

const textareaClass =
  "w-full resize-y rounded-lg border border-[#D8D7ED] bg-white px-3 py-2.5 text-[12px] sm:text-[11px] leading-5 text-[#25224F] outline-none transition placeholder:text-[#9998A7] focus:border-[#6668B8] focus:ring-2 focus:ring-[#3F3A8F]/10 dark:border-[#625D9A] dark:bg-[#25235F] dark:text-white dark:placeholder:text-[#A9A5C9]";

const labelClass =
  "mb-1.5 block text-[11px] sm:text-[10px] font-semibold text-[#55556A] dark:text-[#D8D4F0]";

export default function JobOpenings() {
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStatus, setSelectedStatus] =
    useState<(typeof statuses)[number]>("All Status");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [form, setForm] = useState<JobForm>(EMPTY_FORM);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getJobs();
      const payload = response.data?.data;

      if (!Array.isArray(payload)) {
        throw new Error("The jobs API did not return a job list.");
      }

      setJobs(payload);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  const filteredJobs = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return jobs.filter((job) => {
      const searchableText = [
        job.title,
        job.location,
        job.experience,
        job.employment_type,
        job.description,
        toText(job.responsibilities),
        toText(job.required_skills),
        toText(job.qualifications),
        job.work_mode,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !search || searchableText.includes(search);

      const matchesStatus =
        selectedStatus === "All Status" ||
        job.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, selectedStatus]);

  const openCreateModal = () => {
    setForm(EMPTY_FORM);
    setEditingJobId(null);
    setError("");
    setNotice("");
    setModalOpen(true);
  };

  const openEditModal = (job: ApiJob) => {
    setForm({
      title: job.title ?? "",
      location: job.location ?? "",
      experience: job.experience ?? "",
      employment_type: job.employment_type,
      work_mode: job.work_mode ?? "On-site",
      description: job.description ?? "",
      responsibilities: toText(job.responsibilities),
      required_skills: toText(job.required_skills),
      qualifications: toText(job.qualifications),
      status: job.status,
    });

    setEditingJobId(job.id);
    setError("");
    setNotice("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingJobId(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const handleSaveJob = async () => {
    if (
      !form.title.trim() ||
      !form.location.trim() ||
      !form.experience.trim() ||
      !form.description.trim()
    ) {
      setError(
        "Please fill in Job Title, Location, Experience, and About the Role."
      );
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    const payload: CreateJobPayload = {
      title: form.title.trim(),
      location: form.location.trim(),
      experience: form.experience.trim(),
      employment_type: form.employment_type,
      work_mode: form.work_mode,
      description: form.description.trim(),
      responsibilities: toLines(form.responsibilities),
      required_skills: toLines(form.required_skills),
      qualifications: toLines(form.qualifications),
      status: form.status,
    };

    try {
      const wasEditing = editingJobId !== null;

      if (editingJobId !== null) {
        const updatePayload: UpdateJobPayload = payload;
        await updateJob(editingJobId, updatePayload);
      } else {
        await createJob(payload);
      }

      setModalOpen(false);
      setEditingJobId(null);
      setForm(EMPTY_FORM);

      await loadJobs();

      setNotice(
        wasEditing ? "Job opening updated." : "Job opening created."
      );
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (job: ApiJob) => {
    const nextStatus: JobStatus =
      job.status === "open" ? "closed" : "open";

    setError("");
    setNotice("");

    try {
      await updateJob(job.id, { status: nextStatus });
      await loadJobs();

      setNotice(
        `Job marked ${statusLabel(nextStatus).toLowerCase()}.`
      );
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const removeJob = async (job: ApiJob) => {
    if (
      !window.confirm(
        `Delete "${job.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setError("");
    setNotice("");

    try {
      await deleteJob(job.id);
      await loadJobs();
      setNotice("Job opening deleted.");
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const openJobs = jobs.filter((job) => job.status === "open").length;
  const closedJobs = jobs.filter((job) => job.status === "closed").length;
  const draftJobs = jobs.filter((job) => job.status === "draft").length;

  return (
    <div className="w-full p-3 text-[#25224F] transition-colors sm:p-5 lg:p-6 dark:text-[#F5F3FB]">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] sm:text-[9px] font-semibold uppercase tracking-[0.14em] text-[#7779C6] dark:text-[#BDB9ED]">
            <BriefcaseBusiness size={13} />
            Careers Management
          </p>

          <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#0B2545] sm:text-xl dark:text-white">
            Job Openings
          </h1>

          <p className="mt-1 text-[12px] sm:text-xs leading-5 text-[#77778A] dark:text-[#BDB9DD]">
            Create, edit, manage and publish job opportunities on your careers page.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => void loadJobs()}
            type="button"
            disabled={loading}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#D8D7ED] bg-white px-3 text-[12px] sm:text-[10px] font-medium text-[#3F3A8F] transition hover:bg-[#EEF0FA] disabled:opacity-50 dark:border-[#625D9A] dark:bg-[#302A78] dark:text-[#D8D4F0] dark:hover:bg-[#454078]"
          >
            <RefreshCw
              size={12}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            onClick={openCreateModal}
            type="button"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#3F3A8F] px-3.5 text-[12px] sm:text-[10px] font-semibold text-white transition hover:bg-[#302A78]"
          >
            <Plus size={13} />
            Add Job Opening
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {error && !modalOpen && (
        <div
          role="alert"
          className="mt-4 flex items-start justify-between gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] sm:text-[10px] text-red-700 dark:border-[#85434A] dark:bg-[#572D38] dark:text-[#FFB8B8]"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="mt-4 flex items-start justify-between gap-2 rounded-lg border border-[#D8D7ED] bg-[#EEF0FA] px-3 py-2.5 text-[12px] sm:text-[10px] text-[#302A78] dark:border-[#625D9A] dark:bg-[#454078] dark:text-[#D8D4F0]"
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-4 sm:gap-3">
        <SummaryCard
          label="Total Positions"
          value={jobs.length}
          icon={<BriefcaseBusiness size={14} />}
        />

        <SummaryCard
          label="Open Positions"
          value={openJobs}
          icon={<CheckCircle2 size={14} />}
        />

        <SummaryCard
          label="Closed Positions"
          value={closedJobs}
          icon={<X size={14} />}
        />

        <SummaryCard
          label="Draft Positions"
          value={draftJobs}
          icon={<Clock3 size={14} />}
        />
      </div>

      {/* SEARCH AND FILTER */}
      <section className="mt-4 rounded-xl border border-[#E7E6F1] bg-white p-3 dark:border-[#514C87] dark:bg-[#302A78]">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_180px]">
          <div className="relative min-w-0">
            <Search
              size={13}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7779C6]"
            />

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search title, location, skills..."
              className={`${inputClass} pl-9`}
            />
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(
                  event.target.value as (typeof statuses)[number]
                )
              }
              className={`${inputClass} appearance-none pr-8`}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "All Status" ? status : statusLabel(status)}
                </option>
              ))}
            </select>

            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7779C6]">
              <X size={11} className="hidden" />
            </span>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] sm:text-[9px] text-[#77778A] dark:text-[#BDB9DD]">
            Showing{" "}
            <span className="font-semibold text-[#3F3A8F] dark:text-[#D8D4F0]">
              {filteredJobs.length}
            </span>{" "}
            of {jobs.length} job openings
          </p>

          {(searchTerm || selectedStatus !== "All Status") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus("All Status");
              }}
              className="text-[11px] sm:text-[9px] font-semibold text-[#3F3A8F] hover:underline dark:text-[#D8D4F0]"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* JOB LIST */}
      <section className="mt-3 overflow-hidden rounded-xl border border-[#E7E6F1] bg-white dark:border-[#514C87] dark:bg-[#302A78]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7E6F1] px-3.5 py-3 dark:border-[#514C87] sm:px-4">
          <div>
            <h2 className="text-[13px] sm:text-[11px] font-semibold text-[#25224F] dark:text-white">
              Published Job Records
            </h2>
            <p className="mt-0.5 text-[11px] sm:text-[9px] text-[#77778A] dark:text-[#BDB9DD]">
              Manage your current job opportunities.
            </p>
          </div>

          <span className="rounded-full bg-[#EEF0FA] px-2.5 py-1 text-[11px] sm:text-[9px] font-semibold text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]">
            {filteredJobs.length} Records
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-2 text-[#3F3A8F] dark:text-[#D8D4F0]">
            <RefreshCw size={16} className="animate-spin" />
            <span className="text-[12px] sm:text-[10px] font-medium">
              Loading job openings...
            </span>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="divide-y divide-[#E7E6F1] dark:divide-[#514C87]">
            {filteredJobs.map((job) => (
              <article
                key={job.id}
                className="p-3 transition hover:bg-[#FAF9FD] sm:p-3.5 dark:hover:bg-[#25235F]"
              >
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  {/* JOB INFORMATION */}
                  <div className="flex min-w-0 flex-1 items-start gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FA] text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]">
                      <BriefcaseBusiness size={15} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="break-words text-[14px] sm:text-[12px] font-semibold text-[#0B2545] dark:text-white">
                          {job.title}
                        </h3>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] sm:text-[9px] font-semibold ${
                            job.status === "open"
                              ? "bg-[#EEF0FA] text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]"
                              : job.status === "closed"
                                ? "bg-[#FDECEC] text-[#B42318] dark:bg-[#572D38] dark:text-[#FFB8B8]"
                                : "bg-[#F3F4F6] text-[#667085] dark:bg-[#454078] dark:text-[#D8D4F0]"
                          }`}
                        >
                          {statusLabel(job.status)}
                        </span>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-[9px] text-[#77778A] dark:text-[#BDB9DD]">
                        <span>{job.employment_type}</span>
                        <span>•</span>
                        <span>{job.work_mode ?? "On-site"}</span>
                        <span>•</span>
                        <span>{job.experience}</span>
                        <span>•</span>

                        <span className="inline-flex items-center gap-1">
                          <MapPin size={10} />
                          {job.location}
                        </span>
                      </div>

                      <p className="mt-2 max-w-4xl whitespace-pre-line text-[12px] sm:text-[10px] leading-5 sm:leading-5 text-[#55556A] dark:text-[#D0CCE8]">
                        {job.description}
                      </p>

                      {toText(job.required_skills) && (
                        <p className="mt-2 line-clamp-2 text-[11px] sm:text-[9px] leading-5 sm:leading-4 text-[#77778A] dark:text-[#BDB9DD]">
                          <span className="font-semibold">
                            Required Skills:{" "}
                          </span>
                          {toText(job.required_skills).replace(/\n/g, ", ")}
                        </p>
                      )}

                      <p className="mt-1.5 text-[11px] sm:text-[9px] text-[#9998A7] dark:text-[#A9A5C9]">
                        Created: {formatDate(job.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* JOB ACTIONS */}
                  <div className="flex flex-wrap gap-2 border-t border-[#F0EFF5] pt-2.5 sm:flex-nowrap xl:border-0 xl:pt-0">
                    <button
                      type="button"
                      onClick={() => openEditModal(job)}
                      className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#D8D7ED] bg-white px-3 text-[12px] sm:text-[10px] font-semibold text-[#3F3A8F] transition hover:bg-[#EEF0FA] sm:flex-none dark:border-[#625D9A] dark:bg-[#25235F] dark:text-[#D8D4F0] dark:hover:bg-[#454078]"
                    >
                      <Edit3 size={12} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => void changeStatus(job)}
                      className="inline-flex h-8 flex-1 items-center justify-center rounded-lg border border-[#D8D7ED] bg-white px-3 text-[12px] sm:text-[10px] font-semibold text-[#55556A] transition hover:bg-[#F8F7FC] sm:flex-none dark:border-[#625D9A] dark:bg-[#25235F] dark:text-[#D8D4F0] dark:hover:bg-[#454078]"
                    >
                      {job.status === "open" ? "Close Opening" : "Reopen"}
                    </button>

                    <button
                      type="button"
                      onClick={() => void removeJob(job)}
                      className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-100 bg-white px-3 text-[12px] sm:text-[10px] font-semibold text-red-500 transition hover:bg-red-50 sm:flex-none dark:border-[#85434A] dark:bg-[#302A78] dark:text-[#FFB8B8] dark:hover:bg-[#572D38]"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex min-h-52 flex-col items-center justify-center px-5 py-10 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FA] text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]">
              <Search size={17} />
            </div>

            <h3 className="mt-3 text-[14px] sm:text-[12px] font-semibold text-[#0B2545] dark:text-white">
              No job openings found
            </h3>

            <p className="mt-1 max-w-xs text-[12px] sm:text-[10px] leading-5 text-[#77778A] dark:text-[#BDB9DD]">
              Try changing your search or filters, or add a new job opening.
            </p>

            {(searchTerm || selectedStatus !== "All Status") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("All Status");
                }}
                className="mt-3 text-[12px] sm:text-[10px] font-semibold text-[#3F3A8F] hover:underline dark:text-[#D8D4F0]"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0B2545]/55 p-0 backdrop-blur-[3px] sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              closeModal();
            }
          }}
        >
          <div className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-[#E7E6F1] bg-[#FAF9FD] shadow-2xl dark:border-[#514C87] dark:bg-[#25235F] sm:my-auto sm:max-h-[90vh] sm:max-w-[680px] sm:rounded-2xl">
            {/* MODAL HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#E7E6F1] bg-white px-3.5 py-3 dark:border-[#514C87] dark:bg-[#302A78] sm:px-5">
              <div>
                <p className="text-[11px] sm:text-[9px] font-semibold uppercase tracking-[0.12em] text-[#7779C6] dark:text-[#BDB9ED]">
                  Careers Management
                </p>

                <h3 className="mt-0.5 text-[15px] sm:text-[13px] font-semibold text-[#0B2545] dark:text-white">
                  {editingJobId !== null
                    ? "Edit Job Opening"
                    : "Add Job Opening"}
                </h3>

                <p className="mt-0.5 text-[11px] sm:text-[9px] text-[#77778A] dark:text-[#BDB9DD]">
                  Enter the details for this job opportunity.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close modal"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E7E6F1] text-[#77778A] transition hover:bg-[#EEF0FA] hover:text-[#3F3A8F] disabled:opacity-50 dark:border-[#625D9A] dark:text-[#D8D4F0] dark:hover:bg-[#454078]"
              >
                <X size={14} />
              </button>
            </div>

            {/* MODAL FORM */}
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#FAF9FD] p-3.5 dark:bg-[#25235F] sm:p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Job Title *</label>
                  <input
                    value={form.title}
                    onChange={(event) =>
                      setForm({ ...form, title: event.target.value })
                    }
                    className={inputClass}
                    placeholder="e.g. Software Developer"
                  />
                </div>

                <div>
                  <label className={labelClass}>Location *</label>
                  <input
                    value={form.location}
                    onChange={(event) =>
                      setForm({ ...form, location: event.target.value })
                    }
                    className={inputClass}
                    placeholder="e.g. Mangaluru, India"
                  />
                </div>

                <div>
                  <label className={labelClass}>Experience *</label>
                  <input
                    value={form.experience}
                    onChange={(event) =>
                      setForm({ ...form, experience: event.target.value })
                    }
                    className={inputClass}
                    placeholder="e.g. Fresher or 0–2 years"
                  />
                </div>

                <div>
                  <label className={labelClass}>Employment Type *</label>
                  <select
                    value={form.employment_type}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        employment_type: event.target.value as JobForm["employment_type"],
                      })
                    }
                    className={inputClass}
                  >
                    {[
                      "Full Time",
                      "Part Time",
                      "Internship",
                      "Contract",
                    ].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Work Mode *</label>
                  <select
                    value={form.work_mode}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        work_mode: event.target.value as WorkMode,
                      })
                    }
                    className={inputClass}
                  >
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value as JobStatus,
                      })
                    }
                    className={inputClass}
                  >
                    <option value="open">Open / Published</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>About the Role *</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  className={textareaClass}
                  placeholder="Describe the role, its purpose, and what the candidate will do..."
                />
              </div>

              <div>
                <label className={labelClass}>
                  Key Responsibilities (one per line)
                </label>
                <textarea
                  rows={3}
                  value={form.responsibilities}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      responsibilities: event.target.value,
                    })
                  }
                  className={textareaClass}
                  placeholder={
                    "Develop and maintain applications\nCollaborate with the team\nTest and improve software"
                  }
                />
                <p className="mt-1 text-[11px] sm:text-[9px] text-[#9998A7] dark:text-[#A9A5C9]">
                  Enter each responsibility on a separate line.
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  Required Skills (one per line)
                </label>
                <textarea
                  rows={3}
                  value={form.required_skills}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      required_skills: event.target.value,
                    })
                  }
                  className={textareaClass}
                  placeholder={
                    "JavaScript\nReact\nTypeScript\nCommunication skills"
                  }
                />
                <p className="mt-1 text-[11px] sm:text-[9px] text-[#9998A7] dark:text-[#A9A5C9]">
                  Enter each skill on a separate line.
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  Qualifications (one per line)
                </label>
                <textarea
                  rows={3}
                  value={form.qualifications}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      qualifications: event.target.value,
                    })
                  }
                  className={textareaClass}
                  placeholder={
                    "BCA, BSc, BE, or a related degree\nFreshers can apply"
                  }
                />
                <p className="mt-1 text-[11px] sm:text-[9px] text-[#9998A7] dark:text-[#A9A5C9]">
                  Enter each qualification on a separate line.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] sm:text-[10px] text-red-700 dark:border-[#85434A] dark:bg-[#572D38] dark:text-[#FFB8B8]"
                >
                  {error}
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#E7E6F1] bg-white px-3.5 py-3 sm:flex-row sm:justify-end sm:px-5 dark:border-[#514C87] dark:bg-[#302A78]">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="h-9 rounded-lg border border-[#D8D7ED] px-4 text-[12px] sm:text-[10px] font-semibold text-[#55556A] transition hover:bg-[#EEF0FA] disabled:opacity-50 dark:border-[#625D9A] dark:text-[#D8D4F0] dark:hover:bg-[#454078]"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => void handleSaveJob()}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#3F3A8F] px-4 text-[12px] sm:text-[10px] font-semibold text-white transition hover:bg-[#302A78] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && <RefreshCw size={11} className="animate-spin" />}
                {saving
                  ? "Saving..."
                  : editingJobId !== null
                    ? "Update Job"
                    : "Create Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-[#E7E6F1] bg-white p-3 sm:p-3.5 dark:border-[#514C87] dark:bg-[#302A78]">
      <div className="flex items-center justify-between gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF0FA] text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]">
          {icon}
        </span>

        <span className="text-xl sm:text-lg font-semibold tabular-nums text-[#0B2545] dark:text-white">
          {value}
        </span>
      </div>

      <p className="mt-2.5 truncate text-[11px] sm:text-[9px] font-medium text-[#77778A] sm:text-[10px] dark:text-[#BDB9DD]">
        {label}
      </p>
    </div>
  );
}