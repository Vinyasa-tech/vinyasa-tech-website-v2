import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import careersHeroImage from "@/assets/images/careers-hero.png";
import { fadeUp, viewport } from "@/lib/motion";

const CareersHero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#44398F]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={careersHeroImage}
          alt="Vinyasa team collaborating on a project"
          className="h-full w-full object-cover object-center"
        />

        {/* Main Purple Overlay */}
        <div
          className="absolute inset-0 bg-[#44398F]/90"
          aria-hidden="true"
        />

        {/* Bottom Gradient */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#302A78]/30 to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[300px] w-full max-w-[1500px] items-center px-4 py-7 sm:min-h-[390px] sm:px-7 sm:py-8 md:min-h-[410px] md:px-10 lg:min-h-[360px] lg:px-12 xl:px-16 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="w-full"
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
                Careers at Vinyasa
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
              className="max-w-[700px] text-[30px] font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-[36px] md:text-[42px] lg:text-[44px] xl:text-[48px]"
            >
              Build Your
              <span className="block text-[#D8D4F0]">
                Career With Us
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
              Join Vinyasa and turn your technical skills, creative thinking,
              and curiosity into experiences that people and businesses can
              actually use.
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
              {/* Primary */}
              <motion.div
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.97 }}
              >
                <a
                  href="#open-positions"
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
                    Explore Opportunities
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

              {/* Secondary */}
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              >
                <Link
                  to="/about"
                  className="group inline-flex h-9 items-center justify-center rounded-full border border-white/35 bg-white/10 px-3.5 text-[9px] font-medium uppercase tracking-[0.04em] !text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white sm:h-10 sm:px-4 sm:text-[9px] md:text-[10px]"
                >
                  <span className="!text-white transition-colors duration-300 group-hover:!text-[#302A78]">
                    Learn About Vinyasa
                  </span>

                  <ArrowUpRight className="ml-1.5 h-3 w-3 !text-white transition-colors duration-300 group-hover:!text-[#302A78] sm:h-3.5 sm:w-3.5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.42,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-4 grid max-w-[520px] grid-cols-3 border-t border-[#D8D4F0]/20 pt-3 sm:mt-5 sm:pt-4"
            >
              <div>
                <p className="text-lg font-semibold tracking-tight text-white sm:text-xl md:text-2xl">
                  20+
                </p>

                <p className="mt-0.5 text-[10px] font-medium text-white/60 sm:text-[9px] md:text-[10px]">
                  Happy Clients
                </p>
              </div>

              <div className="border-l border-[#D8D4F0]/20 px-3 sm:px-4">
                <p className="text-lg font-semibold tracking-tight text-white sm:text-xl md:text-2xl">
                  10+
                </p>

                <p className="mt-0.5 text-[10px] font-medium text-white/60 sm:text-[9px] md:text-[10px]">
                  Exciting Projects
                </p>
              </div>

              <div className="border-l border-[#D8D4F0]/20 pl-3 sm:pl-4">
                <p className="text-lg font-semibold tracking-tight text-[#D8D4F0] sm:text-xl md:text-2xl">
                  100%
                </p>

                <p className="mt-0.5 text-[10px] font-medium text-white/60 sm:text-[9px] md:text-[10px]">
                  Growth Focused
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CareersHero;