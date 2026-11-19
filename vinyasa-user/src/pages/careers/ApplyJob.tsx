import { useEffect, useState, type FormEvent } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { getCandidate } from "@/lib/careersStorage";

import {
  getJob,
  submitApplication,
  getApiError,
  type ApiJob,
} from "@/services/careersApi";

import {
  validateName,
  validateMobile,
  validateEmail,
} from "@/lib/careersValidation";

export default function ApplyJob() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const candidate = getCandidate();

  const [job, setJob] = useState<ApiJob | null>(null);
  const [isLoadingJob, setIsLoadingJob] = useState(true);
  const [jobError, setJobError] = useState("");

  const [name, setName] = useState(candidate?.name ?? "");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");

  // Qualification fields
  const [course, setCourse] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [completionYear, setCompletionYear] = useState("");

  // Technical skills
  const [technicalSkills, setTechnicalSkills] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Fetch selected job from backend */
  useEffect(() => {
    let isMounted = true;

    const fetchJob = async () => {
      if (!jobId || !/^\d+$/.test(jobId)) {
        setJobError("Invalid job position.");
        setIsLoadingJob(false);
        return;
      }

      try {
        setIsLoadingJob(true);
        setJobError("");

        const response = await getJob(Number(jobId));

        if (!isMounted) return;

        if (!response.data.success || !response.data.data) {
          setJobError("This job could not be found.");
          setJob(null);
          return;
        }

        const fetchedJob = response.data.data;

        if (fetchedJob.status !== "open") {
          setJobError(
            "Applications are not currently open for this position."
          );
          setJob(null);
          return;
        }

        setJob(fetchedJob);
      } catch (err) {
        if (!isMounted) return;

        setJob(null);
        setJobError(getApiError(err));
      } finally {
        if (isMounted) {
          setIsLoadingJob(false);
        }
      }
    };

    fetchJob();

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  /* Input styling */
  const inputClass =
    "w-full rounded-lg border border-[#D8D7ED] px-4 py-3 text-sm outline-none transition focus:border-[#6668B8] focus:ring-2 focus:ring-[#D8D4F0]";

  /* Submit application to backend */
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (isSubmitting) return;

    const currentCandidate = getCandidate();

    if (!currentCandidate) {
      navigate(
        `/careers/login?jobId=${encodeURIComponent(jobId ?? "")}`
      );
      return;
    }

    if (!job || job.status !== "open") {
      setError("This job is no longer available.");
      return;
    }

    // Validate personal details
    const nameError = validateName(name);
    const phoneError = validateMobile(phone);
    const emailError = validateEmail(currentCandidate.email);

    if (nameError || phoneError || emailError) {
      setError(nameError || phoneError || emailError);
      return;
    }

    // Validate qualification
    if (!course.trim() || course.trim().length < 2) {
      setError("Please enter your qualification.");
      return;
    }

    if (!collegeName.trim() || collegeName.trim().length < 2) {
      setError("Please enter your college or institution name.");
      return;
    }

    if (!/^\d{4}$/.test(completionYear)) {
      setError("Please enter a valid four-digit completion year.");
      return;
    }

    const year = Number(completionYear);
    const currentYear = new Date().getFullYear();

    if (year < 1950 || year > currentYear + 10) {
      setError("Please enter a valid qualification completion year.");
      return;
    }

    // Convert comma-separated skills into an array
    const skills = technicalSkills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (skills.length === 0) {
      setError("Please enter at least one technical skill.");
      return;
    }

    if (skills.length > 20) {
      setError("You can enter up to 20 technical skills.");
      return;
    }

    if (
      skills.some(
        (skill) => skill.length < 2 || skill.length > 40
      )
    ) {
      setError(
        "Each technical skill must contain 2–40 characters."
      );
      return;
    }

    const normalizedSkills = skills.map((skill) =>
      skill.toLowerCase()
    );

    if (new Set(normalizedSkills).size !== skills.length) {
      setError("Please remove duplicate technical skills.");
      return;
    }

    // Split full name into first and last name
    const nameParts = name.trim().split(/\s+/);

    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    setIsSubmitting(true);

    try {
      const response = await submitApplication({
        job_id: job.id,
        first_name: firstName,
        last_name: lastName,
        email: currentCandidate.email.trim().toLowerCase(),
        phone: phone.trim(),
        experience: experience.trim(),

        qualifications: [
          {
            course: course.trim(),
            year: completionYear,
            collegeName: collegeName.trim(),
          },
        ],

        technical_skills: skills,
      });

      if (!response.data.success) {
        setError(
          response.data.message ||
            "Unable to submit your application."
        );
        return;
      }

      navigate(
        `/careers/application-success?jobId=${encodeURIComponent(
          String(job.id)
        )}`,
        { replace: true }
      );
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  /* Candidate login check */
  if (!candidate) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F3FB] px-5 py-16">
        <div className="w-full max-w-md rounded-2xl border border-[#D8D4F0] bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-[#0B2545]">
            Please log in first
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            Log in to continue with your job application.
          </p>

          <Link
            to={`/careers/login?jobId=${encodeURIComponent(jobId ?? "")}`}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#40358C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#302A78]"
          >
            Continue to Login
          </Link>

          <p className="mt-4 text-sm text-gray-600">
            New candidate?{" "}
            <Link
              to={`/careers/register?jobId=${encodeURIComponent(jobId ?? "")}`}
              className="font-semibold text-[#40358C] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>
    );
  }

  /* Job loading state */
  if (isLoadingJob) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F3FB] px-5">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#D8D4F0] border-t-[#40358C]" />

          <p className="mt-4 text-sm font-medium text-gray-600">
            Loading job details...
          </p>
        </div>
      </main>
    );
  }

  /* Job not available */
  if (!job || jobError) {
    return (
      <main className="min-h-screen bg-[#F5F3FB] px-5 py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#D8D4F0] bg-white p-8 2xl:max-w-2xl min-[2400px]:max-w-3xl">
          <h1 className="text-2xl font-bold text-[#0B2545]">
            Job not available
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            {jobError ||
              "This position may no longer be available."}
          </p>

          <Link
            to="/careers"
            className="mt-5 inline-block font-semibold text-[#40358C] hover:underline"
          >
            Browse current openings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F3FB] px-4 py-8 text-[#0B2545] sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-2xl 2xl:max-w-4xl min-[2400px]:max-w-[1200px]">
        <Link
          to="/careers/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#40358C] hover:underline"
        >
          <span aria-hidden="true">←</span>
          Back to Dashboard
        </Link>

        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6668B8]">
            Careers at Vinyasa Tech
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Apply for this position
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
            Enter your details to submit your application.
          </p>
        </div>

        {/* Job Information */}
        <section className="mt-6 rounded-xl border border-[#D8D4F0] bg-white p-5 shadow-sm sm:p-6">
          {job.department && (
            <span className="inline-flex rounded-full bg-[#EEF0FA] px-3 py-1 text-xs font-semibold text-[#40358C]">
              {job.department}
            </span>
          )}

          <h2 className="mt-3 text-xl font-bold sm:text-2xl">
            {job.title}
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            {job.location} · {job.employment_type}
          </p>

          <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-600">
            {job.description}
          </p>

          {job.work_mode && (
            <p className="mt-3 text-sm text-gray-500">
              Work mode: {job.work_mode}
            </p>
          )}

          <p className="mt-1 text-sm text-gray-500">
            Experience required: {job.experience}
          </p>
        </section>

        {/* Application Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-6 rounded-xl border border-[#D8D4F0] bg-white p-5 shadow-sm sm:p-8"
        >
          <div>
            <h2 className="text-lg font-bold">
              Job Application Form
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Fields marked with * are required.
            </p>
          </div>

          {/* Personal Information */}
          <section>
            <h3 className="mb-4 text-sm font-bold text-[#40358C]">
              Personal Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="candidateName"
                  className="mb-2 block text-sm font-semibold"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>

                <input
                  id="candidateName"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={80}
                  value={name}
                  onChange={(event) => {
                    const value = event.target.value;

                    if (/^[A-Za-z '-]*$/.test(value)) {
                      setName(value);
                    }
                  }}
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="candidateEmail"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email Address
                </label>

                <input
                  id="candidateEmail"
                  type="email"
                  readOnly
                  value={candidate.email}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600"
                />
              </div>

              <div>
                <label
                  htmlFor="candidatePhone"
                  className="mb-2 block text-sm font-semibold"
                >
                  Mobile Number <span className="text-red-500">*</span>
                </label>

                <input
                  id="candidatePhone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  placeholder="10-digit mobile number"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="candidateExperience"
                  className="mb-2 block text-sm font-semibold"
                >
                  Experience
                </label>

                <select
                  id="candidateExperience"
                  value={experience}
                  onChange={(event) =>
                    setExperience(event.target.value)
                  }
                  className={`${inputClass} bg-white`}
                >
                  <option value="">Select your experience</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Less than 1 year">
                    Less than 1 year
                  </option>
                  <option value="1–2 years">1–2 years</option>
                  <option value="2–5 years">2–5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>
            </div>
          </section>

          {/* Qualification Information */}
          <section className="border-t border-gray-100 pt-5">
            <h3 className="mb-4 text-sm font-bold text-[#40358C]">
              Educational Qualification
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="course"
                  className="mb-2 block text-sm font-semibold"
                >
                  Course / Qualification{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="course"
                  type="text"
                  required
                  maxLength={100}
                  value={course}
                  onChange={(event) =>
                    setCourse(event.target.value)
                  }
                  placeholder="e.g. BCA, B.Tech, MCA"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="completionYear"
                  className="mb-2 block text-sm font-semibold"
                >
                  Completion Year{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="completionYear"
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength={4}
                  value={completionYear}
                  onChange={(event) =>
                    setCompletionYear(
                      event.target.value.replace(/\D/g, "").slice(0, 4)
                    )
                  }
                  placeholder="e.g. 2025"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="collegeName"
                  className="mb-2 block text-sm font-semibold"
                >
                  College / Institution Name{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="collegeName"
                  type="text"
                  required
                  maxLength={150}
                  value={collegeName}
                  onChange={(event) =>
                    setCollegeName(event.target.value)
                  }
                  placeholder="Enter your college or institution"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Technical Skills */}
          <section className="border-t border-gray-100 pt-5">
            <h3 className="mb-2 text-sm font-bold text-[#40358C]">
              Technical Skills
            </h3>

            <p className="mb-3 text-xs leading-5 text-gray-500">
              Enter your skills separated by commas. For example:
              React, JavaScript, HTML, CSS, Node.js.
            </p>

            <textarea
              id="technicalSkills"
              required
              rows={3}
              maxLength={500}
              value={technicalSkills}
              onChange={(event) =>
                setTechnicalSkills(event.target.value)
              }
              placeholder="Enter your technical skills"
              className={`${inputClass} resize-y`}
            />
          </section>

          {/* Error Message */}
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <div className="border-t border-gray-100 pt-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#40358C] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#302A78] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit Application"}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-gray-500">
              Please verify your information before submitting.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}