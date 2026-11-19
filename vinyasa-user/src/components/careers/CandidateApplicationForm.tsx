import { useState, type FormEvent } from "react";
import axios from "axios";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Code2,
  GraduationCap,
  Mail,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";

import { submitApplication } from "@/services/careersApi";
import type { Qualification } from "@/types/careers";

interface CandidateApplicationFormProps {
  jobDatabaseId: number;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  alreadyApplied: boolean;
  onApplicationSubmitted: () => void;
}

const experienceOptions = [
  "Fresher",
  "Less than 1 year",
  "1–2 years",
  "2–5 years",
  "5+ years",
];

const currentYear = new Date().getFullYear();

const inputClass =
  "h-10 w-full min-w-0 border border-[#D8D7ED] bg-white px-3 text-xs text-[#0B2545] outline-none transition focus:border-[#3F3A8F] placeholder:text-[#A09FB0]";

const labelClass =
  "mb-1.5 block text-[11px] font-medium text-[#0B2545] sm:text-xs";

function validateName(value: string) {
  const name = value.trim();

  if (!name) return "Please enter your full name.";
  if (name.length < 2) {
    return "Your name must contain at least 2 characters.";
  }
  if (name.length > 80) {
    return "Your name cannot exceed 80 characters.";
  }
  if (!/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(name)) {
    return "Use English letters, spaces, hyphens, or apostrophes only.";
  }

  return "";
}

function validateEmail(value: string) {
  const email = value.trim();

  if (!email) return "Your registered email address is missing.";
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return "Your registered email address is invalid.";
  }

  return "";
}

function validatePhone(value: string) {
  if (!/^[6-9]\d{9}$/.test(value)) {
    return "Enter a valid 10-digit Indian mobile number starting with 6–9.";
  }

  return "";
}

function validateQualifications(values: Qualification[]) {
  if (!values.length) {
    return "Please add at least one qualification.";
  }

  if (values.length > 10) {
    return "You can add a maximum of 10 qualifications.";
  }

  for (let index = 0; index < values.length; index++) {
    const item = values[index];
    const number = index + 1;

    if (
      !item.course.trim() ||
      !item.collegeName.trim() ||
      !item.year.trim()
    ) {
      return `Please complete all fields in Qualification ${number}.`;
    }

    if (
      item.course.trim().length < 2 ||
      item.course.trim().length > 100
    ) {
      return `Course in Qualification ${number} must contain 2–100 characters.`;
    }

    if (
      !/^[A-Za-z0-9][A-Za-z0-9 .,&()/+-]*$/.test(
        item.course.trim()
      )
    ) {
      return `Please enter a valid course name in Qualification ${number}.`;
    }

    if (
      item.collegeName.trim().length < 2 ||
      item.collegeName.trim().length > 150
    ) {
      return `College name in Qualification ${number} must contain 2–150 characters.`;
    }

    if (
      !/^[A-Za-z0-9][A-Za-z0-9 .,'&()/+-]*$/.test(
        item.collegeName.trim()
      )
    ) {
      return `Please enter a valid college name in Qualification ${number}.`;
    }

    if (!/^\d{4}$/.test(item.year)) {
      return `Enter a valid four-digit year in Qualification ${number}.`;
    }

    const year = Number(item.year);

    if (year < 1950 || year > currentYear + 10) {
      return `The year in Qualification ${number} must be between 1950 and ${currentYear + 10}.`;
    }
  }

  const keys = values.map((item) =>
    [
      item.course.trim(),
      item.collegeName.trim(),
      item.year.trim(),
    ]
      .join("|")
      .toLowerCase()
  );

  if (new Set(keys).size !== keys.length) {
    return "Duplicate qualifications are not allowed.";
  }

  return "";
}

function validateSkills(value: string) {
  if (!value.trim()) {
    return "Please enter at least one technical skill.";
  }

  if (value.length > 500) {
    return "Technical skills cannot exceed 500 characters.";
  }

  const skills = value.split(",").map((skill) => skill.trim());

  if (skills.some((skill) => !skill)) {
    return "Remove empty skills and separate each skill with a comma.";
  }

  if (skills.length > 20) {
    return "You can enter a maximum of 20 technical skills.";
  }

  for (const skill of skills) {
    if (skill.length < 2 || skill.length > 40) {
      return "Each technical skill must contain 2–40 characters.";
    }

    if (!/^[A-Za-z0-9+#./ -]+$/.test(skill)) {
      return `Remove unsupported characters from "${skill}".`;
    }
  }

  if (
    new Set(skills.map((skill) => skill.toLowerCase())).size !==
    skills.length
  ) {
    return "Please remove duplicate technical skills.";
  }

  return "";
}

export default function CandidateApplicationForm({
  jobDatabaseId,
  jobTitle,
  candidateName,
  candidateEmail,
  alreadyApplied,
  onApplicationSubmitted,
}: CandidateApplicationFormProps) {
  const [name, setName] = useState(candidateName);
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [qualifications, setQualifications] = useState<Qualification[]>([
    { course: "", collegeName: "", year: "" },
  ]);
  const [technicalSkills, setTechnicalSkills] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateQualification(
    index: number,
    field: keyof Qualification,
    value: string
  ) {
    setQualifications((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );

    setFormError("");
  }

  function handleAddQualification() {
    if (qualifications.length >= 10) {
      setFormError("You can add a maximum of 10 qualifications.");
      return;
    }

    setQualifications((current) => [
      ...current,
      { course: "", collegeName: "", year: "" },
    ]);

    setFormError("");
  }

  function handleRemoveQualification(index: number) {
    setQualifications((current) =>
      current.filter((_, i) => i !== index)
    );

    setFormError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (isSubmitting) return;

    if (!Number.isInteger(jobDatabaseId) || jobDatabaseId <= 0) {
      setFormError(
        "This job is missing its database ID. Please contact the administrator."
      );
      return;
    }

    const normalizedEmail = candidateEmail.trim().toLowerCase();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedExperience = experience.trim();

    const trimmedQualifications = qualifications
      .filter(
        (item) =>
          item.course.trim() ||
          item.collegeName.trim() ||
          item.year.trim()
      )
      .map((item) => ({
        course: item.course.trim(),
        collegeName: item.collegeName.trim(),
        year: item.year.trim(),
      }));

    const trimmedSkills = technicalSkills.trim();

    const error =
      validateName(trimmedName) ||
      validateEmail(normalizedEmail) ||
      validatePhone(trimmedPhone) ||
      validateQualifications(trimmedQualifications) ||
      (!trimmedExperience ? "Please select your experience." : "") ||
      validateSkills(trimmedSkills);

    if (error) {
      setFormError(error);
      return;
    }

    setIsSubmitting(true);

    try {
      const nameParts = trimmedName.split(/\s+/);
      const firstName = nameParts.shift() ?? "";
      const lastName = nameParts.join(" ");

      const response = await submitApplication({
        job_id: jobDatabaseId,
        first_name: firstName,
        last_name: lastName || undefined,
        email: normalizedEmail,
        phone: trimmedPhone,
        experience: trimmedExperience,
        qualifications: trimmedQualifications,
        technical_skills: trimmedSkills
          .split(",")
          .map((skill) => skill.trim()),
      });

      // The backend returns { success, message, data }.
      // Axios wraps that object inside response.data.
      if (!response.data?.success) {
        setFormError(
          response.data?.message ||
            "Unable to submit your application. Please try again."
        );
        return;
      }

      setSuccessMessage(
        `Your application for ${jobTitle} has been submitted successfully.`
      );

      onApplicationSubmitted();
    } catch (error) {
      console.error("Failed to submit application:", error);

      setFormError(
        axios.isAxiosError(error)
          ? error.response?.data?.message ||
              "Unable to connect to the server. Please try again."
          : "Something went wrong while submitting your application."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (alreadyApplied) {
    return (
      <div className="mt-5 border border-[#D8D7ED] bg-[#F5F3FB] p-4">
        <p className="flex items-center gap-2 text-xs font-medium text-[#3F3A8F] sm:text-sm">
          <CheckCircle2 size={17} />
          You have already applied for this position.
        </p>
        <p className="mt-1.5 text-[10px] leading-5 text-[#77778A] sm:text-xs">
          Track your application status in My Applications below.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-5 w-full space-y-5 2xl:max-w-[1800px] min-[2400px]:max-w-[2200px]"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="candidateName" className={labelClass}>
            Full Name <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center border border-[#D8D7ED] focus-within:border-[#3F3A8F]">
            <span className="pl-3 text-[#77778A]">
              <GraduationCap size={15} />
            </span>
            <input
              id="candidateName"
              value={name}
              onChange={(event) => {
                const value = event.target.value;

                if (/^[A-Za-z '-]*$/.test(value)) {
                  setName(value);
                }

                setFormError("");
              }}
              maxLength={80}
              autoComplete="name"
              placeholder="Enter your full name"
              className="h-10 w-full min-w-0 px-2.5 text-xs outline-none"
            />
          </div>
        </div>

        <div className="min-w-0">
          <label htmlFor="candidateEmail" className={labelClass}>
            Email Address <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center border border-[#E8E7F1] bg-[#F8F8FC]">
            <span className="pl-3 text-[#77778A]">
              <Mail size={15} />
            </span>
            <input
              id="candidateEmail"
              type="email"
              readOnly
              value={candidateEmail}
              className="h-10 w-full min-w-0 bg-transparent px-2.5 text-xs text-[#77778A] outline-none"
            />
          </div>

          <p className="mt-1 text-[9px] text-[#77778A]">
            Linked to your registered account.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="candidatePhone" className={labelClass}>
            Mobile Number <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center border border-[#D8D7ED] focus-within:border-[#3F3A8F]">
            <span className="pl-3 text-[#77778A]">
              <Phone size={15} />
            </span>
            <input
              id="candidatePhone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              value={phone}
              onChange={(event) => {
                setPhone(
                  event.target.value.replace(/\D/g, "").slice(0, 10)
                );
                setFormError("");
              }}
              placeholder="10-digit mobile number"
              className="h-10 w-full min-w-0 px-2.5 text-xs outline-none"
            />
          </div>

          <p className="mt-1 text-[9px] text-[#77778A]">
            Indian mobile number starting with 6–9.
          </p>
        </div>

        <div className="min-w-0">
          <label htmlFor="candidateExperience" className={labelClass}>
            Experience <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center border border-[#D8D7ED] focus-within:border-[#3F3A8F]">
            <span className="pl-3 text-[#77778A]">
              <Clock3 size={15} />
            </span>
            <select
              id="candidateExperience"
              value={experience}
              onChange={(event) => {
                setExperience(event.target.value);
                setFormError("");
              }}
              className="h-10 w-full min-w-0 bg-white px-2.5 text-xs outline-none"
            >
              <option value="">Select experience</option>
              {experienceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <section className="border-t border-[#E8E7F1] pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-medium text-[#0B2545] sm:text-sm">
              Qualifications <span className="text-red-500">*</span>
            </h4>
            <p className="mt-1 text-[10px] leading-4 text-[#77778A]">
              Enter the course, college name, and completion year.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddQualification}
            disabled={qualifications.length >= 10}
            className="inline-flex items-center gap-1.5 border border-[#D8D7ED] px-3 py-2 text-[10px] font-medium text-[#3F3A8F] hover:border-[#3F3A8F] hover:bg-[#EEF0FA] disabled:opacity-50 sm:text-xs"
          >
            <Plus size={14} /> Add Qualification
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {qualifications.map((item, index) => (
            <div
              key={index}
              className="min-w-0 border border-[#D8D7ED] bg-[#FAFAFE] p-3 sm:p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-[#3F3A8F]">
                  Qualification {index + 1}
                </h5>

                {qualifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQualification(index)}
                    className="inline-flex items-center gap-1 text-[10px] text-[#A34D58] sm:text-xs"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`course-${index}`}
                    className={labelClass}
                  >
                    Course *
                  </label>
                  <input
                    id={`course-${index}`}
                    value={item.course}
                    maxLength={100}
                    onChange={(event) =>
                      updateQualification(
                        index,
                        "course",
                        event.target.value
                      )
                    }
                    placeholder="e.g. BCA, B.Sc., B.Tech"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`year-${index}`}
                    className={labelClass}
                  >
                    Year of Completion *
                  </label>
                  <input
                    id={`year-${index}`}
                    type="number"
                    min={1950}
                    max={currentYear + 10}
                    value={item.year}
                    onChange={(event) =>
                      updateQualification(
                        index,
                        "year",
                        event.target.value
                      )
                    }
                    placeholder={`e.g. ${currentYear}`}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`college-${index}`}
                    className={labelClass}
                  >
                    College Name *
                  </label>
                  <input
                    id={`college-${index}`}
                    value={item.collegeName}
                    maxLength={150}
                    onChange={(event) =>
                      updateQualification(
                        index,
                        "collegeName",
                        event.target.value
                      )
                    }
                    placeholder="Enter your college or institution name"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-2 text-[9px] text-[#77778A]">
          Add up to 10 qualifications. All fields are required.
        </p>
      </section>

      <section className="border-t border-[#E8E7F1] pt-4">
        <label
          htmlFor="technicalSkills"
          className="text-xs font-medium text-[#0B2545] sm:text-sm"
        >
          Technical Skills <span className="text-red-500">*</span>
        </label>

        <p className="mt-1 text-[10px] leading-4 text-[#77778A]">
          Enter skills separated by commas. Duplicate skills are not allowed.
        </p>

        <div className="mt-3 flex items-start gap-2.5 border border-[#D8D7ED] px-3 py-2.5 focus-within:border-[#3F3A8F]">
          <Code2 size={16} className="mt-1 shrink-0 text-[#77778A]" />
          <textarea
            id="technicalSkills"
            rows={3}
            maxLength={500}
            value={technicalSkills}
            onChange={(event) => {
              setTechnicalSkills(event.target.value);
              setFormError("");
            }}
            placeholder="React, TypeScript, JavaScript, HTML, CSS, SQL"
            className="w-full resize-y bg-transparent text-xs leading-5 outline-none placeholder:text-[#A09FB0]"
          />
        </div>

        <div className="mt-1.5 flex justify-between gap-2">
          <p className="text-[9px] text-[#77778A]">
            1–20 skills, 2–40 characters each.
          </p>
          <span className="text-[9px] text-[#77778A]">
            {technicalSkills.length}/500
          </span>
        </div>
      </section>

      {formError && (
        <p
          role="alert"
          className="border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-700"
        >
          {formError}
        </p>
      )}

      {successMessage && (
        <p
          role="status"
          className="flex items-start gap-2 border border-[#D8D7ED] bg-[#F5F3FB] px-3 py-2.5 text-xs leading-5 text-[#3F3A8F]"
        >
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          {successMessage}
        </p>
      )}

      <div className="border-t border-[#E8E7F1] pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group inline-flex min-h-10 w-full items-center justify-center gap-2 bg-[#3F3A8F] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#302A78] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>

        <p className="mt-2.5 text-[9px] leading-4 text-[#77778A] sm:text-[10px]">
          Please verify all details before submitting. Only one application is allowed per position.
        </p>
      </div>
    </form>
  );
}