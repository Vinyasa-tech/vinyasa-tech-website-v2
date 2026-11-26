import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  BookOpen,
  Clock,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  Layers3,
  Monitor,
  GraduationCap,
  ClipboardList,
  Search,
} from "lucide-react";
import { getAuthHeaders } from "../../services/authToken";

const API_URL = `${import.meta.env.VITE_API_URL}/mentorship-programs`;

type ProgramStatus = "active" | "inactive" | "upcoming" | "completed";

interface WeeklyPlanItem {
  week: string;
  topic: string;
  description?: string;
}

interface MentorshipProgram {
  id: number;
  title: string;
  description: string;
  duration: string;
  category?: string;
  status: ProgramStatus;
  weekly_plan?: WeeklyPlanItem[] | string | null;
}

interface ProgramForm {
  title: string;
  description: string;
  duration: string;
  mode: string;
  status: ProgramStatus;
  weekly_plan: WeeklyPlanItem[];
}

const emptyPlanItem = (): WeeklyPlanItem => ({
  week: "",
  topic: "",
  description: "",
});

const emptyForm = (): ProgramForm => ({
  title: "",
  description: "",
  duration: "",
  mode: "Offline",
  status: "upcoming",
  weekly_plan: [],
});

const normalizeWeeklyPlan = (
  value: MentorshipProgram["weekly_plan"],
): WeeklyPlanItem[] => {
  if (!value) return [];

  let parsed: unknown = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null,
    )
    .map((item) => ({
      week: String(item.week ?? ""),
      topic: String(item.topic ?? ""),
      description: String(item.description ?? ""),
    }));
};

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong."
    );
  }

  return "Something went wrong. Please try again.";
};

const statusStyles: Record<ProgramStatus, string> = {
  active: "bg-[#E9F7EF] text-[#1D7A46]",
  inactive: "bg-[#FFF5E6] text-[#A96800]",
  upcoming: "bg-[#EEF0FA] text-[#3F3A8F]",
  completed: "bg-[#F3F4F6] text-[#667085]",
};

const inputClass =
  "w-full rounded-lg border border-[#D8D7ED] bg-[#F8F7FC] px-3 py-2.5 text-sm text-[#25224F] outline-none transition placeholder:text-[#9998A7] focus:border-[#6668B8] focus:ring-2 focus:ring-[#6668B8]/10";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-[0.06em] text-[#55556A]";

const MentorshipPrograms = () => {
  const [programs, setPrograms] = useState<MentorshipProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProgramForm>(emptyForm());
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedPlans, setExpandedPlans] = useState<number[]>([]);

  const fetchPrograms = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(API_URL, {
        headers: getAuthHeaders(),
      });

      const result = response.data?.data ?? response.data;
      setPrograms(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPrograms();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm());
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (program: MentorshipProgram) => {
    setEditingId(program.id);
    setError("");
    setSuccess("");

    setForm({
      title: program.title ?? "",
      description: program.description ?? "",
      duration: program.duration ?? "",
      mode: program.category ?? "Offline",
      status: program.status ?? "upcoming",
      weekly_plan: normalizeWeeklyPlan(program.weekly_plan),
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm());
    setError("");
  };

  const updateField = <K extends keyof ProgramForm>(
    field: K,
    value: ProgramForm[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateWeeklyPlan = (
    index: number,
    field: keyof WeeklyPlanItem,
    value: string,
  ) => {
    setForm((previous) => ({
      ...previous,
      weekly_plan: previous.weekly_plan.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addWeeklyPlan = () => {
    setForm((previous) => ({
      ...previous,
      weekly_plan: [...previous.weekly_plan, emptyPlanItem()],
    }));
  };

  const removeWeeklyPlan = (index: number) => {
    setForm((previous) => ({
      ...previous,
      weekly_plan: previous.weekly_plan.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!getAuthHeaders().Authorization) {
      setError("Authentication required. Please login again.");
      return;
    }

    const title = form.title.trim();
    const description = form.description.trim();
    const duration = form.duration.trim();

    if (!title || !description || !duration) {
      setError("Please fill in the program name, description, and duration.");
      return;
    }

    const weeklyPlan = form.weekly_plan
      .map((item) => ({
        week: item.week.trim(),
        topic: item.topic.trim(),
        description: item.description?.trim() ?? "",
      }))
      .filter((item) => item.week || item.topic || item.description);

    if (weeklyPlan.some((item) => !item.week || !item.topic)) {
      setError(
        "Please enter both the week and topic for every weekly-plan entry.",
      );
      return;
    }

    const payload = {
      title,
      description,
      duration,
      category: form.mode,
      status: form.status,
      weekly_plan: weeklyPlan,
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await axios.put(`${API_URL}/${editingId}`, payload, {
          headers: getAuthHeaders(),
        });
        setSuccess("Mentorship program updated successfully.");
      } else {
        await axios.post(API_URL, payload, {
          headers: getAuthHeaders(),
        });
        setSuccess("Mentorship program added successfully.");
      }

      setShowModal(false);
      setEditingId(null);
      setForm(emptyForm());

      await fetchPrograms();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this mentorship program?",
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    if (!getAuthHeaders().Authorization) {
      setError("Authentication required. Please login again.");
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeaders(),
      });

      setSuccess("Mentorship program deleted successfully.");
      await fetchPrograms();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const toggleWeeklyPlan = (id: number) => {
    setExpandedPlans((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const filteredPrograms = programs.filter((program) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      program.title.toLowerCase().includes(query) ||
      (program.category ?? "").toLowerCase().includes(query) ||
      program.description.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" || program.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full p-3 text-[#25224F] transition-colors sm:p-5 lg:p-6 dark:text-[#F5F3FB]">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7779C6] dark:text-[#BDB9ED]">
            <GraduationCap size={14} />
            Learning Management
          </p>

          <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#0B2545] sm:text-2xl dark:text-white">
            Mentorship Programs
          </h1>

          <p className="mt-1 max-w-xl text-xs leading-5 text-[#77778A] sm:text-sm dark:text-[#BDB9DD]">
            Create and organize mentorship programs with structured weekly learning plans.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void fetchPrograms()}
            disabled={loading}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#D8D7ED] bg-white px-3 text-xs font-medium text-[#3F3A8F] transition hover:bg-[#EEF0FA] disabled:opacity-50 dark:border-[#625D9A] dark:bg-[#302A78] dark:text-[#D8D4F0]"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#3F3A8F] px-3 text-xs font-semibold text-white transition hover:bg-[#302A78]"
          >
            <Plus size={14} />
            Add Program
          </button>
        </div>
      </div>

      {/* ALERTS */}
      {error && !showModal && (
        <div
          role="alert"
          className="mt-4 flex items-start justify-between gap-3 rounded-lg border border-[#F2B8B5] bg-[#FDECEC] px-3 py-2.5 text-xs text-[#B42318]"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-[#B7E4C7] bg-[#E9F7EF] px-3 py-2.5 text-xs text-[#1D7A46]"
        >
          <span>{success}</span>
          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Dismiss message"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* SUMMARY */}
      {!loading && (
        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          {[
            {
              label: "Total Programs",
              value: programs.length,
              icon: <Layers3 size={15} />,
              color: "text-[#7779C6]",
            },
            {
              label: "Active",
              value: programs.filter((item) => item.status === "active").length,
              icon: <Monitor size={15} />,
              color: "text-[#1D9B61]",
            },
            {
              label: "Upcoming",
              value: programs.filter((item) => item.status === "upcoming").length,
              icon: <CalendarDays size={15} />,
              color: "text-[#6668B8]",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="min-w-0 rounded-xl border border-[#E7E6F1] bg-white p-3 dark:border-[#514C87] dark:bg-[#302A78]"
            >
              <div className="flex items-center gap-1.5">
                <span className={item.color}>{item.icon}</span>
                <p className="text-xs font-medium text-[#77778A] dark:text-[#BDB9DD]">
                  {item.label}
                </p>
              </div>
              <p className="mt-1.5 text-xl font-semibold text-[#0B2545] dark:text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* SEARCH AND FILTER */}
      <div className="mt-4 flex flex-col gap-2 rounded-xl border border-[#E7E6F1] bg-white p-3 sm:flex-row dark:border-[#514C87] dark:bg-[#302A78]">
        <div className="relative min-w-0 flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7779C6]"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search programs..."
            className="h-9 w-full rounded-lg border border-[#D8D7ED] bg-[#F8F7FC] pl-9 pr-3 text-xs text-[#25224F] outline-none placeholder:text-[#9998A7] focus:border-[#6668B8] dark:border-[#625D9A] dark:bg-[#25235F] dark:text-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-9 rounded-lg border border-[#D8D7ED] bg-[#F8F7FC] px-3 text-xs text-[#25224F] outline-none focus:border-[#6668B8] sm:w-40 dark:border-[#625D9A] dark:bg-[#25235F] dark:text-white"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* PROGRAM CARDS */}
      <div className="mt-3">
        {loading ? (
          <div className="flex min-h-48 items-center justify-center gap-2 text-[#3F3A8F] dark:text-[#D8D4F0]">
            <RefreshCw className="animate-spin" size={17} />
            <span className="text-xs font-medium">Loading programs...</span>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#D8D4F0] bg-white px-5 py-12 text-center dark:border-[#625D9A] dark:bg-[#302A78]">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FA] text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]">
              <BookOpen size={20} />
            </div>
            <h2 className="mt-3 text-base font-semibold text-[#25224F] dark:text-white">
              No programs found
            </h2>
            <p className="mt-1 text-xs text-[#77778A] dark:text-[#BDB9DD]">
              {programs.length === 0
                ? "Add your first mentorship program to get started."
                : "Try changing your search or status filter."}
            </p>
            {programs.length === 0 && (
              <button
                type="button"
                onClick={openAddModal}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#3F3A8F] px-3 py-2 text-xs font-semibold text-white hover:bg-[#302A78]"
              >
                <Plus size={14} />
                Add Program
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {filteredPrograms.map((program) => {
              const weeklyPlan = normalizeWeeklyPlan(program.weekly_plan);
              const isExpanded = expandedPlans.includes(program.id);

              return (
                <article
                  key={program.id}
                  className="overflow-hidden rounded-xl border border-[#E7E6F1] bg-white transition hover:border-[#C9C5E5] hover:shadow-sm dark:border-[#514C87] dark:bg-[#302A78]"
                >
                  {/* COMPACT CARD HEADER */}
                  <div className="flex items-start gap-3 p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FA] text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]">
                      <BookOpen size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#7779C6] dark:text-[#BDB9ED]">
                          {program.category || "Mentorship"}
                        </p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusStyles[program.status] || statusStyles.upcoming}`}
                        >
                          {program.status}
                        </span>
                      </div>

                      <h2 className="mt-1 break-words text-sm font-semibold leading-5 text-[#0B2545] dark:text-white">
                        {program.title}
                      </h2>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#77778A] dark:text-[#BDB9DD]">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} />
                          {program.duration || "Duration not specified"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Monitor size={12} />
                          {program.category || "Mode not specified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="px-3.5 pb-3">
                    <p className="line-clamp-2 whitespace-pre-wrap text-xs leading-[1.6] text-[#666678] dark:text-[#D0CDEB]">
                      {program.description || "No program description added."}
                    </p>
                  </div>

                  {/* WEEKLY PLAN */}
                  <div className="mx-3.5 overflow-hidden rounded-lg border border-[#E7E6F1] dark:border-[#514C87]">
                    <button
                      type="button"
                      onClick={() => toggleWeeklyPlan(program.id)}
                      aria-expanded={isExpanded}
                      className="flex w-full items-center justify-between gap-2 bg-[#F8F7FC] px-3 py-2.5 text-left transition hover:bg-[#EEF0FA] dark:bg-[#25235F] dark:hover:bg-[#353187]"
                    >
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-[#3F3A8F] dark:text-[#D8D4F0]">
                        <ClipboardList size={14} />
                        Weekly Learning Plan
                        <span className="rounded-full bg-[#EAE8F6] px-1.5 py-0.5 text-xs dark:bg-[#454078]">
                          {weeklyPlan.length}
                        </span>
                      </span>

                      {isExpanded ? (
                        <ChevronUp size={15} className="text-[#7779C6]" />
                      ) : (
                        <ChevronDown size={15} className="text-[#7779C6]" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="space-y-2 border-t border-[#E7E6F1] p-2.5 dark:border-[#514C87]">
                        {weeklyPlan.length === 0 ? (
                          <p className="py-2 text-center text-xs text-[#77778A] dark:text-[#BDB9DD]">
                            No weekly plan added.
                          </p>
                        ) : (
                          weeklyPlan.map((item, index) => (
                            <div
                              key={`${item.week}-${index}`}
                              className="flex items-start gap-2 rounded-lg bg-[#FAF9FD] p-2.5 dark:bg-[#25235F]"
                            >
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#EEF0FA] text-xs font-semibold text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]">
                                {index + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold uppercase text-[#7779C6] dark:text-[#BDB9ED]">
                                  {item.week}
                                </p>
                                <p className="mt-0.5 text-xs font-semibold text-[#25224F] dark:text-white">
                                  {item.topic}
                                </p>
                                {item.description?.trim() && (
                                  <p className="mt-1 whitespace-pre-wrap text-xs leading-4 text-[#77778A] dark:text-[#BDB9DD]">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* CARD ACTIONS */}
                  <div className="mt-3 flex items-center justify-between border-t border-[#F0EFF7] px-3.5 py-2.5 dark:border-[#514C87]">
                    <span className="text-xs text-[#9998A7] dark:text-[#A6A3C8]">
                      Program #{program.id}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(program)}
                        className="inline-flex h-7 items-center gap-1 rounded-md border border-[#D8D7ED] px-2.5 text-xs font-semibold text-[#3F3A8F] transition hover:bg-[#EEF0FA] dark:border-[#625D9A] dark:text-[#D8D4F0] dark:hover:bg-[#454078]"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDelete(program.id)}
                        className="inline-flex h-7 items-center gap-1 rounded-md border border-[#F2C7C7] px-2.5 text-xs font-semibold text-[#B42318] transition hover:bg-[#FDECEC] dark:border-[#85434A] dark:text-[#FFB8B8] dark:hover:bg-[#572D38]"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0B2545]/55 p-3 backdrop-blur-[3px] sm:items-center sm:p-5">
          <button
            type="button"
            aria-label="Close modal"
            onClick={closeModal}
            disabled={saving}
            className="fixed inset-0 cursor-default"
          />

          <div className="relative z-10 my-auto flex max-h-[92vh] w-full max-w-[680px] flex-col overflow-hidden rounded-2xl border border-[#E7E6F1] bg-[#FAF9FD] shadow-2xl dark:border-[#514C87] dark:bg-[#25235F]">
            {/* MODAL HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#E7E6F1] bg-white px-4 py-3 dark:border-[#514C87] dark:bg-[#302A78] sm:px-5">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#7779C6] dark:text-[#BDB9ED]">
                  <GraduationCap size={14} />
                  Program Management
                </p>

                <h2 className="mt-1 text-base font-semibold text-[#0B2545] dark:text-white">
                  {editingId !== null
                    ? "Edit Mentorship Program"
                    : "Create Mentorship Program"}
                </h2>

                <p className="mt-0.5 text-xs text-[#77778A] dark:text-[#BDB9DD]">
                  Enter program details and learning schedule.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close modal"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E6F1] text-[#77778A] transition hover:bg-[#EEF0FA] hover:text-[#3F3A8F] disabled:opacity-50 dark:border-[#625D9A] dark:text-[#D8D4F0] dark:hover:bg-[#454078]"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3.5 sm:p-5">
                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-[#F2B8B5] bg-[#FDECEC] px-3 py-2 text-xs text-[#B42318]"
                  >
                    {error}
                  </div>
                )}

                {/* PROGRAM DETAILS */}
                <section className="rounded-xl border border-[#E7E6F1] bg-white p-3.5 dark:border-[#514C87] dark:bg-[#302A78]">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF0FA] text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]">
                      <BookOpen size={15} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#25224F] dark:text-white">
                        Program Details
                      </h3>
                      <p className="text-xs text-[#77778A] dark:text-[#BDB9DD]">
                        Basic information about this program
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Program Name *</label>
                      <input
                        required
                        maxLength={150}
                        value={form.title}
                        onChange={(event) =>
                          updateField("title", event.target.value)
                        }
                        placeholder="e.g. AI & Machine Learning"
                        className={inputClass}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={labelClass}>Program Description *</label>
                      <textarea
                        required
                        rows={3}
                        value={form.description}
                        onChange={(event) =>
                          updateField("description", event.target.value)
                        }
                        placeholder="Describe the mentorship program..."
                        className={`${inputClass} resize-y`}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Duration *</label>
                      <input
                        required
                        value={form.duration}
                        onChange={(event) =>
                          updateField("duration", event.target.value)
                        }
                        placeholder="e.g. 12 Weeks"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Mode</label>
                      <select
                        value={form.mode}
                        onChange={(event) =>
                          updateField("mode", event.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="Offline">Offline</option>
                        <option value="Online">Online</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className={labelClass}>Program Status</label>
                      <select
                        value={form.status}
                        onChange={(event) =>
                          updateField(
                            "status",
                            event.target.value as ProgramStatus,
                          )
                        }
                        className={inputClass}
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* WEEKLY LEARNING PLAN */}
                <section className="rounded-xl border border-[#E7E6F1] bg-white p-3.5 dark:border-[#514C87] dark:bg-[#302A78]">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF0FA] text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]">
                        <CalendarDays size={15} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#25224F] dark:text-white">
                          Weekly Learning Plan
                        </h3>
                        <p className="text-xs text-[#77778A] dark:text-[#BDB9DD]">
                          Organize topics week by week
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={addWeeklyPlan}
                      className="inline-flex h-8 items-center justify-center gap-1.5 self-start rounded-lg bg-[#3F3A8F] px-3 text-xs font-semibold text-white transition hover:bg-[#302A78] sm:self-auto"
                    >
                      <Plus size={13} />
                      Add Week
                    </button>
                  </div>

                  {form.weekly_plan.length === 0 ? (
                    <div className="mt-3 rounded-lg border border-dashed border-[#D8D4F0] bg-[#FAF9FD] px-3 py-6 text-center dark:border-[#625D9A] dark:bg-[#25235F]">
                      <ClipboardList
                        size={21}
                        className="mx-auto text-[#7779C6]"
                      />
                      <p className="mt-2 text-xs font-semibold text-[#25224F] dark:text-white">
                        No weekly entries yet
                      </p>
                      <p className="mt-1 text-xs text-[#77778A] dark:text-[#BDB9DD]">
                        Add a week to build the learning schedule.
                      </p>
                      <button
                        type="button"
                        onClick={addWeeklyPlan}
                        className="mt-2 text-xs font-semibold text-[#3F3A8F] hover:underline dark:text-[#D8D4F0]"
                      >
                        + Add your first week
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2.5">
                      <div className="flex items-center justify-between rounded-lg bg-[#F5F3FB] px-3 py-2 dark:bg-[#25235F]">
                        <span className="text-xs font-semibold text-[#3F3A8F] dark:text-[#D8D4F0]">
                          Learning Schedule
                        </span>
                        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-[#3F3A8F] dark:bg-[#454078] dark:text-[#D8D4F0]">
                          {form.weekly_plan.length}{" "}
                          {form.weekly_plan.length === 1 ? "Entry" : "Entries"}
                        </span>
                      </div>

                      {form.weekly_plan.map((item, index) => (
                        <div
                          key={index}
                          className="overflow-hidden rounded-lg border border-[#E7E6F1] dark:border-[#514C87]"
                        >
                          <div className="flex items-center justify-between border-b border-[#E7E6F1] bg-[#F8F7FC] px-3 py-2 dark:border-[#514C87] dark:bg-[#25235F]">
                            <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#3F3A8F] text-xs font-semibold text-white">
                                {index + 1}
                              </span>
                              <span className="text-xs font-semibold text-[#25224F] dark:text-white">
                                Week Entry {index + 1}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeWeeklyPlan(index)}
                              aria-label={`Remove week entry ${index + 1}`}
                              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-[#B42318] transition hover:bg-[#FDECEC] dark:text-[#FFB8B8]"
                            >
                              <Trash2 size={12} />
                              Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-2.5 p-3 sm:grid-cols-2">
                            <div>
                              <label className={labelClass}>
                                Week / Period *
                              </label>
                              <input
                                required
                                value={item.week}
                                onChange={(event) =>
                                  updateWeeklyPlan(
                                    index,
                                    "week",
                                    event.target.value,
                                  )
                                }
                                placeholder="e.g. Week 1–2"
                                className={inputClass}
                              />
                            </div>

                            <div>
                              <label className={labelClass}>Topic *</label>
                              <input
                                required
                                value={item.topic}
                                onChange={(event) =>
                                  updateWeeklyPlan(
                                    index,
                                    "topic",
                                    event.target.value,
                                  )
                                }
                                placeholder="e.g. Python Basics"
                                className={inputClass}
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className={labelClass}>
                                Description (Optional)
                              </label>
                              <textarea
                                rows={2}
                                value={item.description ?? ""}
                                onChange={(event) =>
                                  updateWeeklyPlan(
                                    index,
                                    "description",
                                    event.target.value,
                                  )
                                }
                                placeholder="Describe the topics or activities..."
                                className={`${inputClass} resize-y`}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addWeeklyPlan}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#BDB7DE] bg-[#FAF9FD] px-3 py-2.5 text-xs font-semibold text-[#3F3A8F] transition hover:border-[#51499B] hover:bg-[#F1F0FA] dark:border-[#625D9A] dark:bg-[#25235F] dark:text-[#D8D4F0]"
                      >
                        <Plus size={13} />
                        Add Another Week
                      </button>
                    </div>
                  )}
                </section>
              </div>

              {/* MODAL FOOTER */}
              <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#E7E6F1] bg-white px-3.5 py-3 sm:flex-row sm:justify-end sm:px-5 dark:border-[#514C87] dark:bg-[#302A78]">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-[#D8D7ED] px-4 text-xs font-semibold text-[#55556A] transition hover:bg-[#EEF0FA] disabled:opacity-50 dark:border-[#625D9A] dark:text-[#D8D4F0] dark:hover:bg-[#454078]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#3F3A8F] px-4 text-xs font-semibold text-white transition hover:bg-[#302A78] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckIcon />
                      {editingId !== null ? "Update Program" : "Save Program"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function CheckIcon() {
  return <span className="text-sm">✓</span>;
}

export default MentorshipPrograms;