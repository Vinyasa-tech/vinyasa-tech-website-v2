import {
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  FileText,
} from "lucide-react";
import { motion } from "motion/react";

import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

const journeySteps = [
  {
    number: "01",
    icon: FileText,
    title: "Apply",
    description:
      "Submit your application and tell us about your interests and goals.",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "Get Started",
    description:
      "Complete the initial discussion and choose the mentorship area that fits you.",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Learn",
    description:
      "Build your knowledge through guided sessions, resources, and practical learning.",
  },
  {
    number: "04",
    icon: Code2,
    title: "Build",
    description:
      "Apply what you learn through hands-on tasks and real project experience.",
  },
  {
    number: "05",
    icon: CheckCircle2,
    title: "Get Feedback",
    description:
      "Receive guidance, review your work, and improve your approach with your mentor.",
  },
  {
    number: "06",
    icon: Award,
    title: "Complete",
    description:
      "Finish your mentorship journey with stronger skills, practical experience, and confidence.",
  },
];

const MentorshipJourney = () => {
  return (
    <section className="w-full overflow-hidden bg-white">
      <div className="w-full py-8 sm:py-10 lg:py-12">
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mx-auto mb-6 max-w-2xl px-3 text-center sm:px-5"
        >
          <div className="mb-1.5 flex items-center justify-center gap-2">

            <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#3F3A8F] sm:text-[10px]">
              Your Mentorship Journey
            </span>

          </div>

          <h2 className="text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#0B2545] sm:text-3xl lg:text-4xl">
            From Application to Completion
          </h2>

          <p className="mt-2 text-xs font-normal leading-5 text-[#55556A] sm:text-sm sm:leading-6">
            A simple, guided experience designed to help you move from
            learning the basics to applying your skills with confidence.
          </p>
        </motion.div>

        {/* JOURNEY */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="w-full border-y border-[#D8D7ED]"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {journeySteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.title}
                  variants={fadeUp}
                  className={`relative px-3 py-4 sm:px-4 sm:py-5 lg:px-4 ${
                    index % 2 !== 0
                      ? "border-l border-[#D8D7ED]"
                      : ""
                  } ${
                    index >= 2
                      ? "border-t border-[#D8D7ED] md:border-t"
                      : ""
                  } ${
                    index % 3 !== 0
                      ? "md:border-l md:border-[#D8D7ED]"
                      : ""
                  } lg:border-l lg:border-t-0 ${
                    index === 0 ? "lg:border-l-0" : ""
                  }`}
                >
                  {/* TOP */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-medium tracking-[0.12em] text-[#7779C6]">
                      {step.number}
                    </span>

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF0FA] text-[#3F3A8F]">
                      <Icon size={15} strokeWidth={1.8} />
                    </div>
                  </div>

                  {/* CONTENT */}
                  <h3 className="mt-3 text-md font-medium leading-5 text-[#0B2545]">
                    {step.title}
                  </h3>

                  <p className="mt-1.5 text-[11px] font-normal leading-4 text-[#77778A] sm:text-[11px] sm:leading-5">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* BOTTOM NOTE */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="px-3 pt-4 text-center sm:px-5"
        >
          <p className="mx-auto max-w-2xl text-[10px] font-normal leading-4 text-[#77778A] sm:text-xs sm:leading-5">
            The exact duration and activities can vary depending on the
            mentorship program you choose.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default MentorshipJourney;