import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  MapPin,
  BriefcaseBusiness,
  Clock3,
  CheckCircle2,
  Send,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { CareerJob } from "@/types/careers";

interface JobCardProps {
  job: CareerJob;
}

export default function JobCard({ job }: JobCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  const handleApply = () => {
    navigate(
      `/careers/login?jobId=${encodeURIComponent(job.id)}`
    );
  };

  useEffect(() => {
    if (!showDetails) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowDetails(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showDetails]);

  return (
    <>
      {/* Compact Job Card */}
      <article className="flex h-full min-w-0 flex-col rounded-xl border border-[#D8D7ED] bg-white p-2.5 transition-colors duration-200 hover:border-[#8C8BD1] sm:p-3">
        <div className="flex-1">
          {/* Job title */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FA] text-[#3F3A8F]">
              <BriefcaseBusiness size={15} />
            </div>

            <h3 className="min-w-0 break-words text-[14px] font-semibold leading-5 text-[#0B2545] sm:text-base">
              {job.title}
            </h3>
          </div>

          {/* Job information - Department removed */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[#55556A] sm:text-[11px]">
            <div className="flex items-center gap-1.5">
              <MapPin
                size={13}
                className="shrink-0 text-[#3F3A8F]"
              />
              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <BriefcaseBusiness
                size={14}
                className="shrink-0 text-[#3F3A8F]"
              />
              <span>{job.employmentType}</span>
            </div>
          </div>

          {/* Description */}
          <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-[#55556A] sm:text-[12px]">
            {job.description || "No description provided."}
          </p>

          {/* Skills */}
          {job.skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {job.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-md border border-[#E1E0ED] bg-[#FAFAFE] px-1.5 py-1 text-[10px] text-[#66667A]"
                >
                  {skill}
                </span>
              ))}

              {job.skills.length > 3 && (
                <span className="px-1 py-1 text-[9px] text-[#77778A]">
                  +{job.skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-3 flex items-center justify-center gap-3 border-t border-[#D8D7ED] pt-3">
          <button
            type="button"
            onClick={() => setShowDetails(true)}
            className="w-auto min-w-[120px] rounded-lg border border-[#3F3A8F] px-3 py-2 text-center text-xs font-medium text-[#3F3A8F] transition-colors hover:bg-[#F5F3FB] sm:min-w-[140px] sm:px-4 sm:text-sm"
          >
            View Details
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="inline-flex w-auto min-w-[120px] items-center justify-center gap-1 rounded-lg bg-[#3F3A8F] px-3 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-[#302A78] sm:min-w-[140px] sm:px-4 sm:text-sm"
          >
            Apply Now
            <Send size={12} />
          </button>
        </div>
      </article>

      {/* Job Details Modal */}
      {showDetails &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B2545]/60 p-3 backdrop-blur-sm sm:p-5"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowDetails(false);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`job-details-title-${job.id}`}
              className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl 2xl:max-w-3xl min-[2400px]:max-w-4xl"
            >
              {/* Modal Header */}
              <div className="relative shrink-0 border-b border-[#D8D7ED] bg-[#F5F3FB] px-4 py-3.5 sm:px-5">
                <button
                  type="button"
                  onClick={() => setShowDetails(false)}
                  aria-label="Close job details"
                  className="absolute right-3 top-3 rounded-full p-1.5 text-gray-500 transition hover:bg-white hover:text-[#3F3A8F]"
                >
                  <X size={17} />
                </button>

                <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#3F3A8F]">
                  Job Opening
                </span>

                <h2
                  id={`job-details-title-${job.id}`}
                  className="mt-1 pr-8 text-base font-semibold leading-tight text-[#0B2545] sm:text-lg"
                >
                  {job.title}
                </h2>

                <p className="mt-1 text-[10px] text-[#77778A]">
                  Job overview and application details
                </p>
              </div>

              {/* Modal Content */}
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <InfoItem
                    icon={<MapPin size={14} />}
                    label="Location"
                    value={job.location}
                  />

                  <InfoItem
                    icon={<BriefcaseBusiness size={14} />}
                    label="Employment Type"
                    value={job.employmentType}
                  />

                  <InfoItem
                    icon={<Clock3 size={14} />}
                    label="Work Mode"
                    value={job.workMode}
                  />

                  <InfoItem
                    icon={<UserRound size={14} />}
                    label="Experience"
                    value={job.experience}
                  />
                </div>

                {/* About */}
                <section className="mt-4">
                  <SectionTitle>About the Role</SectionTitle>

                  <p className="mt-1.5 whitespace-pre-line text-xs leading-5 text-[#55556A]">
                    {job.description || "No description provided."}
                  </p>
                </section>

                {/* Responsibilities */}
                {job.responsibilities.length > 0 && (
                  <section className="mt-4">
                    <SectionTitle>
                      Key Responsibilities
                    </SectionTitle>

                    <ul className="mt-2 space-y-1.5">
                      {job.responsibilities.map((item, index) => (
                        <DetailItem
                          key={`${job.id}-responsibility-${index}`}
                          text={item}
                        />
                      ))}
                    </ul>
                  </section>
                )}

                {/* Skills */}
                {job.skills.length > 0 && (
                  <section className="mt-4">
                    <SectionTitle>Required Skills</SectionTitle>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {job.skills.map((skill, index) => (
                        <span
                          key={`${job.id}-skill-${index}`}
                          className="rounded-md border border-[#D8D7ED] bg-[#F5F3FB] px-2 py-1 text-[10px] font-medium text-[#3F3A8F]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Qualifications */}
                {job.qualifications.length > 0 && (
                  <section className="mt-4">
                    <SectionTitle>Qualifications</SectionTitle>

                    <ul className="mt-2 space-y-1.5">
                      {job.qualifications.map((item, index) => (
                        <DetailItem
                          key={`${job.id}-qualification-${index}`}
                          text={item}
                        />
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#D8D7ED] px-4 py-3 sm:flex-row sm:justify-end sm:px-5">
                <button
                  type="button"
                  onClick={() => setShowDetails(false)}
                  className="rounded-lg border border-[#D8D7ED] px-4 py-2 text-xs font-medium text-[#55556A] transition hover:bg-[#F5F3FB]"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handleApply}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#3F3A8F] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#302A78]"
                >
                  Apply for This Position
                  <Send size={13} />
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-[#D8D7ED] pb-1.5 text-xs font-semibold text-[#3F3A8F]">
      {children}
    </h3>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2 rounded-lg border border-[#D8D7ED] bg-[#F5F3FB]/60 px-2.5 py-2">
      <span className="mt-0.5 shrink-0 text-[#6668B8]">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[10px] text-[#77778A]">{label}</p>
        <p className="mt-0.5 break-words text-xs font-medium leading-4 text-[#0B2545]">
          {value}
        </p>
      </div>
    </div>
  );
}

function DetailItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-xs leading-5 text-[#55556A]">
      <CheckCircle2
        size={13}
        className="mt-1 shrink-0 text-[#6668B8]"
      />
      <span className="whitespace-pre-line">{text}</span>
    </li>
  );
}