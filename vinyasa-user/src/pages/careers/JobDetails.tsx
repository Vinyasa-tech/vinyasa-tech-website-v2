import {
  MapPin,
  BriefcaseBusiness,
  Clock3,
  ArrowLeft,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { careersJobs } from "@/data/careersJobs";

export default function JobDetails() {
  const { jobId } = useParams<{ jobId: string }>();

  const job = careersJobs.find(
    (item) => item.id === jobId && item.isActive
  );

  if (!job) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F5F3FB] px-5 py-16">
        <div className="w-full max-w-md rounded-2xl border border-[#D8D4F0] bg-white p-8 text-center 2xl:max-w-lg min-[2400px]:max-w-xl">
          <h1 className="text-2xl font-bold text-[#0B2545]">
            Job not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            This position may no longer be available.
          </p>

          <Link
            to="/careers"
            className="mt-6 inline-flex rounded-lg bg-[#40358C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#302A78]"
          >
            Browse Current Openings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F3FB] px-4 py-10 text-[#0B2545] sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-3xl 2xl:max-w-4xl min-[2400px]:max-w-[1200px]">
        <Link
          to="/careers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#40358C] hover:underline"
        >
          <ArrowLeft size={17} />
          Back to Careers
        </Link>

        {/* Job Overview */}
        <section className="mt-6 rounded-2xl border border-[#D8D4F0] bg-white p-6 shadow-sm sm:p-9">
          <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            {job.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <BriefcaseBusiness size={17} />
              {job.employmentType}
            </span>

            <span className="flex items-center gap-2">
              <Clock3 size={17} />
              {job.experience}
            </span>

            <span className="flex items-center gap-2">
              <MapPin size={17} />
              {job.location}
            </span>

            <span className="flex items-center gap-2">
              <Building2 size={17} />
              {job.workMode}
            </span>
          </div>

          <p className="mt-5 text-sm leading-7 text-gray-600">
            {job.description}
          </p>

          <Link
            to={`/careers/auth?jobId=${encodeURIComponent(job.id)}`}
            className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[#40358C] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#302A78] sm:w-auto"
          >
            Apply Now
          </Link>
        </section>

        {/* Responsibilities */}
        {job.responsibilities.length > 0 && (
          <section className="mt-5 rounded-2xl border border-[#D8D4F0] bg-white p-6 sm:p-8">
            <h2 className="text-lg font-bold">
              Key Responsibilities
            </h2>

            <ul className="mt-4 space-y-3">
              {job.responsibilities.map((item, index) => (
                <li
                  key={`${job.id}-responsibility-${index}`}
                  className="flex items-start gap-3 text-sm leading-6 text-gray-600"
                >
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-[#6668B8]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Skills */}
        {job.skills.length > 0 && (
          <section className="mt-5 rounded-2xl border border-[#D8D4F0] bg-white p-6 sm:p-8">
            <h2 className="text-lg font-bold">Required Skills</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-[#D8D4F0] bg-[#F5F3FB] px-3 py-2 text-sm font-medium text-[#40358C]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Qualifications */}
        {job.qualifications.length > 0 && (
          <section className="mt-5 rounded-2xl border border-[#D8D4F0] bg-white p-6 sm:p-8">
            <h2 className="text-lg font-bold">Qualifications</h2>

            <ul className="mt-4 space-y-3">
              {job.qualifications.map((item, index) => (
                <li
                  key={`${job.id}-qualification-${index}`}
                  className="flex items-start gap-3 text-sm leading-6 text-gray-600"
                >
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-[#6668B8]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-6 text-center">
          <Link
            to={`/careers/auth?jobId=${encodeURIComponent(job.id)}`}
            className="text-sm font-semibold text-[#40358C] hover:underline"
          >
            Ready to apply? Continue to application
          </Link>
        </div>
      </div>
    </main>
  );
}