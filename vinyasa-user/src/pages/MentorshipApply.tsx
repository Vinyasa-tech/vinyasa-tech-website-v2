
import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { motion } from "motion/react";

import { fadeUp, viewport } from "@/lib/motion";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

interface MentorshipProgram {
  id: number;
  title: string;
  status: "active" | "inactive" | "upcoming" | "completed";
  duration?: string | null;
  description?: string | null;
}

interface ProgramsResponse {
  success: boolean;
  data: MentorshipProgram[];
  message?: string;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
}

const DURATIONS = ["20 Days", "1 Month", "2 Months", "3 Months", "6 Months"];

// These values must exactly match the backend's accepted values.
const PROGRAM_PREFERENCES = [
  { value: "Internship Only", label: "Internship Only" },
  {
    value: "Course + Internship",
    label: "Course + Internship",
  },
] as const;

const MentorshipApply = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [programs, setPrograms] = useState<MentorshipProgram[]>([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);
  const [programLoadError, setProgramLoadError] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState("");

  const inputClass =
    "mt-1.5 h-10 w-full rounded-lg border border-[#D8D7ED] px-3 text-sm text-[#0B2545] outline-none focus:border-[#3F3A8F]";

  const errorClass = "mt-1 text-xs text-red-600";

  const loadPrograms = async () => {
    setIsLoadingPrograms(true);
    setProgramLoadError("");

    try {
      const response = await fetch(`${API_URL}/mentorship-programs`);
      const result = (await response.json()) as ProgramsResponse;

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Unable to load mentorship programs."
        );
      }

      const availablePrograms = (result.data || []).filter(
        (program) =>
          (program.status === "active" ||
            program.status === "upcoming") &&
          Number.isInteger(Number(program.id)) &&
          Number(program.id) > 0
      );

      setPrograms(availablePrograms);
    } catch (error) {
      console.error("Failed to load mentorship programs:", error);

      setProgramLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load mentorship programs. Please try again."
      );
    } finally {
      setIsLoadingPrograms(false);
    }
  };

  useEffect(() => {
    void loadPrograms();
  }, []);

  const clearError = (name: string) => {
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setSubmitError("");
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const values = Object.fromEntries(data.entries());
    const newErrors: Record<string, string> = {};

    const fullName = String(values.fullName || "").trim();
    const email = String(values.email || "").trim().toLowerCase();
    const phone = String(values.phone || "").trim();
    const city = String(values.city || "").trim();
    const college = String(values.college || "").trim();
    const course = String(values.course || "").trim();
    const year = String(values.graduationYear || "").trim();
    const programId = String(values.program_id || "").trim();

    // Read the selected program preference.
    const programPreference = String(
      values.programPreference || ""
    ).trim();

    const duration = String(values.duration || "").trim();
    const goals = String(values.goals || "").trim();
    const message = String(values.additionalMessage || "").trim();

    // Full name validation
    if (
      fullName.length < 3 ||
      fullName.length > 60 ||
      !/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(fullName)
    ) {
      newErrors.fullName =
        "Enter a valid name using letters only. Minimum 3 characters.";
    }

    // Email validation
    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    // Phone validation
    if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone =
        "Enter a valid 10-digit Indian mobile number starting with 6–9.";
    }

    // City validation
    if (
      city.length < 2 ||
      city.length > 60 ||
      !/^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/.test(city)
    ) {
      newErrors.city = "Enter a valid city name using letters.";
    }

    // College validation
    if (college.length < 2 || college.length > 120) {
      newErrors.college = "College name must contain 2–120 characters.";
    }

    // Course validation
    if (course.length < 2 || course.length > 80) {
      newErrors.course = "Course name must contain 2–80 characters.";
    }

    // Graduation year validation
    if (
      !/^\d{4}$/.test(year) ||
      Number(year) < 2020 ||
      Number(year) > 2050
    ) {
      newErrors.graduationYear =
        "Enter a graduation year between 2020 and 2050.";
    }

    // Mentorship program validation
    const selectedProgram = programs.find(
      (program) => String(program.id) === programId
    );

    if (!programId || !selectedProgram) {
      newErrors.program_id = "Please select an available mentorship program.";
    }

    // Program preference validation
    if (
      !PROGRAM_PREFERENCES.some(
        (preference) => preference.value === programPreference
      )
    ) {
      newErrors.programPreference =
        "Please select a valid program preference.";
    }

    // Duration validation
    if (!DURATIONS.includes(duration)) {
      newErrors.duration = "Please select a valid mentorship duration.";
    }

    // Goals validation
    if (goals.length < 10 || goals.length > 1000) {
      newErrors.goals = "Describe your goals using 10–1000 characters.";
    }

    // Additional message validation
    if (message.length > 1000) {
      newErrors.additionalMessage =
        "Additional message cannot exceed 1000 characters.";
    }

    setErrors(newErrors);
    setSubmitError("");

    const firstInvalidField = Object.keys(newErrors).find(
      (key) => newErrors[key]
    );

    if (firstInvalidField) {
      const field = form.elements.namedItem(firstInvalidField);

      if (field instanceof HTMLElement) {
        field.focus();
      }

      return;
    }

    if (!selectedProgram) return;

    const nameParts = fullName.split(/\s+/);
    const firstName = nameParts.shift() || "";
    const lastName = nameParts.join(" ");

    // Application payload
    const applicationData = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      city,
      college,
      course,
      graduationYear: Number(year),

      program_id: selectedProgram.id,
      program: selectedProgram.title,

      // IMPORTANT: This field name and value must match the backend.
      program_preference: programPreference,

      duration,
      goals,
      additionalMessage: message,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/mentorship-applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(applicationData),
        }
      );

      const result = (await response
        .json()
        .catch(() => null)) as ApiResponse | null;

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message ||
            "Unable to submit your application. Please try again."
        );
      }

      setSubmitted(true);
      setSelectedProgramId("");
      form.reset();
    } catch (error) {
      console.error("Mentorship application submission failed:", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-[500px] bg-[#EEF0FA] px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-xl items-center justify-center">
          <div className="w-full bg-white px-6 py-8 text-center shadow-sm sm:px-8">
            <CheckCircle2
              size={42}
              className="mx-auto text-[#3F3A8F]"
              strokeWidth={1.5}
            />

            <h1 className="mt-4 text-2xl font-semibold text-[#0B2545]">
              Application Submitted
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#55556A]">
              Thank you for applying for the Vinyasa mentorship program.
              Our team will review your application and get back to you.
            </p>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-5 rounded-lg bg-[#3F3A8F] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B2545]"
            >
              Back to Application
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#EEF0FA]">
      <section className="bg-gradient-to-br from-[#0B2545] via-[#3F3A8F] to-[#302A78] px-4 py-8 sm:px-6 sm:py-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          viewport={viewport}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#D8D4F0]">
            Mentorship Application
          </span>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Apply for Mentorship
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-white/75 sm:text-sm sm:leading-6">
            Tell us about yourself, your interests, and the skills you
            want to develop.
          </p>
        </motion.div>
      </section>

      <section className="px-4 py-7 sm:px-6 sm:py-9">
        <motion.form
          onSubmit={handleSubmit}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          noValidate
          className="mx-auto max-w-3xl border border-[#D8D7ED] bg-white p-5 sm:p-7"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {/* FULL NAME */}
            <div>
              <label
                htmlFor="fullName"
                className="text-xs font-medium text-[#0B2545]"
              >
                Full Name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                minLength={3}
                maxLength={60}
                autoComplete="name"
                onChange={(event) => {
                  event.currentTarget.value =
                    event.currentTarget.value.replace(/[^A-Za-z '-]/g, "");
                  clearError("fullName");
                }}
                className={`${inputClass} ${errors.fullName ? "border-red-500" : ""}`}
                placeholder="Enter your full name"
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
              />

              {errors.fullName && (
                <p id="fullName-error" className={errorClass}>
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="text-xs font-medium text-[#0B2545]"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                onChange={() => clearError("email")}
                className={`${inputClass} ${errors.email ? "border-red-500" : ""}`}
                placeholder="Enter your email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />

              {errors.email && (
                <p id="email-error" className={errorClass}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label
                htmlFor="phone"
                className="text-xs font-medium text-[#0B2545]"
              >
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                required
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel-national"
                onChange={(event) => {
                  event.currentTarget.value = event.currentTarget.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                  clearError("phone");
                }}
                className={`${inputClass} ${errors.phone ? "border-red-500" : ""}`}
                placeholder="10-digit mobile number"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />

              {errors.phone && (
                <p id="phone-error" className={errorClass}>
                  {errors.phone}
                </p>
              )}
            </div>

            {/* CITY */}
            <div>
              <label
                htmlFor="city"
                className="text-xs font-medium text-[#0B2545]"
              >
                City
              </label>

              <input
                id="city"
                name="city"
                type="text"
                required
                minLength={2}
                maxLength={60}
                autoComplete="address-level2"
                onChange={(event) => {
                  event.currentTarget.value = event.currentTarget.value.replace(
                    /[^A-Za-z .'-]/g,
                    ""
                  );
                  clearError("city");
                }}
                className={`${inputClass} ${errors.city ? "border-red-500" : ""}`}
                placeholder="Enter your city"
                aria-invalid={Boolean(errors.city)}
                aria-describedby={errors.city ? "city-error" : undefined}
              />

              {errors.city && (
                <p id="city-error" className={errorClass}>
                  {errors.city}
                </p>
              )}
            </div>

            {/* COLLEGE */}
            <div>
              <label
                htmlFor="college"
                className="text-xs font-medium text-[#0B2545]"
              >
                College / Institution
              </label>

              <input
                id="college"
                name="college"
                type="text"
                required
                minLength={2}
                maxLength={120}
                onChange={() => clearError("college")}
                className={`${inputClass} ${errors.college ? "border-red-500" : ""}`}
                placeholder="Enter college name"
                aria-invalid={Boolean(errors.college)}
                aria-describedby={errors.college ? "college-error" : undefined}
              />

              {errors.college && (
                <p id="college-error" className={errorClass}>
                  {errors.college}
                </p>
              )}
            </div>

            {/* COURSE */}
            <div>
              <label
                htmlFor="course"
                className="text-xs font-medium text-[#0B2545]"
              >
                Course
              </label>

              <input
                id="course"
                name="course"
                type="text"
                required
                minLength={2}
                maxLength={80}
                onChange={() => clearError("course")}
                className={`${inputClass} ${errors.course ? "border-red-500" : ""}`}
                placeholder="BCA, B.Tech, MCA..."
                aria-invalid={Boolean(errors.course)}
                aria-describedby={errors.course ? "course-error" : undefined}
              />

              {errors.course && (
                <p id="course-error" className={errorClass}>
                  {errors.course}
                </p>
              )}
            </div>

            {/* GRADUATION YEAR */}
            <div>
              <label
                htmlFor="graduationYear"
                className="text-xs font-medium text-[#0B2545]"
              >
                Graduation Year
              </label>

              <input
                id="graduationYear"
                name="graduationYear"
                type="number"
                min={2020}
                max={2050}
                step={1}
                required
                onChange={() => clearError("graduationYear")}
                className={`${inputClass} ${errors.graduationYear ? "border-red-500" : ""}`}
                placeholder="2026"
                aria-invalid={Boolean(errors.graduationYear)}
                aria-describedby={errors.graduationYear ? "year-error" : undefined}
              />

              {errors.graduationYear && (
                <p id="year-error" className={errorClass}>
                  {errors.graduationYear}
                </p>
              )}
            </div>

            {/* MENTORSHIP PROGRAM */}
            <div>
              <label
                htmlFor="program_id"
                className="text-xs font-medium text-[#0B2545]"
              >
                Mentorship Program
              </label>

              <select
                id="program_id"
                name="program_id"
                required
                value={selectedProgramId}
                disabled={isLoadingPrograms || programs.length === 0}
                onChange={(event) => {
                  setSelectedProgramId(event.target.value);
                  clearError("program_id");
                }}
                className={`${inputClass} bg-white disabled:cursor-not-allowed disabled:bg-gray-100 ${errors.program_id ? "border-red-500" : ""}`}
                aria-invalid={Boolean(errors.program_id)}
                aria-describedby={errors.program_id ? "program-error" : undefined}
              >
                <option value="">
                  {isLoadingPrograms
                    ? "Loading programs..."
                    : programs.length === 0
                      ? "No programs available"
                      : "Select a program"}
                </option>

                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.title}
                  </option>
                ))}
              </select>

              {errors.program_id && (
                <p id="program-error" className={errorClass}>
                  {errors.program_id}
                </p>
              )}

              {programLoadError && (
                <div className="mt-2">
                  <p className={errorClass}>{programLoadError}</p>

                  <button
                    type="button"
                    onClick={() => void loadPrograms()}
                    disabled={isLoadingPrograms}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#3F3A8F] hover:underline"
                  >
                    <RefreshCw size={12} />
                    Retry loading programs
                  </button>
                </div>
              )}

              {!isLoadingPrograms &&
                !programLoadError &&
                programs.length === 0 && (
                  <p className={errorClass}>
                    No active or upcoming programs were found. Please try
                    again later.
                  </p>
                )}
            </div>

            {/* PROGRAM PREFERENCE */}
            <div>
              <label
                htmlFor="programPreference"
                className="text-xs font-medium text-[#0B2545]"
              >
                Learning Preference
              </label>

              <select
                id="programPreference"
                name="programPreference"
                required
                defaultValue=""
                onChange={() => clearError("programPreference")}
                className={`${inputClass} bg-white ${
                  errors.programPreference ? "border-red-500" : ""
                }`}
                aria-invalid={Boolean(errors.programPreference)}
                aria-describedby={
                  errors.programPreference
                    ? "programPreference-error"
                    : undefined
                }
              >
                <option value="" disabled>
                  Select your preference
                </option>

                {PROGRAM_PREFERENCES.map((preference) => (
                  <option
                    key={preference.value}
                    value={preference.value}
                  >
                    {preference.label}
                  </option>
                ))}
              </select>

              {errors.programPreference && (
                <p id="programPreference-error" className={errorClass}>
                  {errors.programPreference}
                </p>
              )}
            </div>

            {/* DURATION */}
            <div>
              <label
                htmlFor="duration"
                className="text-xs font-medium text-[#0B2545]"
              >
                Duration
              </label>

              <select
                id="duration"
                name="duration"
                required
                defaultValue=""
                onChange={() => clearError("duration")}
                className={`${inputClass} bg-white ${errors.duration ? "border-red-500" : ""}`}
                aria-invalid={Boolean(errors.duration)}
                aria-describedby={errors.duration ? "duration-error" : undefined}
              >
                <option value="" disabled>
                  Select duration
                </option>

                {DURATIONS.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration}
                  </option>
                ))}
              </select>

              {errors.duration && (
                <p id="duration-error" className={errorClass}>
                  {errors.duration}
                </p>
              )}
            </div>

            {/* GOALS */}
            <div className="sm:col-span-2">
              <label
                htmlFor="goals"
                className="text-xs font-medium text-[#0B2545]"
              >
                What do you want to achieve?
              </label>

              <textarea
                id="goals"
                name="goals"
                required
                minLength={10}
                maxLength={1000}
                rows={4}
                onChange={() => clearError("goals")}
                className={`mt-1.5 w-full resize-none rounded-lg border border-[#D8D7ED] px-3 py-2.5 text-sm leading-5 text-[#0B2545] outline-none focus:border-[#3F3A8F] ${
                  errors.goals ? "border-red-500" : ""
                }`}
                placeholder="Tell us about your goals..."
                aria-invalid={Boolean(errors.goals)}
                aria-describedby={errors.goals ? "goals-error" : undefined}
              />

              {errors.goals && (
                <p id="goals-error" className={errorClass}>
                  {errors.goals}
                </p>
              )}
            </div>

            {/* ADDITIONAL MESSAGE */}
            <div className="sm:col-span-2">
              <label
                htmlFor="additionalMessage"
                className="text-xs font-medium text-[#0B2545]"
              >
                Additional Message
              </label>

              <textarea
                id="additionalMessage"
                name="additionalMessage"
                maxLength={1000}
                rows={3}
                onChange={() => clearError("additionalMessage")}
                className={`mt-1.5 w-full resize-none rounded-lg border border-[#D8D7ED] px-3 py-2.5 text-sm leading-5 text-[#0B2545] outline-none focus:border-[#3F3A8F] ${
                  errors.additionalMessage ? "border-red-500" : ""
                }`}
                placeholder="Anything else you would like us to know?"
                aria-invalid={Boolean(errors.additionalMessage)}
                aria-describedby={
                  errors.additionalMessage ? "message-error" : undefined
                }
              />

              {errors.additionalMessage && (
                <p id="message-error" className={errorClass}>
                  {errors.additionalMessage}
                </p>
              )}
            </div>
          </div>

          {/* SUBMISSION ERROR */}
          {submitError && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
            >
              {submitError}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={
              isSubmitting || isLoadingPrograms || programs.length === 0
            }
            className="group mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#3F3A8F] px-5 py-2.5 text-xs font-medium !text-white transition-all duration-300 hover:bg-[#0B2545] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle size={15} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </motion.form>
      </section>
    </main>
  );
};

export default MentorshipApply;
