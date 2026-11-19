import {
  Lightbulb,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

import {
  fadeLeft,
  capabilityReveal,
  staggerContainer,
  viewport,
} from "@/lib/motion";

const reasons = [
  {
    icon: Lightbulb,
    title: "Business First",
    text: "Solutions begin with your actual business needs, not unnecessary technology.",
  },
  {
    icon: Zap,
    title: "Modern Technology",
    text: "We use practical and modern technology to create reliable digital solutions.",
  },
  {
    icon: Users,
    title: "People Focused",
    text: "We design experiences that are simple, useful and easy for people to use.",
  },
  {
    icon: ShieldCheck,
    title: "Long-Term Support",
    text: "We stay connected beyond delivery to help your solutions continue to grow.",
  },
];

function WhyChooseUs() {
  return (
    <section className="w-full overflow-hidden bg-[#F8F9FD] py-7 sm:py-9 md:py-11 lg:py-13">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="mb-5 sm:mb-7"
        >
          <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#3F3A8F] sm:text-[10px]">
            Why Choose Vinyasa
          </span>

          <h2 className="mt-1.5 max-w-2xl text-[25px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#0B2545] sm:text-3xl md:text-4xl lg:text-[40px]">
            Ideas into{" "}
            <span className="text-[#6668B8]">
              meaningful results
            </span>
          </h2>
        </motion.div>

        {/* Main Content */}
        <div className="grid items-stretch gap-3.5 md:gap-4 lg:grid-cols-[0.78fr_1.22fr] lg:gap-4 xl:gap-5 2xl:gap-7 min-[2400px]:gap-8">
          {/* Left Panel */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            whileHover={{
              y: -3,
              transition: {
                duration: 0.4,
                ease: "easeOut",
              },
            }}
            className="relative min-w-0 overflow-hidden rounded-2xl bg-[#3F3A8F] px-4.5 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7"
          >
            {/* Decorative Shapes */}
            <motion.div
              aria-hidden="true"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={viewport}
              transition={{
                duration: 1.2,
                ease: "easeOut",
              }}
              className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full border border-[#8C8BD1]/20"
            />

            <motion.div
              aria-hidden="true"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={viewport}
              transition={{
                duration: 1.2,
                delay: 0.15,
                ease: "easeOut",
              }}
              className="pointer-events-none absolute -right-8 top-8 h-28 w-28 rounded-full border border-[#7779C6]/20"
            />

            <div className="relative z-10">
              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#D8D7ED] sm:text-[10px]">
                Why Vinyasa
              </p>

              <h3 className="mt-1.5 max-w-md text-[23px] font-semibold leading-[1.06] tracking-[-0.035em] text-white sm:text-3xl md:text-4xl">
                One team
                <br />
                <span className="text-[#8C8BD1]">
                  Endless possibilities
                </span>
              </h3>

              <p className="mt-2.5 max-w-md text-[12px] font-normal leading-[1.65] text-justify text-white/75 sm:text-xs sm:leading-5 md:text-sm md:leading-6">
                From technology and design to marketing and business solutions,
                we bring the right expertise together to turn your vision into
                meaningful results.
              </p>

              {/* Highlights */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3"
              >
                {/* Creative Thinking */}
                <motion.div
                  variants={capabilityReveal}
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    transition: {
                      duration: 0.35,
                      ease: "easeOut",
                    },
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] px-2.5 py-2.5 transition-colors duration-300 hover:border-[#8C8BD1]/40 hover:bg-white/[0.1] sm:px-4 sm:py-3.5"
                >
                  <div className="flex items-center gap-2">
                    <motion.span
                      whileHover={{
                        scale: 1.08,
                        rotate: -4,
                      }}
                      whileTap={{
                        scale: 0.94,
                      }}
                      transition={{
                        duration: 0.25,
                        ease: "easeOut",
                      }}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#8C8BD1]/15 text-[#8C8BD1] transition-all duration-300 group-hover:bg-[#8C8BD1] group-hover:text-[#3F3A8F] sm:h-8 sm:w-8"
                    >
                      <Lightbulb size={15} strokeWidth={2} />
                    </motion.span>

                    <div className="min-w-0">
                      <p className="text-[11px] font-medium tracking-tight text-white sm:text-sm">
                        Creative
                      </p>

                      <p className="text-[7px] font-medium uppercase tracking-[0.12em] text-[#7779C6] sm:text-[9px]">
                        Thinking
                      </p>
                    </div>
                  </div>

                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#8C8BD1] transition-all duration-300 group-hover:w-full" />
                </motion.div>

                {/* Practical Solutions */}
                <motion.div
                  variants={capabilityReveal}
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    transition: {
                      duration: 0.35,
                      ease: "easeOut",
                    },
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] px-2.5 py-2.5 transition-colors duration-300 hover:border-[#7779C6]/40 hover:bg-white/[0.1] sm:px-4 sm:py-3.5"
                >
                  <div className="flex items-center gap-2">
                    <motion.span
                      whileHover={{
                        scale: 1.08,
                        rotate: 4,
                      }}
                      whileTap={{
                        scale: 0.94,
                      }}
                      transition={{
                        duration: 0.25,
                        ease: "easeOut",
                      }}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#7779C6]/15 text-[#7779C6] transition-all duration-300 group-hover:bg-[#7779C6] group-hover:text-white sm:h-8 sm:w-8"
                    >
                      <Zap size={15} strokeWidth={2} />
                    </motion.span>

                    <div className="min-w-0">
                      <p className="text-[11px] font-medium tracking-tight text-white sm:text-sm">
                        Practical
                      </p>

                      <p className="text-[7px] font-medium uppercase tracking-[0.12em] text-[#6668B8] sm:text-[9px]">
                        Solutions
                      </p>
                    </div>
                  </div>

                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#7779C6] transition-all duration-300 group-hover:w-full" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Feature Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 lg:gap-2.5 xl:gap-3 2xl:gap-4"
          >
            {reasons.map((reason) => {
              const Icon = reason.icon;

              return (
                <motion.div
                  key={reason.title}
                  variants={capabilityReveal}
                  whileHover={{
                    y: -5,
                    scale: 1.015,
                    transition: {
                      duration: 0.35,
                      ease: "easeOut",
                    },
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="group relative min-w-0 overflow-hidden rounded-xl border border-[#D8D7ED] bg-white p-2.5 shadow-sm transition-all duration-300 hover:border-[#8C8BD1] hover:shadow-lg hover:shadow-[#3F3A8F]/10 sm:p-5"
                >
                  {/* Bottom Accent */}
                  <motion.span
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%" }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#3F3A8F] via-[#7779C6] to-[#8C8BD1]"
                  />

                  {/* Icon + Title */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <motion.span
                      whileHover={{
                        scale: 1.08,
                        rotate: -3,
                      }}
                      whileTap={{
                        scale: 0.94,
                      }}
                      transition={{
                        duration: 0.25,
                        ease: "easeOut",
                      }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FA] text-[#3F3A8F] transition-all duration-300 group-hover:bg-[#3F3A8F] group-hover:text-white sm:h-10 sm:w-10"
                    >
                      <Icon
                        size={15}
                        strokeWidth={1.8}
                        className="sm:size-[17px]"
                      />
                    </motion.span>

                    <h3 className="min-w-0 text-[11px] font-medium leading-tight tracking-tight text-[#0B2545] sm:text-base">
                      {reason.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="mt-2 max-w-lg text-[10px] font-normal leading-[1.55] text-[#55556A] sm:mt-3 sm:text-[12px] sm:leading-6">
                    {reason.text}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;