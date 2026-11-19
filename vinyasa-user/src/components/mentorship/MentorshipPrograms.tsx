import { useEffect, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  Laptop,
  Megaphone,
  PenTool,
  ChartNoAxesCombined,
  X,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";
import {
  getMentorshipPrograms,
  type MentorshipProgram as ApiMentorshipProgram,
} from "@/services/mentorshipProgramsApi";

interface WeeklyTopic {
  week: string;
  title: string;
  description?: string;
}

interface MentorshipProgram {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  mode: string;
  icon: LucideIcon;
  weeklyPlan: WeeklyTopic[];
  isActive: boolean;
  displayOrder: number;
}

const getProgramIcon = (title: string): LucideIcon => {
  const name = title.toLowerCase();

  if (name.includes("ai") || name.includes("machine learning")) {
    return BrainCircuit;
  }

  if (name.includes("software") || name.includes("mobile")) {
    return Code2;
  }

  if (name.includes("web") || name.includes("digital solution")) {
    return Laptop;
  }

  if (name.includes("cloud") || name.includes("infrastructure")) {
    return Cloud;
  }

  if (name.includes("data management")) {
    return Database;
  }

  if (name.includes("graphic") || name.includes("design")) {
    return PenTool;
  }

  if (name.includes("marketing")) {
    return Megaphone;
  }

  if (name.includes("data") || name.includes("analysis")) {
    return ChartNoAxesCombined;
  }

  return Laptop;
};

const createSlug = (title: string): string =>
  title
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const parseWeeklyPlan = (
  weeklyPlan: ApiMentorshipProgram["weekly_plan"]
): WeeklyTopic[] => {
  if (!weeklyPlan) return [];

  let parsed: unknown = weeklyPlan;

  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  return parsed.map((item, index) => {
    const topic = item as Record<string, unknown>;

    return {
      week: String(topic.week ?? `Week ${index + 1}`),
      title: String(topic.title ?? topic.topic ?? ""),
      description: String(topic.description ?? ""),
    };
  });
};

const mapApiProgram = (
  program: ApiMentorshipProgram,
  index: number
): MentorshipProgram => {
  const title = program.title ?? "";

  return {
    id: String(program.id),
    slug: createSlug(title),
    title,
    description: program.description ?? "",
    duration: program.duration ?? "12 Weeks",
    mode:
      "mode" in program && program.mode
        ? String(program.mode)
        : "Offline",
    icon: getProgramIcon(title),
    weeklyPlan: parseWeeklyPlan(program.weekly_plan),
    isActive:
      String(program.status ?? "open").toLowerCase() === "open" ||
      String(program.status ?? "").toLowerCase() === "active" ||
      String(program.status ?? "").toLowerCase() === "published",
    displayOrder:
      "display_order" in program &&
      typeof program.display_order === "number"
        ? program.display_order
        : index + 1,
  };
};

const MentorshipPrograms = () => {
  const [programs, setPrograms] = useState<MentorshipProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProgram, setSelectedProgram] =
    useState<MentorshipProgram | null>(null);

  const [expandedWeeks, setExpandedWeeks] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    const loadPrograms = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMentorshipPrograms();

        if (active) {
          const mappedPrograms = data
            .map(mapApiProgram)
            .filter((program) => program.isActive)
            .sort((a, b) => a.displayOrder - b.displayOrder);

          setPrograms(mappedPrograms);
        }
      } catch (err) {
        console.error("Failed to load mentorship programs:", err);

        if (active) {
          setError("Unable to load mentorship programs. Please try again later.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPrograms();

    return () => {
      active = false;
    };
  }, []);

  const activePrograms = programs;

  const toggleWeek = (week: string) => {
    setExpandedWeeks((previous) =>
      previous.includes(week)
        ? previous.filter((item) => item !== week)
        : [...previous, week]
    );
  };

  useEffect(() => {
    if (!selectedProgram) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProgram(null);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedProgram]);

  useEffect(() => {
    if (!selectedProgram) return;

    const scrollY = window.scrollY;
    const bodyStyle = document.body.style;
    const htmlStyle = document.documentElement.style;

    const previousBody = {
      position: bodyStyle.position,
      top: bodyStyle.top,
      width: bodyStyle.width,
      overflow: bodyStyle.overflow,
      paddingRight: bodyStyle.paddingRight,
    };

    const previousHtmlOverflow = htmlStyle.overflow;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.width = "100%";
    bodyStyle.overflow = "hidden";

    if (scrollbarWidth > 0) {
      bodyStyle.paddingRight = `${scrollbarWidth}px`;
    }

    htmlStyle.overflow = "hidden";

    return () => {
      bodyStyle.position = previousBody.position;
      bodyStyle.top = previousBody.top;
      bodyStyle.width = previousBody.width;
      bodyStyle.overflow = previousBody.overflow;
      bodyStyle.paddingRight = previousBody.paddingRight;

      htmlStyle.overflow = previousHtmlOverflow;

      window.scrollTo(0, scrollY);
    };
  }, [selectedProgram]);

  useEffect(() => {
    setExpandedWeeks([]);
  }, [selectedProgram]);

  return (
    <>
      <section
        id="mentorship-programs"
        className="w-full overflow-hidden bg-[#EEF0FA]"
      >
        <div className="mx-auto w-full px-2 py-7 sm:px-4 sm:py-9 md:px-5 lg:px-6 lg:py-10 xl:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid gap-3 md:grid-cols-[0.75fr_1.25fr] md:items-end lg:gap-5"
          >
            <div>
              <span className="text-[8px] font-medium uppercase tracking-[0.16em] text-[#3F3A8F] sm:text-[9px] lg:text-[10px]">
                Mentorship Programs
              </span>

              <h2 className="mt-1 text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#0B2545] sm:text-3xl lg:text-4xl">
                Choose an area
                <span className="block text-[#3F3A8F]">to grow in</span>
              </h2>
            </div>

            <p className="max-w-xl text-[13px] leading-5 text-[#55556A] sm:text-[11px] md:text-xs lg:text-[13px] xl:text-[14px]">
              Explore practical mentorship paths designed to help you build
              skills, work on projects, and gain experience in your area of
              interest.
            </p>
          </motion.div>

          {loading && (
            <div className="mt-5 rounded-xl border border-[#D8D7ED] bg-white px-4 py-7 text-center sm:rounded-2xl">
              <p className="text-[11px] font-medium text-[#0B2545] sm:text-xs md:text-sm">
                Loading mentorship programs...
              </p>
            </div>
          )}

          {!loading && error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-[#D8D7ED] bg-white px-4 py-7 text-center sm:rounded-2xl"
            >
              <p className="text-[11px] font-medium text-[#0B2545] sm:text-xs md:text-sm">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && activePrograms.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:gap-5 2xl:grid-cols-5 min-[2400px]:grid-cols-6"
            >
              {activePrograms.map((program) => {
                const Icon = program.icon;

                return (
                  <motion.article
                    key={program.id}
                    variants={fadeUp}
                    className="group min-w-0 overflow-hidden rounded-xl border border-[#DDDDF0] bg-white p-3 shadow-[0_2px_10px_rgba(63,58,143,0.05)] transition-all duration-300 hover:border-[#C8C5E5] hover:shadow-[0_6px_18px_rgba(63,58,143,0.08)] sm:rounded-2xl sm:p-4 lg:p-5 xl:p-6"
                  >
                    <div className="flex min-w-0 flex-col">
                      <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3F3A8F] text-white transition-all duration-300 sm:h-9 sm:w-9 lg:h-10 lg:w-10">
                          <Icon size={15} />
                        </div>

                        <h3 className="min-w-0 flex-1 text-[13px] font-medium leading-4 text-black sm:text-xs sm:leading-5 md:text-sm lg:text-[15px]">
                          {program.title}
                        </h3>
                      </div>

                      <div className="mt-3 sm:mt-3.5">
                        <p className="line-clamp-3 text-[11px] leading-4 text-[#77778A] sm:text-[10px] sm:leading-5 md:text-[11px] lg:text-[10px] xl:text-[12px]">
                          {program.description}
                        </p>

                        <button
                          type="button"
                          onClick={() => setSelectedProgram(program)}
                          className="mt-1 inline-flex items-center gap-1 !text-[11px] !leading-4 !font-bold text-[#3F3A8F] hover:text-[#302A78]"
                        >
                          Read more
                          <ArrowRight size={10} />
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#F0F0F5] pt-2.5 sm:mt-4 md:mt-5">
                        <div className="min-w-0">
                          <p className="text-[7px] font-medium uppercase tracking-[0.08em] text-[#9897A8] md:text-[8px]">
                            Duration
                          </p>

                          <p className="mt-1 text-[9px] font-medium text-[#0B2545] sm:text-[11px]">
                            {program.duration}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-[7px] font-medium uppercase tracking-[0.08em] text-[#9897A8] md:text-[8px]">
                            Mode
                          </p>

                          <p className="mt-1 text-[9px] font-medium text-[#0B2545] sm:text-[11px]">
                            {program.mode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}

          {!loading && !error && activePrograms.length === 0 && (
            <div className="mt-5 rounded-xl border border-[#D8D7ED] bg-white px-4 py-7 text-center sm:rounded-2xl">
              <p className="text-[11px] font-medium text-[#0B2545] sm:text-xs md:text-sm">
                Mentorship programs will be available soon
              </p>

              <p className="mt-1 text-[9px] text-[#77778A] sm:text-[10px] md:text-[11px]">
                Please check back later for available programs.
              </p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedProgram && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B2545]/70 p-3 sm:p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProgram(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="program-modal-title"
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 15 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
              className="flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-w-lg 2xl:max-w-3xl min-[2400px]:max-w-4xl"
            >
              <div className="flex shrink-0 items-center gap-3 border-b border-[#E8E7F0] px-4 py-3.5 sm:py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3F3A8F] text-white sm:h-11 sm:w-11">
                  <selectedProgram.icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[8px] font-medium uppercase tracking-[0.16em] text-[#7D73C0] sm:text-[9px]">
                    Mentorship Program
                  </p>

                  <h2
                    id="program-modal-title"
                    className="mt-0.5 text-sm font-semibold leading-5 text-[#0B2545] sm:text-base md:text-lg"
                  >
                    {selectedProgram.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProgram(null)}
                  aria-label="Close program details"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F0EFFB] text-[#3F3A8F] hover:bg-[#E5E2F4]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5 [scrollbar-width:thin] [scrollbar-color:#C8C5E5_transparent]">
                <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#3F3A8F] sm:text-[10px]">
                  About the program
                </p>

                <p className="mt-1.5 text-[11px] leading-5 text-[#55556A] sm:text-xs md:text-[13px]">
                  {selectedProgram.description}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="rounded-xl border border-[#E3E1EE] bg-[#F8F7FC] px-3 py-2.5">
                    <p className="text-[8px] uppercase tracking-[0.08em] text-[#9897A8] sm:text-[9px]">
                      Duration
                    </p>

                    <p className="mt-1 text-[11px] font-semibold text-[#0B2545] sm:text-xs">
                      {selectedProgram.duration}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E3E1EE] bg-[#F8F7FC] px-3 py-2.5">
                    <p className="text-[8px] uppercase tracking-[0.08em] text-[#9897A8] sm:text-[9px]">
                      Mode
                    </p>

                    <p className="mt-1 text-[11px] font-semibold text-[#0B2545] sm:text-xs">
                      {selectedProgram.mode}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#3F3A8F] sm:text-[11px]">
                    12-Week Learning Plan
                  </h3>

                  <div className="mt-3 overflow-hidden rounded-xl border border-[#D8D7ED]">
                    {selectedProgram.weeklyPlan.length > 0 ? (
                      selectedProgram.weeklyPlan.map((topic, index) => {
                        const hasDescription = Boolean(
                          topic.description?.trim()
                        );

                        const weekKey = `${selectedProgram.id}-${topic.week}-${index}`;
                        const isExpanded = expandedWeeks.includes(weekKey);

                        return (
                          <div
                            key={weekKey}
                            className="border-b border-[#D8D7ED] last:border-b-0"
                          >
                            {hasDescription ? (
                              <button
                                type="button"
                                aria-expanded={isExpanded}
                                onClick={() => toggleWeek(weekKey)}
                                className="flex w-full items-center gap-3 bg-[#F6F6F9] px-3 py-3 text-left transition-colors hover:bg-[#EFEDF9] sm:px-4 sm:py-3.5"
                              >
                                <span className="min-w-0 flex-1">
                                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <span className="shrink-0 text-[9px] font-semibold text-[#3F3A8F] sm:text-[10px]">
                                      {topic.week}
                                    </span>

                                    <span className="text-[11px] font-medium leading-4 text-[#0B2545] sm:text-xs md:text-[13px]">
                                      {topic.title}
                                    </span>
                                  </span>
                                </span>

                                <ChevronDown
                                  size={15}
                                  className={`shrink-0 text-[#302A78] transition-transform duration-200 ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                            ) : (
                              <div className="flex items-center gap-3 bg-[#F6F6F9] px-3 py-3 sm:px-4 sm:py-3.5">
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <span className="shrink-0 text-[9px] font-semibold text-[#3F3A8F] sm:text-[10px]">
                                      {topic.week}
                                    </span>

                                    <span className="text-[11px] font-medium leading-4 text-[#0B2545] sm:text-xs md:text-[13px]">
                                      {topic.title}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {hasDescription && isExpanded && (
                              <div className="bg-white px-3 py-3 sm:px-4 sm:py-3.5">
                                <p className="text-[10px] leading-5 text-[#55556A] sm:text-[11px]">
                                  {topic.description}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="bg-white px-3 py-4 text-[11px] leading-5 text-[#77778A] sm:px-4">
                        The weekly learning plan will be available soon.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 gap-2 border-t border-[#E8E7F0] px-4 py-3 sm:px-5">
                <button
                  type="button"
                  onClick={() => setSelectedProgram(null)}
                  className="flex min-h-9 flex-1 items-center justify-center rounded-lg border border-[#D8D7ED] px-3 text-[10px] font-semibold text-[#3F3A8F] hover:bg-[#F0EFFB] sm:text-[11px]"
                >
                  Close
                </button>

                <Link
                  to={`/mentorship/apply?program=${selectedProgram.slug}`}
                  onClick={() => setSelectedProgram(null)}
                  className="flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#3F3A8F] px-3 text-[10px] font-semibold !text-white hover:bg-[#302A78] sm:text-[11px]"
                >
                  Apply Now
                  <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MentorshipPrograms;