import { useState } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import { serviceReveal } from "@/lib/motion";
import { services } from "@/data/services";

function ServicesPreview() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <section className="w-full bg-[#F5F3FB] py-6 sm:py-7 lg:py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">

        {/* HEADER */}
        <div className="mb-5 sm:mb-6 2xl:mb-7 min-[2400px]:mb-8">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#7D73C0] sm:text-[11px] md:text-[12px] 2xl:text-[13px] min-[2400px]:text-[14px]">
              Our Services
            </span>

            <h2 className="mt-1 text-[27px] font-semibold tracking-[-0.04em] text-[#0B2545] sm:text-3xl md:text-[36px] lg:text-[32px] 2xl:text-[38px] min-[2400px]:text-[44px]">
              What we <span className="text-[#44398F]">do</span>
            </h2>

            <p className="mt-1.5 max-w-xl text-[13px] font-normal leading-5 text-[#6B6A7A] sm:text-[14px] md:text-[15px] 2xl:mt-2 2xl:max-w-2xl 2xl:text-[16px] 2xl:leading-6 min-[2400px]:text-[18px] min-[2400px]:leading-7">
              Practical solutions designed to help your business grow,
              stand out, and succeed.
            </p>
          </motion.div>

          {/* MOBILE VIEW ALL - AFTER PARAGRAPH */}
          <div className="mt-2 flex justify-end sm:hidden">
            <Link
              to="/services"
              className="group inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-[#44398F] transition-colors hover:text-[#7D73C0]"
            >
              View all services
              <ArrowUpRight
                size={13}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* SERVICES */}
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:gap-5 2xl:gap-7 min-[2400px]:gap-9">
          {services.slice(0, 3).map((service, index) => {
            const Icon = service.icon;
            const isActive = activeCard === service.slug;

            return (
              <motion.div
                key={service.slug}
                initial="hidden"
                animate="visible"
                variants={serviceReveal}
                transition={{ delay: index * 0.06 }}
                onClick={() =>
                  setActiveCard(isActive ? null : service.slug)
                }
                className={`group relative min-h-[130px] w-full cursor-pointer overflow-hidden rounded-[16px] border p-3 shadow-[0_5px_18px_rgba(68,57,143,0.08)] transition-all duration-300 sm:min-h-[155px] sm:rounded-xl sm:p-3.5 md:min-h-[165px] lg:min-h-[160px] 2xl:min-h-[190px] 2xl:rounded-2xl 2xl:p-5 min-[2400px]:min-h-[220px] min-[2400px]:p-6 ${
                  isActive
                    ? "border-[#7D73C0] bg-[#0B2545] shadow-lg shadow-[#44398F]/20"
                    : "border-[#E5E2F2] bg-gradient-to-br from-white via-[#FAF9FD] to-[#F1EFFA] hover:-translate-y-1 hover:border-[#7D73C0] hover:shadow-lg"
                }`}
              >
                {/* DARK OVERLAY */}
                <div
                  className={`pointer-events-none absolute inset-0 z-[1] bg-[#0B2545] transition-opacity duration-500 ${
                    isActive
                      ? "opacity-70"
                      : "opacity-0 group-hover:opacity-70"
                  }`}
                />

                {/* PURPLE GRADIENT */}
                <div
                  className={`pointer-events-none absolute inset-0 z-[2] bg-gradient-to-br from-[#0B2545]/90 via-[#44398F]/80 to-[#7D73C0]/30 transition-opacity duration-500 ${
                    isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                />

                {/* CONTENT */}
                <div className="relative z-[5] flex min-w-0 flex-col">
                  <div className="flex min-w-0 items-center gap-2.5 pr-7 2xl:gap-3.5 min-[2400px]:gap-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm transition-all duration-300 sm:h-10 sm:w-10 sm:rounded-full md:h-11 md:w-11 2xl:h-14 2xl:w-14 min-[2400px]:h-16 min-[2400px]:w-16 ${
                        isActive
                          ? "bg-[#7D73C0] text-white"
                          : "bg-[#F1EFFA] text-[#44398F] group-hover:bg-[#7D73C0] group-hover:text-white"
                      }`}
                    >
                      <Icon
                        size={16}
                        strokeWidth={1.8}
                        className="sm:size-[18px] md:size-[20px] 2xl:!h-6 2xl:!w-6 min-[2400px]:!h-7 min-[2400px]:!w-7"
                      />
                    </div>

                    <h3
                      className={`min-w-0 pt-0.5 text-[12px] font-medium leading-tight tracking-tight transition-colors duration-300 sm:pt-0 sm:text-[14px] md:text-[16px] lg:text-[15px] 2xl:text-[18px] min-[2400px]:text-[21px] ${
                        isActive
                          ? "text-white"
                          : "text-[#0B2545] group-hover:text-white"
                      }`}
                    >
                      {service.title}
                    </h3>
                  </div>

                  {/* DESCRIPTION */}
                  <p
                    className={`mt-2 max-w-[320px] line-clamp-2 text-[11px] font-normal leading-[1.5] transition-colors duration-300 sm:text-[11px] md:text-[12px] lg:text-[11px] 2xl:mt-3 2xl:max-w-[440px] 2xl:text-[14px] 2xl:leading-relaxed min-[2400px]:mt-4 min-[2400px]:max-w-[520px] min-[2400px]:text-[16px] ${
                      isActive
                        ? "text-[#E5E2F2]"
                        : "text-[#6B6A7A] group-hover:text-[#E5E2F2]"
                    }`}
                  >
                    {service.shortDescription}
                  </p>

                  {/* MORE INFO */}
                  <div className="mt-2.5 flex justify-start 2xl:mt-4 min-[2400px]:mt-5">
                    <Link
                      to={`/services/${service.slug}`}
                      onClick={(event) => event.stopPropagation()}
                      className={`group/link inline-flex min-h-7 items-center gap-1 rounded-md px-3 py-1 text-[9px] font-medium uppercase tracking-[0.08em] transition-all duration-300 md:min-h-8 md:text-[10px] 2xl:min-h-9 2xl:gap-1.5 2xl:px-4 2xl:text-[11px] min-[2400px]:min-h-10 min-[2400px]:px-5 min-[2400px]:text-[12px] ${
                        isActive
                          ? "bg-[#7D73C0] !text-white hover:bg-[#D8D4F0] hover:!text-[#44398F]"
                          : "bg-[#44398F] !text-white hover:translate-x-1 hover:bg-[#7D73C0]"
                      }`}
                    >
                      <span>More Info</span>
                      <ChevronRight size={12} className="2xl:!h-4 2xl:!w-4" />
                    </Link>
                  </div>
                </div>

                {/* DECORATIVE CIRCLES */}
                <div className="pointer-events-none absolute bottom-0 right-0 z-[3] h-[55px] w-[70px] opacity-100 2xl:h-[75px] 2xl:w-[90px] min-[2400px]:h-[90px] min-[2400px]:w-[110px]">
                  <span
                    className={`absolute -bottom-6 -right-5 h-14 w-14 rounded-full border-[8px] transition-all duration-700 2xl:h-[72px] 2xl:w-[72px] min-[2400px]:h-[85px] min-[2400px]:w-[85px] ${
                      isActive
                        ? "border-[#7D73C0]/20 -translate-x-1.5 -translate-y-1.5 scale-110"
                        : "border-[#44398F]/10 group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 group-hover:scale-110"
                    }`}
                  />

                  <span
                    className={`absolute -bottom-4 right-1 h-12 w-12 rounded-full transition-all duration-700 2xl:h-[62px] 2xl:w-[62px] min-[2400px]:h-[74px] min-[2400px]:w-[74px] ${
                      isActive
                        ? "bg-[#7D73C0]/20 -translate-x-1.5 -translate-y-1.5 scale-110"
                        : "bg-[#7D73C0]/30 group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 group-hover:scale-110"
                    }`}
                  />

                  <span
                    className={`absolute -bottom-1 right-0 h-8 w-8 rounded-full transition-all duration-700 2xl:h-10 2xl:w-10 min-[2400px]:h-12 min-[2400px]:w-12 ${
                      isActive
                        ? "bg-[#44398F]/30 -translate-x-1.5 -translate-y-1.5 scale-110"
                        : "bg-[#44398F]/30 group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 group-hover:scale-110"
                    }`}
                  />
                </div>

                {/* BOTTOM ACCENT */}
                <span
                  className={`absolute bottom-0 left-0 z-[6] hidden h-[2px] bg-gradient-to-r from-[#44398F] via-[#7D73C0] to-[#D8D4F0] transition-all duration-500 sm:block ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* DESKTOP VIEW ALL */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="mt-4 hidden justify-end sm:mt-5 sm:flex 2xl:mt-7 min-[2400px]:mt-9"
        >
          <Link
            to="/services"
            className="group inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#44398F] transition-colors duration-300 hover:text-[#7D73C0] md:text-[11px] 2xl:gap-2 2xl:text-[13px] min-[2400px]:text-[14px]"
          >
            View all services
            <ArrowUpRight
              size={13}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 2xl:!h-4 2xl:!w-4 min-[2400px]:!h-5 min-[2400px]:!w-5"
            />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

export default ServicesPreview;