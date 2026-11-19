import { useEffect, useState } from "react";

import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Lightbulb,
  Target,
  Users,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import {
  fadeLeft,
  fadeRight,
  fadeUp,
  scaleIn,
  serviceReveal,
  staggerContainer,
  viewport,
} from "@/lib/motion";

import {
  serviceDetails,
  type ServiceDetailData,
  type ServiceKey,
} from "@/data/ServiceDetail";

function ServiceDetail() {
  const { service } = useParams();

  const data: ServiceDetailData | undefined =
    serviceDetails[service as ServiceKey];

  const [openOffering, setOpenOffering] = useState<number | null>(null);

  useEffect(() => {
    setOpenOffering(null);
  }, [service]);

  if (!data) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-white px-4">
        <div className="w-full max-w-md text-center">
          <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#3F3A8F]">
            Service
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B2545] sm:text-3xl">
            Service not found
          </h1>

          <p className="mt-2 text-xs leading-5 text-[#55556A] sm:text-sm">
            The service you are looking for does not exist.
          </p>

          <Link
            to="/services"
            className="group relative mt-5 inline-flex min-h-10 items-center gap-2 overflow-hidden rounded-full bg-[#D8D4F0] px-4 py-2.5 text-xs font-medium !text-[#302A78] transition-all duration-300 hover:bg-white"
          >
            <span>Back to Services</span>
            <ArrowRight
              size={14}
              className="!text-[#302A78] transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </main>
    );
  }

  const Icon = data.icon;

  return (
    <main key={service} className="overflow-hidden bg-white">
      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B2545] via-[#3F3A8F] to-[#0B2545]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 lg:hidden"
        >
          <img
            src={data.image}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0B2545]/65" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#302A78]/70 via-[#3F3A8F]/55 to-[#0B2545]/80" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#8C8BD1]/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#7779C6]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-10 top-1/2 h-16 w-16 rounded-full border border-[#8C8BD1]/10"
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
          <div className="grid items-center gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-14 2xl:gap-16 min-[2400px]:gap-20">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeLeft}
              className="relative z-10 min-w-0"
            >
              <div className="flex items-center gap-2">
                <span className="h-1 w-7 rounded-full bg-[#8C8BD1]" />
                <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-[#D8D4F0] sm:text-[9px]">
                  {data.category}
                </span>
              </div>

              <div className="mt-4 flex items-start gap-3 sm:gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#8C8BD1]/25 bg-white/[0.06] text-[#D8D4F0] sm:h-14 sm:w-14">
                  <Icon size={21} strokeWidth={1.7} className="sm:hidden" />
                  <Icon size={25} strokeWidth={1.7} className="hidden sm:block" />
                </div>

                <h1 className="min-w-0 max-w-3xl text-[30px] font-semibold leading-[1.03] tracking-[-0.045em] text-white sm:text-4xl md:text-5xl lg:text-[50px]">
                  {data.title}
                </h1>
              </div>

              <p className="mt-4 max-w-2xl text-[11px] leading-[1.65] text-[#D8D7ED]/75 sm:text-sm sm:leading-6 md:text-[15px]">
                {data.intro}
              </p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.18,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-5 flex flex-wrap items-center gap-2.5"
              >
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/contact"
                    className="group relative inline-flex min-h-10 items-center gap-2 overflow-hidden rounded-full bg-[#D8D4F0] px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.04em] !text-[#302A78] shadow-[0_8px_25px_rgba(216,212,240,0.14)] sm:px-5 sm:text-xs"
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

                    <span className="relative z-10">Start a Project</span>

                    <motion.span
                      variants={{
                        rest: { x: 0 },
                        hover: { x: 3 },
                      }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="relative z-10 flex items-center"
                    >
                      <ArrowRight size={13} className="!text-[#302A78]" />
                    </motion.span>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Link
                    to="/services"
                    className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.04em] !text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white sm:px-5 sm:text-xs"
                  >
                    <span className="transition-colors duration-300 group-hover:!text-[#302A78]">
                      All Services
                    </span>
                    <ArrowUpRight
                      size={13}
                      className="!text-white transition-colors duration-300 group-hover:!text-[#302A78]"
                    />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* DESKTOP IMAGE */}

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeRight}
              className="relative z-10 hidden min-w-0 lg:flex lg:justify-end"
            >
              <div className="aspect-[16/9] w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10">
                <img
                  src={data.image}
                  alt={data.title}
                  loading="eager"
                  decoding="async"
                  className="block h-full w-full object-cover object-center"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}

      <section className="bg-white py-8 sm:py-10 md:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
          <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12 xl:gap-10 2xl:gap-12 min-[2400px]:gap-14">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeLeft}
              className="min-w-0"
            >
              <div className="flex items-center gap-2">
                <span className="h-1 w-6 rounded-full bg-[#8C8BD1]" />
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#3F3A8F]">
                  Overview
                </p>
              </div>

              <h2 className="mt-2.5 max-w-sm text-2xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#0B2545] sm:text-3xl md:text-4xl">
                Built around
                <span className="block text-[#6668B8]">your goals</span>
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeRight}
              className="min-w-0"
            >
              <h3 className="max-w-3xl text-lg font-semibold leading-tight tracking-[-0.025em] text-[#0B2545] sm:text-xl md:text-2xl">
                {data.heading}
              </h3>

              <p className="mt-3 max-w-3xl text-xs leading-5.5 text-[#55556A] sm:text-sm sm:leading-6 md:text-[15px]">
                {data.description}
              </p>

              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[
                  "Business focused",
                  "Practical solutions",
                  "Built to scale",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-lg border border-[#D8D7ED] bg-[#EEF0FA]/60 px-3 py-2.5"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#3F3A8F] text-[#8C8BD1]">
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                    <span className="text-[10px] font-medium text-[#0B2545] sm:text-[11px]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}

      <section className="bg-white py-8 sm:py-10 md:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            className="mb-6 max-w-2xl sm:mb-7"
          >
            <div className="flex items-center gap-2">
              <span className="h-1 w-6 rounded-full bg-[#8C8BD1]" />
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#3F3A8F]">
                What We Offer
              </p>
            </div>

            <h2 className="mt-2.5 text-2xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#0B2545] sm:text-3xl md:text-4xl">
              Expertise that supports
              <span className="text-[#6668B8]"> your business</span>
            </h2>

            <p className="mt-2.5 max-w-xl text-xs leading-5 text-[#55556A] sm:text-sm sm:leading-6">
              Explore the capabilities we bring together to solve practical
              challenges and create measurable digital value.
            </p>
          </motion.div>

          {data.offerings.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={staggerContainer}
             className="rounded-2xl bg-gradient-to-br from-[#302A78] via-[#3F3A8F] to-[#44398F] p-4 sm:p-5 md:p-6 xl:px-5 2xl:px-5 min-[2400px]:px-6"
            >
              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:gap-2 2xl:gap-2 min-[2400px]:gap-3">
                {data.offerings.map((offering, index) => {
                  const isOpen = openOffering === index;
                  const contentId = `offering-content-${index}`;

                  return (
                    <motion.div
                      key={offering.title}
                      variants={serviceReveal}
                      className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                        isOpen
                          ? "border-white/30 bg-white"
                          : "border-white/10 bg-white/[0.07] hover:border-white/20 hover:bg-white/[0.10]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenOffering(isOpen ? null : index)
                        }
                        aria-expanded={isOpen}
                        aria-controls={contentId}
                        className="group flex min-h-[68px] w-full items-center gap-3 px-4 py-4 text-left sm:px-5"
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[9px] font-semibold transition-colors duration-300 ${
                            isOpen
                              ? "bg-[#3F3A8F] text-white"
                              : "bg-white/10 text-[#D8D4F0]"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span
                          className={`min-w-0 flex-1 text-[13px] font-medium leading-5 tracking-tight transition-colors duration-300 sm:text-sm ${
                            isOpen ? "text-[#0B2545]" : "text-white"
                          }`}
                        >
                          {offering.title}
                        </span>

                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                            isOpen
                              ? "bg-[#EEF0FA] text-[#3F3A8F]"
                              : "bg-white/10 text-[#D8D4F0]"
                          }`}
                        >
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={contentId}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                              <div className="ml-12 border-l-2 border-[#D8D4F0] pl-4">
                                <p className="text-[12px] leading-5 text-[#66667A] sm:text-xs sm:leading-5.5">
                                  {offering.description}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <div className="rounded-2xl bg-gradient-to-br from-[#302A78] to-[#44398F] p-5">
              <p className="text-xs leading-5 text-[#D8D4F0]">
                Detailed offerings for this service will be added soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* HOW WE WORK */}

      <section className="bg-white py-8 sm:py-10 md:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2">
              <span className="h-1 w-6 rounded-full bg-[#8C8BD1]" />
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#3F3A8F]">
                How We Work
              </p>
            </div>

            <h2 className="mt-2.5 text-2xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#0B2545] sm:text-3xl md:text-4xl">
              From understanding
              <span className="text-[#6668B8]"> to delivery</span>
            </h2>

            <p className="mt-2.5 max-w-xl text-xs leading-5 text-[#55556A] sm:text-sm sm:leading-6">
              A clear and practical approach that keeps the work focused on
              your goals.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
            className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3 xl:gap-4 2xl:gap-5 min-[2400px]:gap-6"
          >
            <motion.div
              variants={serviceReveal}
              className="group rounded-xl border border-[#D8D7ED] bg-[#F8F9FD] p-4 transition-colors duration-300 hover:border-[#8C8BD1] sm:p-5"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3F3A8F] text-[#D8D4F0]">
                  <Lightbulb size={17} strokeWidth={1.8} />
                </div>
                <h3 className="text-sm font-semibold text-[#0B2545] sm:text-base">
                  Discover
                </h3>
              </div>
              <p className="mt-3 text-[11px] leading-5 text-[#66667A] sm:text-xs">
                Understand your requirements, challenges, users, and business
                goals.
              </p>
            </motion.div>

            <motion.div
              variants={serviceReveal}
              className="group rounded-xl border border-[#D8D7ED] bg-[#F8F9FD] p-4 transition-colors duration-300 hover:border-[#8C8BD1] sm:p-5"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3F3A8F] text-[#D8D4F0]">
                  <Target size={17} strokeWidth={1.8} />
                </div>
                <h3 className="text-sm font-semibold text-[#0B2545] sm:text-base">
                  Plan & Build
                </h3>
              </div>
              <p className="mt-3 text-[11px] leading-5 text-[#66667A] sm:text-xs">
                Shape the right solution and develop it around your priorities.
              </p>
            </motion.div>

            <motion.div
              variants={serviceReveal}
              className="group rounded-xl border border-[#D8D7ED] bg-[#F8F9FD] p-4 transition-colors duration-300 hover:border-[#8C8BD1] sm:p-5"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3F3A8F] text-[#D8D4F0]">
                  <Users size={17} strokeWidth={1.8} />
                </div>
                <h3 className="text-sm font-semibold text-[#0B2545] sm:text-base">
                  Deliver & Support
                </h3>
              </div>
              <p className="mt-3 text-[11px] leading-5 text-[#66667A] sm:text-xs">
                Refine the result, launch confidently, and keep improving when
                needed.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}

      <section className="bg-[#F8F9FD] px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8 lg:pb-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={scaleIn}
          className="mx-auto w-full max-w-7xl overflow-hidden rounded-2xl bg-[#0B2545] px-5 py-6 sm:px-7 sm:py-7 md:px-8 md:py-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between xl:gap-8 2xl:gap-10 min-[2400px]:gap-12">
            <div className="min-w-0">
              <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-[#8C8BD1]">
                Let's work together
              </p>

              <h2 className="mt-1.5 max-w-2xl text-xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-2xl md:text-3xl">
                Ready to build something
                <span className="text-[#8C8BD1]"> meaningful?</span>
              </h2>

              <p className="mt-1.5 max-w-xl text-[10px] leading-4.5 text-[#D8D7ED]/65 sm:text-xs sm:leading-5">
                Tell us what you are trying to achieve and let's explore the
                right solution together.
              </p>
            </div>

            <motion.div
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/contact"
                className="group relative inline-flex min-h-10 w-fit shrink-0 items-center gap-2 overflow-hidden rounded-full bg-[#D8D4F0] px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.08em] !text-[#302A78] shadow-[0_8px_25px_rgba(216,212,240,0.12)] sm:min-h-11 sm:px-5 sm:text-xs"
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

                <span className="relative z-10">Start Your Project</span>

                <motion.span
                  variants={{
                    rest: { x: 0 },
                    hover: { x: 3 },
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative z-10"
                >
                  <ArrowRight size={13} className="!text-[#302A78]" />
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default ServiceDetail;