import {
  FileText,
  Search,
  UserRoundCheck,
  Rocket,
} from "lucide-react";
import { motion } from "motion/react";

import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

const hiringSteps = [
  {
    step: "01",
    icon: FileText,
    title: "Apply",
    description: "Submit your application online.",
  },
  {
    step: "02",
    icon: Search,
    title: "Screening",
    description: "Our team reviews your profile.",
  },
  {
    step: "03",
    icon: UserRoundCheck,
    title: "Interview",
    description: "Technical and HR rounds.",
  },
  {
    step: "04",
    icon: Rocket,
    title: "Offer",
    description: "Get ready to start your journey with us.",
  },
];

const HiringProcess = () => {
  return (
    <section className="w-full overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-7xl py-8 sm:py-10 lg:py-12 2xl:max-w-[1800px] min-[2400px]:max-w-[2200px]">
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-7 px-3 text-center sm:px-5 lg:px-6"
        >
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#3F3A8F] sm:text-[10px]">
              Our Hiring Process
            </span>
          </div>

          <h2 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#0B2545] sm:text-3xl lg:text-4xl">
            Simple & Transparent
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-xs font-normal leading-5 text-[#55556A] sm:text-sm sm:leading-6">
            We follow a clear process so you know what to expect at every
            stage of your journey with us.
          </p>
        </motion.div>

        {/* DESKTOP TIMELINE */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="relative hidden lg:block"
        >
          {/* LINE */}
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-5 h-px bg-[#D8D7ED]" />

          <div className="grid grid-cols-4">
            {hiringSteps.map((step) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.step}
                  variants={fadeUp}
                  className="relative px-5 text-center"
                >
                  {/* ICON */}
                  <div className="relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#D8D7ED] bg-white text-[#3F3A8F]">
                    <Icon size={17} strokeWidth={1.8} />
                  </div>

                  <span className="mt-3 block text-[9px] font-medium uppercase tracking-[0.14em] text-[#3F3A8F]">
                    Step {step.step}
                  </span>

                  <h3 className="mt-1 text-sm font-medium leading-5 text-[#0B2545]">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-1.5 max-w-[210px] text-[10px] font-normal leading-4 text-[#77778A]">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* MOBILE / TABLET TIMELINE */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="px-3 sm:px-5 lg:hidden"
        >
          <div className="relative">
            {/* VERTICAL LINE */}
            <div className="absolute bottom-5 left-[19px] top-5 w-px bg-[#D8D7ED]" />

            <div className="space-y-4">
              {hiringSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.step}
                    variants={fadeUp}
                    className="relative flex items-start gap-3"
                  >
                    {/* ICON */}
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D8D7ED] bg-white text-[#3F3A8F]">
                      <Icon size={16} strokeWidth={1.8} />
                    </div>

                    {/* CONTENT */}
                    <div className="min-w-0 pt-0.5">
                      <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#3F3A8F]">
                        Step {step.step}
                      </span>

                      <h3 className="mt-0.5 text-sm font-medium leading-5 text-[#0B2545]">
                        {step.title}
                      </h3>

                      <p className="mt-1 text-[10px] font-normal leading-4 text-[#77778A] sm:text-xs sm:leading-5">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* BOTTOM NOTE */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-6 border-t border-[#D8D7ED] px-3 pt-4 text-center sm:px-5"
        >
          <p className="text-[10px] font-normal leading-4 text-[#77778A] sm:text-xs">
            Every application is reviewed with care. We aim to keep the
            process clear, respectful, and straightforward.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HiringProcess;