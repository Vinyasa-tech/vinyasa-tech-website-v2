import { motion } from "motion/react";

import { fadeUp, viewport } from "@/lib/motion";

const journeyItems = [
  {
    title: "Learn",
    description: "Discover new skills through real work.",
  },
  {
    title: "Create",
    description: "Turn ideas into meaningful solutions.",
  },
  {
    title: "Contribute",
    description: "Make an impact with your strengths.",
  },
  {
    title: "Grow",
    description: "Take on new challenges and opportunities.",
  },
];

const CareerJourney = () => {
  return (
    <section className="w-full overflow-hidden bg-[#EEF0FA]">
      <div className="mx-auto w-full max-w-7xl px-3 py-7 sm:px-5 sm:py-9 lg:px-6 lg:py-9 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="flex flex-col gap-2 text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#3F3A8F] sm:text-[10px]">
              Your Growth
            </span>
          </div>

          <h2 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#0B2545] sm:text-3xl lg:text-4xl">
            Keep Growing with Vinyasa
          </h2>

          <p className="mx-auto max-w-xl text-xs font-normal leading-5 text-[#55556A] sm:text-sm sm:leading-6">
            Build your skills, explore new ideas, and grow through the work
            you do with your team.
          </p>
        </motion.div>

        {/* GROWTH ITEMS */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mx-auto mt-6 max-w-5xl border-y border-[#D8D7ED] 2xl:max-w-[1400px] min-[2400px]:max-w-[1600px]"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {journeyItems.map((item, index) => (
              <div
                key={item.title}
                className={`group px-3 py-4 sm:px-5 sm:py-5 ${
                  index % 2 !== 0
                    ? "border-l border-[#D8D7ED]"
                    : ""
                } ${
                  index >= 2
                    ? "border-t border-[#D8D7ED] lg:border-t-0"
                    : ""
                } ${
                  index > 0
                    ? "lg:border-l lg:border-[#D8D7ED]"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-medium leading-5 text-[#0B2545] sm:text-lg">
                    {item.title}
                  </h3>
                </div>

                <p className="mt-1.5 text-[10.5px] font-normal leading-4 text-[#77778A] sm:text-xs sm:leading-5">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* SIMPLE CLOSING LINE */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mx-auto mt-5 max-w-2xl text-center text-[10px] font-normal leading-4 text-[#77778A] sm:text-xs sm:leading-5"
        >
          Your career can evolve with your interests, skills, and the
          opportunities you choose to take on.
        </motion.p>
      </div>
    </section>
  );
};

export default CareerJourney;