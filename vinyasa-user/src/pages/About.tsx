import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Code2,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";
import { motion } from "motion/react";

import {
  capabilityReveal,
  fadeLeft,
  fadeRight,
  fadeUp,
  staggerContainer,
  viewport,
} from "@/lib/motion";

// =====================================================
// VALUES
// =====================================================

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We look for practical and modern ways to solve business challenges.",
  },
  {
    icon: Target,
    title: "Purpose",
    description:
      "Every solution starts with a clear business objective and measurable value.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "We work closely with our clients to understand their needs and ideas.",
  },
  {
    icon: Code2,
    title: "Quality",
    description:
      "We focus on dependable solutions, thoughtful design and long-term usability.",
  },
];

// =====================================================
// EXPERTISE
// =====================================================

const expertisePoints = [
  {
    title: "Business-Focused",
    description:
      "Solutions designed around real business goals and requirements.",
    icon: Building2,
  },
  {
    title: "Modern Technology",
    description:
      "Practical technologies that create reliable and future-ready solutions.",
    icon: Sparkles,
  },
  {
    title: "Creative Thinking",
    description:
      "Thoughtful ideas and experiences that solve problems in meaningful ways.",
    icon: Lightbulb,
  },
  {
    title: "Scalable Solutions",
    description:
      "Digital solutions built to adapt as your business grows.",
    icon: TrendingUp,
  },
  {
    title: "Reliable Support",
    description:
      "Continuous support that keeps your digital solutions running smoothly.",
    icon: ShieldCheck,
  },
  {
    title: "Quality & Performance",
    description:
      "Focused on usability, performance, reliability and long-term value.",
    icon: CheckCircle2,
  },
];

function About() {
  return (
    <main className="overflow-x-clip bg-white">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B2545] via-[#3F3A8F] to-[#0B2545]">
        {/* Decorative shapes */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full border border-[#8C8BD1]/15 sm:-right-24 sm:-top-24 sm:h-60 sm:w-60 md:h-64 md:w-64 lg:h-72 lg:w-72"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-[#7779C6]/10 blur-3xl sm:-bottom-24 sm:h-52 sm:w-52 md:h-56 md:w-56 lg:h-64 lg:w-64"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-6 top-1/2 h-14 w-14 rounded-full border border-[#8C8BD1]/10 sm:left-8 sm:h-16 sm:w-16 md:left-10 md:h-20 md:w-20 lg:left-12"
        />

        <div className="relative mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8 lg:py-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-3xl"
          >
            <span className="text-[8px] font-medium uppercase tracking-[0.16em] text-[#8C8BD1] sm:text-[9px] md:text-[10px] lg:text-[11px]">
              About VINYASA
            </span>

            <h1 className="mt-1.5 text-[28px] font-semibold leading-[1.05] tracking-[-0.045em] text-white sm:mt-2 sm:text-4xl md:text-5xl lg:text-[52px]">
              Technology with a
              <span className="text-[#8C8BD1]"> purpose</span>
            </h1>

            <p className="mt-2.5 max-w-2xl text-[11px] font-normal leading-[1.65] text-[#D8D7ED] sm:mt-3 sm:text-sm sm:leading-6 md:text-base md:leading-7 lg:text-[15px]">
              We are a digital transformation consultancy and software
              development company delivering practical technology solutions
              that help businesses solve complex challenges and grow with
              confidence.
            </p>

            {/* HERO CTA BUTTONS */}

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.28,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-5 sm:gap-3 md:mt-6"
            >
              {/* PRIMARY BUTTON */}

              <motion.div
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/contact"
                  className="group relative inline-flex h-9 items-center justify-center gap-1.5 overflow-hidden rounded-full bg-[#D8D4F0] px-4 text-[9px] font-medium uppercase tracking-[0.04em] !text-[#302A78] shadow-[0_8px_25px_rgba(216,212,240,0.14)] sm:h-10 sm:px-5 sm:text-[9px] md:text-[10px]"
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
                    Start a Conversation
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
                    <ArrowRight
                      size={14}
                      className="!text-[#302A78] sm:size-[15px] md:size-[16px]"
                    />
                  </motion.span>
                </Link>
              </motion.div>

              {/* SECONDARY BUTTON */}

              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              >
                <Link
                  to="/services"
                  className="group inline-flex h-9 items-center justify-center rounded-full border border-white/35 bg-white/10 px-4 text-[9px] font-semibold uppercase tracking-[0.04em] !text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white sm:h-10 sm:px-5 sm:text-[9px] md:text-[10px]"
                >
                  <span className="!text-white transition-colors duration-300 group-hover:!text-[#302A78]">
                    Explore Our Services
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          WHY VINYASA
      ===================================================== */}

      <section className="bg-white py-6 sm:py-8 md:py-9 lg:py-11">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-7 lg:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
          <div className="grid gap-5 sm:gap-6 md:grid-cols-[0.8fr_1.2fr] md:gap-7 lg:gap-10 xl:gap-12 2xl:gap-14 min-[2400px]:gap-16">
            {/* Intro */}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeLeft}
            >
              <span className="text-[8px] font-medium uppercase tracking-[0.16em] text-[#3F3A8F] sm:text-[9px] md:text-[10px] lg:text-[11px]">
                Why VINYASA
              </span>

              <h2 className="mt-1.5 max-w-md text-2xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#0B2545] sm:mt-2 sm:text-3xl md:text-4xl lg:text-[38px]">
                Experience that turns
                <span className="text-[#6668B8]"> ideas into results</span>
              </h2>

              <p className="mt-2.5 max-w-md text-[12px] font-normal leading-5 text-[#55556A] sm:mt-3 sm:text-xs sm:leading-5.5 md:text-sm md:leading-6 lg:text-[15px]">
                Since 2016, we have been a reliable software engineering
                partner for brands, delivering quality projects with a focus
                on practical business outcomes.
              </p>
            </motion.div>

            {/* Description */}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeRight}
              className="max-w-2xl"
            >
              <p className="text-[11.5px] font-normal leading-5 text-[#55556A] sm:text-sm sm:leading-6 md:text-base md:leading-7 lg:text-[15px]">
                We combine technology, design and digital expertise to create
                solutions that are useful, scalable and aligned with business
                goals.
              </p>

              <p className="mt-2 text-[11.5px] font-normal leading-5 text-[#55556A] sm:mt-3 sm:text-xs sm:leading-6 md:text-sm md:leading-6 lg:text-[15px]">
                Our commitment to learning and adapting helps us stay ready for
                changing technologies, evolving customer expectations and new
                business challenges.
              </p>

              {/* Highlights */}

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={staggerContainer}
                className="mt-3 grid grid-cols-1 gap-1.5 sm:mt-4 sm:grid-cols-3 sm:gap-2 md:gap-2.5 lg:mt-4"
              >
                <motion.div
                  variants={capabilityReveal}
                  className="flex min-w-0 items-center gap-1.5 rounded-lg border border-[#D8D7ED] bg-[#EEF0FA] px-2 py-2 sm:gap-2 sm:px-2.5 sm:py-2.5 md:px-2.5 md:py-2.5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-[#3F3A8F] sm:h-8 sm:w-8">
                    <Target size={14} className="sm:size-[15px]" />
                  </span>

                  <span className="min-w-0 text-[10px] font-medium leading-3.5 text-[#55556A] sm:text-[9px] sm:leading-4 md:text-[10px]">
                    Proactive & Strategic
                  </span>
                </motion.div>

                <motion.div
                  variants={capabilityReveal}
                  className="flex min-w-0 items-center gap-1.5 rounded-lg border border-[#D8D7ED] bg-[#EEF0FA] px-2 py-2 sm:gap-2 sm:px-2.5 sm:py-2.5 md:px-2.5 md:py-2.5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-[#3F3A8F] sm:h-8 sm:w-8">
                    <Check size={14} className="sm:size-[15px]" />
                  </span>

                  <span className="min-w-0 text-[10px] font-medium leading-3.5 text-[#55556A] sm:text-[9px] sm:leading-4 md:text-[10px]">
                    Complete Ownership
                  </span>
                </motion.div>

                <motion.div
                  variants={capabilityReveal}
                  className="flex min-w-0 items-center gap-1.5 rounded-lg border border-[#D8D7ED] bg-[#EEF0FA] px-2 py-2 sm:gap-2 sm:px-2.5 sm:py-2.5 md:px-2.5 md:py-2.5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-[#3F3A8F] sm:h-8 sm:w-8">
                    <Code2 size={14} className="sm:size-[15px]" />
                  </span>

                  <span className="min-w-0 text-[10px] font-medium leading-3.5 text-[#55556A] sm:text-[9px] sm:leading-4 md:text-[10px]">
                    Multiple Domain Expertise
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          VALUES
      ===================================================== */}

      <section className="bg-[#EEF0FA] py-3 sm:py-6 md:py-4 lg:py-5">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-7 lg:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            className="mb-4 sm:mb-5 md:mb-6 lg:mb-7"
          >
            <span className="text-[8px] font-medium uppercase tracking-[0.16em] text-[#3F3A8F] sm:text-[9px] md:text-[10px] lg:text-[11px]">
              What Guides Us
            </span>

            <h2 className="mt-1.5 text-2xl font-semibold tracking-[-0.04em] text-[#0B2545] sm:mt-2 sm:text-3xl md:text-4xl lg:text-[38px]">
              Principles behind
              <span className="text-[#6668B8]"> our work</span>
            </h2>

            <p className="mt-1.5 max-w-xl text-[11.5px] font-normal leading-5 text-[#55556A] sm:mt-2 sm:text-xs sm:leading-5.5 md:text-sm md:leading-6">
              Our approach is built around clear thinking, collaboration,
              quality and meaningful outcomes.
            </p>
          </motion.div>

          {/* Value Cards */}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
            className="grid grid-cols-2 border-l border-t border-[#D8D7ED] lg:grid-cols-4"
          >
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <motion.div
                  key={value.title}
                  variants={capabilityReveal}
                  className="group relative min-w-0 border-b border-r border-[#D8D7ED] bg-white p-3 transition-colors duration-300 hover:bg-[#3F3A8F] sm:p-3.5 md:p-4 lg:p-5"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FA] text-[#3F3A8F] transition-all duration-300 group-hover:bg-[#8C8BD1] group-hover:text-[#0B2545] sm:h-9 sm:w-9 md:h-10 md:w-10">
                      <Icon
                        size={16}
                        strokeWidth={1.8}
                        className="sm:size-[17px] md:size-[18px]"
                      />
                    </div>

                    <h3 className="min-w-0 text-[12px] font-medium leading-tight tracking-tight text-[#0B2545] transition-colors duration-300 group-hover:text-white sm:text-[13px] md:text-[15px] lg:text-base">
                      {value.title}
                    </h3>
                  </div>

                  <p className="mt-2 text-[11px] font-normal leading-[1.55] text-[#55556A] transition-colors duration-300 group-hover:text-[#D8D7ED] sm:text-[10px] sm:leading-5 md:text-[11px] lg:text-xs">
                    {value.description}
                  </p>

                  <div className="mt-2.5 h-0.5 w-5 bg-[#7779C6] transition-all duration-300 group-hover:w-10 sm:mt-3" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          EXPERTISE
      ===================================================== */}

      <section className="w-full overflow-hidden bg-white py-8 sm:py-10 md:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-7 lg:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
          {/* Heading */}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-[#3F3A8F] sm:text-[9px] md:text-[10px]">
              Our Expertise
            </span>

            <h2 className="mt-1.5 text-2xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#0B2545] sm:text-3xl md:text-4xl lg:text-[40px]">
              Technology that turns{" "}
              <span className="text-[#6668B8]">ideas into impact</span>
            </h2>

            <p className="mx-auto mt-2 max-w-2xl text-[11.5px] font-normal leading-5 text-[#55556A] sm:text-xs sm:leading-5.5 md:text-sm md:leading-6">
              We combine technology, creativity and business understanding to
              build practical digital solutions that help businesses work
              smarter, grow faster and stay ready for what comes next.
            </p>
          </motion.div>

          {/* DESKTOP TIMELINE */}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
            className="relative mt-10 hidden lg:block"
          >
            <div className="absolute left-[8%] right-[8%] top-[29px] border-t-2 border-dashed border-[#D8D7ED]" />

            <div className="grid grid-cols-6 gap-0 xl:gap-2 2xl:gap-4 min-[2400px]:gap-5">
              {expertisePoints.map((point, index) => {
                const Icon = point.icon;
                const isTop = index % 2 === 0;

                return (
                  <motion.div
                    key={point.title}
                    variants={capabilityReveal}
                    className="relative flex min-w-0 flex-col items-center"
                  >
                    <div
                      className={`absolute left-1/2 z-0 w-[3px] -translate-x-1/2 border-l-2 border-dashed border-[#D8D7ED] ${
                        isTop
                          ? "top-[29px] h-[56px]"
                          : "top-[29px] h-[141px]"
                      }`}
                    />

                    <div
                      className={`relative z-10 flex w-full flex-col items-center ${
                        isTop ? "pt-0" : "pt-[170px]"
                      }`}
                    >
                      <motion.div
                        whileHover={{
                          y: -4,
                          scale: 1.05,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                        className="relative flex h-[58px] w-[58px] items-center justify-center rounded-full border-[2px] border-[#6668B8] bg-white text-[#3F3A8F] shadow-[0_0_0_8px_#F7F8FC] transition-colors duration-300 hover:border-[#8C8BD1] hover:text-[#6668B8]"
                      >
                        <Icon size={22} strokeWidth={1.6} />

                        <span className="absolute -bottom-[7px] h-3 w-3 rounded-full bg-[#7779C6] shadow-[0_0_0_3px_white]" />
                      </motion.div>

                      {!isTop && (
                        <div className="h-8 w-[3px] border-l-2 border-dashed border-[#D8D7ED]" />
                      )}

                      <div
                        className={`w-full max-w-[170px] text-center ${
                          isTop ? "mt-7" : ""
                        }`}
                      >
                        <h3 className="text-[14px] font-medium leading-tight tracking-tight text-[#0B2545]">
                          {point.title}
                        </h3>

                        <div className="mx-auto mt-2 h-0.5 w-8 bg-[#7779C6]" />

                        <p className="mt-2.5 text-[11px] font-normal leading-[1.65] text-[#55556A]">
                          {point.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* MOBILE TIMELINE */}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
            className="relative mt-8 lg:hidden"
          >
            <div className="absolute bottom-5 left-1/2 top-5 -translate-x-1/2 border-l-2 border-dashed border-[#D8D7ED]" />

            <div className="space-y-8 sm:space-y-8">
              {expertisePoints.map((point, index) => {
                const Icon = point.icon;
                const isLeft = index % 2 === 0;

                return (
                  <motion.div
                    key={point.title}
                    variants={capabilityReveal}
                    className="relative grid grid-cols-[1fr_50px_1fr] items-center gap-2 sm:grid-cols-[1fr_58px_1fr] sm:gap-3"
                  >
                    {/* Left content */}

                    <div
                      className={`min-w-0 ${
                        isLeft ? "text-right" : ""
                      }`}
                    >
                      {isLeft && (
                        <>
                          <h3 className="text-[12px] font-medium leading-tight text-[#0B2545] sm:text-sm">
                            {point.title}
                          </h3>

                          <div className="ml-auto mt-1.5 h-0.5 w-7 bg-[#7779C6]" />

                          <p className="mt-1.5 text-[11px] font-normal leading-[1.55] text-[#55556A] sm:text-[10px] sm:leading-5">
                            {point.description}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Center icon */}

                    <motion.div
                      whileTap={{ scale: 0.96 }}
                      whileHover={{
                        scale: 1.05,
                      }}
                      transition={{
                        duration: 0.25,
                        ease: "easeOut",
                      }}
                      className="relative z-10 mx-auto flex h-[46px] w-[46px] items-center justify-center rounded-full border-2 border-[#6668B8] bg-white text-[#3F3A8F] shadow-[0_0_0_5px_#F7F8FC] sm:h-[52px] sm:w-[52px]"
                    >
                      <Icon
                        size={18}
                        strokeWidth={1.6}
                        className="sm:h-5 sm:w-5"
                      />

                      <span className="absolute left-[-7px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#7779C6] shadow-[0_0_0_2px_white] sm:left-[-8px]" />
                    </motion.div>

                    {/* Right content */}

                    <div className="min-w-0 text-left">
                      {!isLeft && (
                        <>
                          <h3 className="text-[12px] font-medium leading-tight text-[#0B2545] sm:text-sm">
                            {point.title}
                          </h3>

                          <div className="mt-1.5 h-0.5 w-7 bg-[#7779C6]" />

                          <p className="mt-1.5 text-[11px] font-normal leading-[1.55] text-[#55556A] sm:text-[10px] sm:leading-5">
                            {point.description}
                          </p>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="bg-white pb-6 sm:pb-8 md:pb-10 lg:pb-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-7 lg:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            className="flex flex-col gap-3 rounded-2xl bg-[#0B2545] px-4 py-5 sm:gap-4 sm:px-6 sm:py-6 md:px-7 md:py-7 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-8 lg:py-7 xl:gap-10 2xl:gap-12"
          >
            <div>
              <p className="text-[8px] font-medium uppercase tracking-[0.17em] text-[#8C8BD1] sm:text-[9px] md:text-[10px]">
                Let's build something useful
              </p>

              <h2 className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl md:text-2xl lg:text-[26px]">
                Have an idea?
                <span className="text-[#8C8BD1]"> Let's talk</span>
              </h2>

              <p className="mt-1 max-w-xl text-[9px] font-normal leading-4 text-[#D8D7ED]/80 sm:text-[10px] sm:leading-5 md:text-xs lg:text-[13px]">
                Tell us what you're trying to achieve and let's explore the
                right solution for your business.
              </p>
            </div>

            <Link
              to="/contact"
              className="group relative inline-flex w-fit shrink-0 items-center gap-2 overflow-hidden rounded-full bg-[#D8D4F0] px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.08em] !text-[#302A78] shadow-[0_8px_25px_rgba(216,212,240,0.12)] transition-all duration-300 hover:bg-white sm:px-5 md:px-6 md:text-xs lg:px-7"
            >
              <span className="relative z-10">
                Contact Us
              </span>

              <ArrowRight
                size={14}
                className="relative z-10 !text-[#302A78] transition-transform duration-300 group-hover:translate-x-1 sm:size-[15px] md:size-[16px]"
              />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default About;