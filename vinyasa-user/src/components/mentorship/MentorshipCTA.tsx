import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import { fadeUp, viewport } from "@/lib/motion";

const MentorshipCTA = () => {
  return (
    <section className="w-full overflow-hidden bg-[#EEF0FA]">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="relative w-full border-y border-[#D8D7ED]"
      >
        {/* Decorative Shape */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full border-[14px] border-[#7779C6]/15"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-7 sm:px-6 sm:py-8 md:flex-row md:items-center md:justify-between lg:px-8 2xl:max-w-[1800px] min-[2400px]:max-w-[2200px]">
          {/* CONTENT */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3F3A8F] text-white">
                <Sparkles size={13} strokeWidth={1.8} />
              </div>

              <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#3F3A8F] sm:text-[10px]">
                Start Your Journey
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#0B2545] sm:text-3xl lg:text-4xl">
              Ready to learn,
              <span className="text-[#3F3A8F]">
                {" "}
                build, and grow?
              </span>
            </h2>

            <p className="mt-2 max-w-xl text-xs font-normal leading-5 text-[#55556A] sm:text-sm sm:leading-6">
              Take the next step with practical mentorship, real project
              experience, and guidance that helps you move forward with
              confidence.
            </p>
          </div>

          {/* ACTION */}
          <div className="shrink-0">
            <Link
              to="/mentorship/apply"
              className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#3F3A8F] px-4 py-2.5 text-xs font-medium !text-white transition-all duration-300 hover:bg-[#0B2545] sm:text-sm"
            >
              Apply for Mentorship

              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default MentorshipCTA;