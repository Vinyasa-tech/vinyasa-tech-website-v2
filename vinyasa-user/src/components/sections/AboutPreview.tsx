import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Check,
  Code2,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import {
  fadeUp,
  fadeIn,
  scaleIn,
  staggerContainer,
  viewport,
} from "@/lib/motion";

function AboutPreview() {
  return (
    <section className="w-full overflow-hidden bg-[#F8F9FD] py-6 sm:py-8 md:py-9 lg:py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">

        {/* Section label */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-3 sm:mb-4"
        >
          <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#6668B8] sm:text-[10px]">
            About Vinyasa
          </span>
        </motion.div>

        {/* Main content */}
        <div className="grid w-full min-w-0 gap-5 sm:gap-7 md:gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-10 xl:gap-12 2xl:gap-14 min-[2400px]:gap-16">

          {/* Image */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="relative w-full min-w-0"
          >
            <motion.div
              variants={scaleIn}
              className="relative w-full overflow-hidden rounded-xl border border-[#D8D7ED] bg-[#EEF0FA] sm:rounded-2xl"
            >
              <motion.img
                initial={{ scale: 1.02 }}
                whileInView={{ scale: 1 }}
                viewport={viewport}
                transition={{
                  duration: 1.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85"
                alt="Professional team collaborating"
                className="h-52 w-full object-cover sm:h-60 md:h-72 lg:h-80"
              />

              {/* Soft image overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B2545]/65 via-[#0B2545]/10 to-transparent" />

              {/* Image text */}
              <motion.div
                variants={fadeUp}
                className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 md:bottom-6 md:left-6"
              >
                <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-[#8C8BD1] sm:text-[9px] md:text-[10px]">
                  VINYASA
                </p>

                <p className="mt-0.5 text-[11px] font-medium text-white sm:mt-1 sm:text-sm md:text-base">
                  Technology • Design • Growth
                </p>
              </motion.div>

              {/* Experience */}
              <motion.div
                variants={fadeIn}
                className="absolute bottom-3 right-3 text-right sm:bottom-5 sm:right-5 md:bottom-6 md:right-6"
              >
                <p className="text-3xl font-semibold leading-none tracking-[-0.05em] text-white sm:text-4xl md:text-5xl">
                  10+
                </p>

                <p className="mt-1 text-[7px] font-medium uppercase tracking-[0.16em] text-[#8C8BD1] sm:text-[8px] md:text-[9px]">
                  Years Experience
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="w-full min-w-0"
          >
            {/* Heading */}
            <h2 className="max-w-xl text-[30px] font-semibold leading-[1.05] tracking-[-0.04em] text-[#0B2545] sm:text-4xl md:text-5xl lg:text-[42px]">
              Why
              <span className="text-[#3F3A8F]"> VINYASA</span>
            </h2>

            {/* Description */}
            <p className="mt-3 w-full max-w-xl break-words text-justify text-[12px] font-normal leading-[1.65] text-[#55556A] sm:mt-5 sm:text-sm sm:leading-6 md:mt-6 md:text-[15px] md:leading-7">
              We are a digital transformation consultancy and software
              development company providing innovative engineering solutions
              to help enterprises tackle complex challenges during their
              digital evolution. Since 2016, we have been a reliable software
              engineering partner for world-class brands, delivering
              top-quality projects on time.
            </p>

            <p className="mt-2.5 w-full max-w-xl break-words text-justify text-[12px] font-normal leading-[1.65] text-[#55556A] sm:mt-4 sm:text-sm sm:leading-6 md:mt-4 md:text-[15px] md:leading-7">
              Our commitment to learning and adapting has driven our
              continuous growth through changing and challenging times.
            </p>

            {/* Why Vinyasa points */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="mt-4 grid w-full min-w-0 grid-cols-1 gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-2 md:mt-7 md:gap-3"
            >
              <AboutPoint
                icon={<TrendingUp size={14} />}
                title="Proactive & Strategic Business Values"
              />

              <AboutPoint
                icon={<Check size={14} />}
                title="Complete Ownership"
              />

              <AboutPoint
                icon={<Code2 size={14} />}
                title="Multiple Domain & Services Expertise"
              />
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                to="/about"
                className="group mt-4 inline-flex min-h-9 items-center gap-2 text-[11px] font-medium text-[#3F3A8F] transition-colors duration-300 hover:text-[#6668B8] sm:mt-6 sm:text-xs md:mt-7 md:text-sm"
              >
                Discover More

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3F3A8F] text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#6668B8] md:h-8 md:w-8">
                  <ArrowUpRight size={13} />
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* About point */
interface AboutPointProps {
  icon: ReactNode;
  title: string;
}

function AboutPoint({ icon, title }: AboutPointProps) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex w-full min-w-0 items-center gap-2 rounded-lg border border-[#D8D7ED] bg-white px-2.5 py-2.5 transition-all duration-300 hover:border-[#8C8BD1] hover:bg-[#EEF0FA] sm:px-2.5 sm:py-3 md:px-3 md:py-3.5"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#EEF0FA] text-[#3F3A8F] md:h-8 md:w-8">
        {icon}
      </span>

      <span className="min-w-0 break-words text-[10px] font-medium leading-[1.25] text-[#55556A] sm:text-[10px] md:text-[11px]">
        {title}
      </span>
    </motion.div>
  );
}

export default AboutPreview;