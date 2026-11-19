import {
  BookOpen,
  Target,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

import { fadeUp, viewport } from "@/lib/motion";

const reasons = [
  {
    icon: BookOpen,
    title: "Practical Learning",
    description:
      "Learn through hands-on tasks, real projects, and practical problem-solving.",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description:
      "Get direction, feedback, and support while you build your skills.",
  },
  {
    icon: Target,
    title: "Career Preparation",
    description:
      "Develop the confidence and experience needed for your next opportunity.",
  },
];

const WhyMentorship = () => {
  return (
    <section className="w-full overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-7xl py-8 sm:py-10 lg:py-12 2xl:max-w-[1800px] min-[2400px]:max-w-[2200px]">
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid gap-3 px-3 sm:px-5 md:grid-cols-[42px_0.45fr_1fr] md:items-end md:gap-5 lg:px-6"
        >
          <div className="md:col-span-2">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#3F3A8F] sm:text-[10px]">
                Why Mentorship
              </span>
            </div>

            <h2 className="text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#0B2545] sm:text-3xl lg:text-4xl">
              Learn with
              <span className="text-[#3F3A8F]"> purpose</span>
            </h2>
          </div>

          <p className="max-w-xl text-xs font-normal leading-5 text-[#55556A] sm:text-sm sm:leading-6 md:col-start-3">
            Our mentorship focuses on practical learning, personal guidance,
            and the skills you need to move confidently toward your career.
          </p>
        </motion.div>

        {/* REASONS */}
        <div className="mt-6 w-full border-y border-[#D8D7ED]">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <motion.div
                key={reason.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className={`grid gap-3 px-3 py-4 sm:grid-cols-[42px_0.45fr_1fr] sm:items-center sm:gap-5 sm:px-5 lg:px-6 ${
                  index !== reasons.length - 1
                    ? "border-b border-[#D8D7ED]"
                    : ""
                }`}
              >
                {/* ICON + TITLE */}
                <div className="flex items-center gap-3 sm:contents">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF0FA] text-[#3F3A8F]">
                    <Icon size={16} strokeWidth={1.8} />
                  </div>

                  <h3 className="text-base font-medium leading-5 text-[#0B2545] sm:text-lg">
                    {reason.title}
                  </h3>
                </div>

                {/* DESCRIPTION */}
                <p className="text-[11px] font-normal leading-4 text-[#77778A] sm:text-sm sm:leading-5">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyMentorship;