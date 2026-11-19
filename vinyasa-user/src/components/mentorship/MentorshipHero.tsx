import { ArrowUpRight, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import mentorshipHeroImage from "@/assets/images/mentorship-hero.jpeg";
import { fadeUp, viewport } from "@/lib/motion";

const MentorshipHero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#44398F]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={mentorshipHeroImage}
          alt="Mentor guiding a learner"
          className="h-full w-full object-cover object-center"
        />

        {/* Main Purple Overlay */}
        <div
          className="absolute inset-0 bg-[#44398F]/90"
          aria-hidden="true"
        />

        {/* Bottom Purple Gradient */}
        <div
          className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#302A78]/30 to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[275px] w-full max-w-[1500px] items-center px-4 py-5 sm:min-h-[360px] sm:px-7 sm:py-9 md:min-h-[380px] md:px-10 lg:min-h-[350px] lg:px-12 xl:px-16 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="w-full min-w-0"
        >
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-2 flex items-center gap-2"
            >
              <span className="text-[8px] font-medium uppercase tracking-[0.14em] text-[#D8D4F0] sm:text-[9px] md:text-[10px]">
                Mentorship at Vinyasa
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.14,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="max-w-[680px] text-[30px] font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-[36px] md:text-[42px] lg:text-[44px] xl:text-[48px]"
            >
              Build Skills and
              <span className="block text-[#D8D4F0]">
                Grow Your Career
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.23,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-2.5 max-w-[500px] text-[11px] font-normal leading-[1.55] text-white/75 sm:text-[11px] md:text-[13px] md:leading-5"
            >
              Gain practical knowledge, work on real projects, and build
              confidence with guidance from experienced mentors.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.32,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-4 flex flex-wrap items-center gap-2"
            >
              {/* PRIMARY BUTTON */}
              <motion.div
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.97 }}
              >
                <a
                  href="#mentorship-programs"
                  className="group relative inline-flex h-9 items-center justify-center gap-1.5 overflow-hidden rounded-full bg-[#D8D4F0] px-3.5 text-[9px] font-medium uppercase tracking-[0.04em] !text-[#302A78] shadow-[0_8px_25px_rgba(216,212,240,0.14)] sm:h-10 sm:px-4 sm:text-[9px] md:text-[10px]"
                >
                  <motion.span
                    variants={{
                      rest: { x: "-102%" },
                      hover: { x: "0%" },
                    }}
                    transition={{
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute inset-0 bg-white"
                  />

                  <span className="relative z-10 !text-[#302A78]">
                    Explore Programs
                  </span>

                  <motion.span
                    variants={{
                      rest: { x: 0 },
                      hover: { x: 3 },
                    }}
                    transition={{
                      duration: 0.35,
                      ease: "easeOut",
                    }}
                    className="relative z-10 flex items-center"
                  >
                    <ArrowUpRight className="h-3 w-3 !text-[#302A78] sm:h-3.5 sm:w-3.5" />
                  </motion.span>
                </a>
              </motion.div>

              {/* APPLY FOR MENTORSHIP */}
              <motion.div
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/mentorship/apply"
                  className="group relative inline-flex h-10 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-white/70 bg-white px-4 text-[9px] font-semibold uppercase tracking-[0.05em] !text-[#302A78] shadow-[0_8px_30px_rgba(255,255,255,0.22)] ring-1 ring-white/20 transition-all duration-300 hover:shadow-[0_10px_35px_rgba(255,255,255,0.30)] sm:px-5 sm:text-[9px] md:text-[10px]"
                >
                  {/* HOVER SWEEP */}
                  <motion.span
                    variants={{
                      rest: {
                        x: "-102%",
                      },
                      hover: {
                        x: "0%",
                      },
                    }}
                    transition={{
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute inset-0 bg-[#D8D4F0]"
                  />

                  {/* ICON */}
                  <motion.span
                    variants={{
                      rest: {
                        x: 0,
                      },
                      hover: {
                        x: 2,
                      },
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                    className="relative z-10 flex items-center"
                  >
                    <GraduationCap
                      className="h-3.5 w-3.5 !text-[#302A78] sm:h-4 sm:w-4"
                      strokeWidth={1.9}
                    />
                  </motion.span>

                  {/* TEXT */}
                  <span className="relative z-10 !text-[#302A78]">
                    Apply for Mentorship
                  </span>

                  {/* SMALL ARROW */}
                  <motion.span
                    variants={{
                      rest: {
                        x: 0,
                      },
                      hover: {
                        x: 3,
                      },
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                    className="relative z-10 flex items-center"
                  >
                    <ArrowUpRight
                      className="h-3 w-3 !text-[#302A78] sm:h-3.5 sm:w-3.5"
                      strokeWidth={1.9}
                    />
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Small Supporting Line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.42,
                duration: 0.5,
              }}
              className="mt-2.5 text-[8px] font-medium uppercase tracking-[0.14em] text-[#D8D4F0]/65 sm:text-[7px] md:text-[8px]"
            >
              Learn • Practice • Build • Grow
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MentorshipHero;