import {
  Search,
  PenTool,
  Code2,
  Rocket,
} from "lucide-react";
import { motion } from "motion/react";

import { viewport } from "@/lib/motion";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We understand your goals, challenges, users, and business requirements.",
    icon: Search,
  },
  {
    number: "02",
    title: "Design",
    description:
      "We create practical experiences and solutions around your business needs.",
    icon: PenTool,
  },
  {
    number: "03",
    title: "Build",
    description:
      "Our team develops scalable digital solutions using modern technologies.",
    icon: Code2,
  },
  {
    number: "04",
    title: "Deliver & Grow",
    description:
      "We launch, refine, support, and continuously improve your solution.",
    icon: Rocket,
  },
];

function HowWeWork() {
  return (
    <section className="w-full overflow-hidden bg-white py-2 sm:py-10 md:py-12 lg:py-4 2xl:py-6">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 xl:gap-18 2xl:gap-20">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewport}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="min-w-0"
          >
            {/* Eyebrow */}
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#6668B8] sm:text-[11px] 2xl:text-xs">
              How We Work
            </span>

            {/* Heading */}
            <h2 className="mt-1 max-w-xl text-[30px] font-semibold leading-[1.1] tracking-[-0.04em] text-[#0B2545] sm:text-[36px] md:text-[42px] lg:text-[46px] 2xl:max-w-2xl 2xl:text-[54px] min-[2400px]:text-[60px]">
              From Idea to{" "}
              <span className="text-[#6668B8]">
                Impact
              </span>
            </h2>

            {/* Description */}
            <p className="mt-1 max-w-2xl text-[13px] font-normal leading-6 text-[#55556A] sm:text-[14px] sm:leading-7 2xl:text-base 2xl:leading-8">
              From the first conversation to long-term growth, we follow a
              clear and collaborative process that turns business ideas into
              practical digital solutions.
            </p>

            {/* Steps */}
            <div className="mt-4 sm:mt-3 lg:mt-3 2xl:mt-6">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.number}
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={viewport}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                    className="relative flex gap-3.5 sm:gap-4 2xl:gap-5"
                  >
                    {/* Icon + Line */}
                    <div className="relative flex w-14 shrink-0 justify-center sm:w-15 2xl:w-[68px]">
                      {/* Connecting line */}
                      {index !== steps.length - 1 && (
                        <span className="absolute left-1/2 h-[calc(100%-4px)] w-px -translate-x-1/2 bg-[#D8D7ED]" />
                      )}

                      {/* Icon circle */}
                      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[#D8D7ED] bg-[#EEF0FA] text-[#3F3A8F] transition-all duration-300 hover:border-[#8C8BD1] hover:bg-[#E6E7F5] sm:h-10 sm:w-10 2xl:h-12 2xl:w-12">
                        <Icon
                          size={18}
                          strokeWidth={1.8}
                          className="2xl:!h-5 2xl:!w-5"
                        />
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="min-w-0 pb-3 sm:pb-3 2xl:pb-5">
                      <div className="flex items-center gap-2 2xl:gap-3">
                        <span className="text-[18px] font-medium text-[#7779C6] sm:text-[16px] 2xl:text-xl">
                          {step.number}
                        </span>

                        <span className="h-px w-5 bg-[#D8D7ED] 2xl:w-7" />

                        <h3 className="text-[18px] font-medium tracking-tight text-[#0B2545] sm:text-[18px] 2xl:text-xl">
                          {step.title}
                        </h3>
                      </div>

                      <p className="mt-1.5 max-w-md text-[11px] font-normal leading-5 text-[#55556A] sm:text-[12px] sm:leading-6 2xl:max-w-xl 2xl:text-sm 2xl:leading-7">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewport}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="relative mb-4 overflow-hidden rounded-xl 2xl:rounded-2xl"
          >
            {/* Image */}
            <img
              src="https://plus.unsplash.com/premium_photo-1678566153919-86c4ba4216f1?auto=format&fit=crop&fm=jpg&q=85&w=1200"
              alt="Team collaborating on a digital project"
              className="h-52 w-full object-cover sm:h-60 md:h-72 lg:h-80 2xl:h-[440px] min-[2400px]:h-[500px]"
            />

            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/40 via-transparent to-transparent" />

            {/* Process Overlay */}
            <div className="absolute bottom-3 left-[8%] right-[8%] rounded-lg bg-[#0B2545]/95 px-2.5 py-2 shadow-lg backdrop-blur-sm sm:bottom-5 sm:left-[9%] sm:right-[9%] sm:px-2 sm:py-2 2xl:bottom-7 2xl:px-4 2xl:py-3">
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-[10%] right-[10%] top-2.5 h-px bg-[#7779C6]/40 sm:left-[10%] sm:right-[10%] sm:top-3 2xl:top-4" />

                <div className="relative grid grid-cols-4 gap-3 2xl:gap-5">
                  {steps.map((step) => (
                    <div
                      key={step.number}
                      className="flex min-w-0 flex-col items-center text-center"
                    >
                      {/* Number */}
                      <div className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full border border-[#8C8BD1] bg-[#0B2545] text-[6px] font-medium text-[#8C8BD1] sm:h-6 sm:w-6 sm:text-[8px] 2xl:h-8 2xl:w-8 2xl:text-[10px]">
                        {step.number}
                      </div>

                      {/* Title */}
                      <span className="mt-1 line-clamp-1 text-[6px] font-medium leading-none text-white sm:mt-1.5 sm:text-[9px] 2xl:mt-2 2xl:text-xs">
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HowWeWork;