import {
  Heart,
  Lightbulb,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

const benefits = [
  {
    icon: TrendingUp,
    title: "Career Growth",
    description:
      "Continuous learning and opportunities to develop your skills.",
  },
  {
    icon: Users,
    title: "Collaborative Team",
    description:
      "Work with talented people and share ideas that make a difference.",
  },
  {
    icon: Heart,
    title: "Work-Life Balance",
    description:
      "A supportive work culture that values flexibility and wellbeing.",
  },
  {
    icon: Lightbulb,
    title: "Innovative Projects",
    description:
      "Work on modern ideas, technologies, and meaningful digital projects.",
  },
];

const WhyJoinUs = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
        {/* SECTION HEADING */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mx-auto mb-6 max-w-2xl text-center"
        >
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#3F3A8F] sm:text-[10px]">
              Why Join Vinyasa
            </span>
          </div>

          <h2 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#0B2545] sm:text-3xl lg:text-4xl">
            More Than Just a Job
          </h2>

          <p className="mt-2 text-xs font-normal leading-5 text-[#55556A] sm:text-sm sm:leading-6">
            We believe great work comes from people who have the opportunity
            to learn, contribute, collaborate, and grow.
          </p>
        </motion.div>

        {/* BENEFITS */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-2 border-y border-[#D8D7ED] lg:grid-cols-4"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                variants={fadeUp}
                className={`group px-3 py-4 sm:px-4 sm:py-5 lg:px-5 ${
                  index % 2 !== 0
                    ? "border-l border-[#D8D7ED]"
                    : ""
                } ${
                  index >= 2
                    ? "border-t border-[#D8D7ED] lg:border-t-0"
                    : ""
                } ${
                  index > 0
                    ? "lg:border-l lg:border-[#D8D7ED]"
                    : ""
                }`}
              >
                {/* ICON */}
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF0FA] text-[#3F3A8F] transition-all duration-300 group-hover:bg-[#3F3A8F] group-hover:text-white">
                  <Icon size={16} strokeWidth={1.8} />
                </div>

                {/* TITLE */}
                <h3 className="mt-3 text-center text-sm font-medium leading-4 text-[#0B2545] sm:text-sm sm:leading-5">
                  {benefit.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="mx-auto mt-1.5 max-w-[180px] text-center text-[11px] font-normal leading-4 text-[#55556A] sm:text-[11px] sm:leading-5">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyJoinUs;