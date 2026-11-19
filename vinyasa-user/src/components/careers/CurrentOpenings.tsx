import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "motion/react";

import {
  fadeUp,
  staggerContainer,
  viewport,
} from "@/lib/motion";

import { getOpenJobs } from "@/services/careersApi";
import type { CareerJob } from "@/types/careers";
import JobCard from "@/components/careers/JobCard";

interface BackendJob {
  id: number | string;
  title: string;
  location?: string | null;
  employment_type?: string | null;
  work_mode?: string | null;
  experience?: string | null;
  description?: string | null;
  responsibilities?: string[] | string | null;
  required_skills?: string[] | string | null;
  qualifications?: string[] | string | null;
  status?: string | null;
}

function toList(
  value: string[] | string | null | undefined
): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapJob(record: BackendJob): CareerJob {
  const rawStatus = String(record.status ?? "draft").toLowerCase();

  return {
    id: String(record.id),
    databaseId: Number(record.id),
    title: record.title || "Untitled position",
    location: record.location || "Not specified",
    employmentType: record.employment_type || "Not specified",
    workMode: record.work_mode || "Not specified",
    experience: record.experience || "Not specified",
    description: record.description || "",
    responsibilities: toList(record.responsibilities),
    skills: toList(record.required_skills),
    qualifications: toList(record.qualifications),
    isActive: rawStatus === "open",
  };
}

function unwrapJobs(responseData: unknown): BackendJob[] {
  if (Array.isArray(responseData)) {
    return responseData as BackendJob[];
  }

  if (!responseData || typeof responseData !== "object") {
    return [];
  }

  const payload = responseData as {
    data?: unknown;
  };

  if (Array.isArray(payload.data)) {
    return payload.data as BackendJob[];
  }

  if (
    payload.data &&
    typeof payload.data === "object" &&
    "data" in payload.data
  ) {
    const nested = (payload.data as { data: unknown }).data;

    if (Array.isArray(nested)) {
      return nested as BackendJob[];
    }
  }

  return [];
}

const CurrentOpenings = () => {
  const [jobs, setJobs] = useState<CareerJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const response = await getOpenJobs();
      const records = unwrapJobs(response.data);

      setJobs(records.map(mapJob));
    } catch (error) {
      console.error("Failed to load job openings:", error);

      setLoadError(
        "Unable to load job openings. Please check that your backend is running and the API is accessible."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  // Display only open jobs.
  const activeJobs = useMemo(
    () => jobs.filter((job) => job.isActive),
    [jobs]
  );

  // Search jobs by title, skills, location, and other details.
  const filteredJobs = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return activeJobs.filter((job) => {
      const searchableText = [
        job.title,
        job.description,
        job.location,
        job.employmentType,
        job.workMode,
        job.experience,
        ...job.responsibilities,
        ...job.skills,
        ...job.qualifications,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(search);
    });
  }, [activeJobs, searchTerm]);

  const clearFilters = () => {
    setSearchTerm("");
  };

  return (
    <section
      id="current-openings"
      className="w-full overflow-hidden bg-[#EEF0FA]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-3 py-6 sm:px-5 sm:py-8 md:px-6 md:py-10 lg:px-8 lg:py-12 xl:px-10 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
        {/* Section Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-5 w-full"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <span className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.16em] text-[#3F3A8F] sm:text-[10px]">
                Join Our Team
              </span>

              <h2 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#0B2545] sm:text-3xl lg:text-4xl">
                Current Openings
              </h2>

              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#55556A] sm:text-sm sm:leading-6">
                Explore opportunities and find a role where your
                skills, ideas, and curiosity can make an impact.
              </p>
            </div>

            {/* Search */}
            {activeJobs.length > 0 && (
              <div className="relative w-full md:w-[420px]">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7779C6]"
                />

                <input
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search jobs, skills, or roles..."
                  aria-label="Search job openings"
                  className="h-10 w-full rounded-lg border border-[#D8D7ED] bg-white pl-9 pr-3 text-xs text-[#0B2545] outline-none placeholder:text-[10px] focus:border-[#3F3A8F] focus:ring-2 focus:ring-[#3F3A8F]/10"
                />
              </div>
            )}
          </div>

          <div className="mt-3 text-[10px] font-medium text-[#77778A] sm:text-xs">
            Showing {filteredJobs.length}{" "}
            {filteredJobs.length === 1 ? "position" : "positions"}
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div
            role="status"
            className="rounded-xl border border-[#D8D7ED] bg-white px-4 py-10 text-center text-sm text-[#77778A]"
          >
            Loading current openings...
          </div>
        ) : loadError ? (
          /* Error State */
          <div className="rounded-xl border border-red-200 bg-white px-4 py-8 text-center">
            <p className="text-sm text-red-700">{loadError}</p>

            <button
              type="button"
              onClick={() => void loadJobs()}
              className="mt-3 rounded-lg bg-[#3F3A8F] px-4 py-2 text-xs font-medium text-white hover:bg-[#302A78]"
            >
              Try Again
            </button>
          </div>
        ) : filteredJobs.length > 0 ? (
          /* Reusable Job Cards */
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 items-stretch gap-3 sm:gap-4 lg:grid-cols-2"
          >
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                variants={fadeUp}
                className="min-w-0"
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-[#D8D7ED] bg-white px-4 py-10 text-center sm:min-h-[320px]">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF0FA] text-[#3F3A8F]">
              <Search size={17} />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-[#0B2545]">
              {activeJobs.length === 0
                ? "No current openings"
                : "No positions found"}
            </h3>

            <p className="mt-1 text-xs text-[#77778A]">
              {activeJobs.length === 0
                ? "Please check back later for new opportunities."
                : "Try a different search term."}
            </p>

            {activeJobs.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-2 text-xs font-medium text-[#3F3A8F] hover:text-[#0B2545]"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CurrentOpenings;