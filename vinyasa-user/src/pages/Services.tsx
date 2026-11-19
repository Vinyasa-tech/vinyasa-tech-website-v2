import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import { services } from "@/data/services";

import {
  serviceReveal,
  viewport,
} from "@/lib/motion";

function Services() {
  return (
    <main className="bg-white">
      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B2545] via-[#3F3A8F] to-[#0B2545]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#8C8BD1]/15"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-[#7779C6]/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-8 top-1/2 h-16 w-16 rounded-full border border-[#8C8BD1]/10"
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-10 lg:px-8 lg:py-7 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  ease: "easeOut",
                },
              },
            }}
            className="max-w-3xl"
          >
            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#8C8BD1] sm:text-[10px]">
              Our Services
            </span>

            <h1 className="mt-2.5 text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-white sm:text-4xl md:text-5xl lg:text-[50px]">
              Technology and creativity
              <span className="text-[#8C8BD1]">
                {" "}working together
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-xs font-normal leading-5.5 text-[#D8D7ED] sm:text-sm sm:leading-6">
              From AI and software engineering to web, cloud,
              data, graphic design, and digital marketing, we
              provide practical digital solutions built around
              your business needs.
            </p>

            {/* BUTTONS - ONE ROW ON ALL SCREENS */}

            <div className="mt-5 flex flex-row items-center gap-2">
              <Link
                to="/contact"
                className="group relative inline-flex h-9 shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full bg-[#D8D4F0] px-3 uppercase text-[9px] font-medium !text-[#302A78] shadow-[0_8px_25px_rgba(216,212,240,0.14)] transition-all duration-300 hover:bg-white sm:gap-2 sm:px-4 sm:text-xs"
              >
                <span className="relative z-10">
                  Start a Conversation
                </span>

                <ArrowRight
                  size={13}
                  className="relative z-10 !text-[#302A78] transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/about"
                className="group inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 px-3 text-[9px] uppercase font-medium !text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white sm:px-4 sm:text-xs"
              >
                <span className="transition-colors duration-300 group-hover:!text-[#302A78]">
                  About VINYASA
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}

      <section className="bg-[#F8F9FD] py-8 sm:py-10 lg:py-7">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={{
              hidden: { opacity: 0, x: -18 },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  duration: 0.7,
                  ease: "easeOut",
                },
              },
            }}
            className="mb-5"
          >
            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#3F3A8F] sm:text-[10px]">
              What We Do
            </span>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0B2545] sm:text-3xl lg:text-[38px]">
              Solutions built for
              <span className="text-[#6668B8]">
                {" "}your needs
              </span>
            </h2>

            <p className="mt-1.5 max-w-xl text-xs font-normal leading-5 text-[#55556A] sm:text-sm sm:leading-6">
              Explore our services and find the right expertise
              for your next digital project.
            </p>
          </motion.div>

          {/* SERVICE GRID */}

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 xl:gap-5 2xl:gap-6 min-[2400px]:gap-7">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <motion.div
                  key={service.slug}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  variants={serviceReveal}
                  transition={{ delay: index * 0.06 }}
                >
                  <Link
                    to={`/services/${service.slug}`}
                    className="group relative block h-full overflow-hidden rounded-xl border border-[#D8D7ED] bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#8C8BD1] hover:shadow-lg hover:shadow-[#3F3A8F]/10 sm:p-5"
                  >
                    <div className="flex items-start gap-2 sm:items-center sm:gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0B2545] text-[#8C8BD1] transition-all duration-300 group-hover:bg-[#3F3A8F] group-hover:text-white sm:h-10 sm:w-10">
                        <Icon
                          size={16}
                          strokeWidth={1.8}
                          className="sm:hidden"
                        />

                        <Icon
                          size={19}
                          strokeWidth={1.8}
                          className="hidden sm:block"
                        />
                      </span>

                      <h3 className="min-w-0 flex-1 text-[11px] font-medium leading-[1.25] tracking-tight text-[#0B2545] transition-colors duration-300 group-hover:text-[#6668B8] sm:text-[16px]">
                        {service.title}
                      </h3>

                      <span className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EEF0FA] text-[#7779C6] transition-colors duration-300 group-hover:bg-[#EEF0FA] group-hover:text-[#3F3A8F] sm:flex">
                        <ArrowRight
                          size={14}
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>

                    <p className="mt-2 text-[9px] font-normal leading-4 text-[#55556A] sm:mt-3 sm:max-w-[340px] sm:text-[11px] sm:leading-5">
                      {service.shortDescription}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 border-t border-[#D8D7ED] pt-2.5 transition-colors duration-300 group-hover:border-[#8C8BD1]/40 sm:mt-4 sm:gap-2 sm:pt-3">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#7779C6]" />

                      <span className="text-[7px] font-medium uppercase tracking-[0.08em] text-[#55556A] transition-colors duration-300 group-hover:text-[#6668B8] sm:text-[9px] sm:tracking-[0.1em]">
                        Explore Service
                      </span>

                      <ArrowRight
                        size={10}
                        className="ml-auto text-[#D8D7ED] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#3F3A8F] sm:hidden"
                      />
                    </div>

                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#8C8BD1] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="bg-white py-7 sm:py-9">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.7,
                  ease: "easeOut",
                },
              },
            }}
            className="flex flex-col gap-4 rounded-2xl bg-[#0B2545] px-5 py-6 sm:px-7 sm:py-7 lg:flex-row lg:items-center lg:justify-between xl:gap-8 2xl:gap-10 min-[2400px]:gap-12"
          >
            <div>
              <span className="text-[9px] font-medium uppercase tracking-[0.17em] text-[#8C8BD1]">
                Let's work together
              </span>

              <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Have a project in mind?
                <span className="text-[#8C8BD1]">
                  {" "}Let's talk
                </span>
              </h2>

              <p className="mt-1 text-[10px] font-normal leading-5 text-[#D8D7ED]/75 sm:text-xs">
                Tell us what you need and let's find the right
                solution for your business.
              </p>
            </div>

            <Link
              to="/contact"
              className="group relative inline-flex w-fit shrink-0 items-center gap-2 overflow-hidden rounded-full bg-[#D8D4F0] px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.08em] !text-[#302A78] shadow-[0_8px_25px_rgba(216,212,240,0.12)] transition-all duration-300 hover:bg-white"
            >
              <span className="relative z-10">
                Contact Us
              </span>

              <ArrowRight
                size={14}
                className="relative z-10 !text-[#302A78] transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default Services;