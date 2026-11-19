import {
  ArrowUpRight,
  Code2,
  Megaphone,
  Palette,
  Rocket,
} from "lucide-react";
import { motion } from "motion/react";

import {
  fadeLeft,
  staggerContainer,
  capabilityReveal,
  viewport,
} from "@/lib/motion";

const capabilities = [
  {
    icon: Code2,
    title: "Build",
    text: "Digital solutions",
  },
  {
    icon: Palette,
    title: "Design",
    text: "Creative experiences",
  },
  {
    icon: Megaphone,
    title: "Grow",
    text: "Stronger brands",
  },
  {
    icon: Rocket,
    title: "Transform",
    text: "Business ideas",
  },
];

function TechnologyStrip() {
  return (
    <section className="w-full overflow-hidden border-b border-[#E5E2F2] bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
        {/* Mobile: stacked layout. Desktop: horizontal layout. */}
        <div className="flex flex-col gap-3 py-3 sm:gap-3.5 sm:py-3.5 lg:flex-row lg:items-center lg:justify-between lg:gap-5 lg:py-3 xl:gap-6 2xl:gap-8">
          {/* Left heading */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="shrink-0"
          >
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#7D73C0] sm:text-[10px]">
              What we do
            </p>

            <h3 className="mt-0.5 text-[15px] font-semibold tracking-tight text-[#0B2545] sm:text-base lg:text-base 2xl:text-lg">
              Ideas into impact
            </h3>
          </motion.div>

          {/* Capabilities */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid w-full grid-cols-2 gap-2 sm:gap-2.5 lg:flex lg:w-auto lg:items-center lg:justify-end lg:gap-1.5 xl:gap-4 2xl:gap-5"
          >
            {capabilities.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={capabilityReveal}
                  className="group flex min-w-0 items-center gap-2 rounded-lg border border-[#E5E2F2] bg-[#F1EFFA] px-2.5 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7D73C0]/30 hover:bg-[#EAE7F6] sm:gap-2.5 sm:px-3 sm:py-2 lg:min-w-0 lg:border-0 lg:bg-transparent lg:px-1.5 lg:py-1.5 xl:gap-2.5 xl:px-2 2xl:gap-3 2xl:px-3"
                >
                  {/* Icon */}
                  <motion.span
                    whileHover={{ rotate: -5, scale: 1.06 }}
                    transition={{
                      duration: 0.25,
                      ease: "easeOut",
                    }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-[#44398F] shadow-sm transition-colors duration-300 group-hover:bg-[#44398F] group-hover:text-white sm:h-8 sm:w-8 lg:h-7 lg:w-7 2xl:h-9 2xl:w-9"
                  >
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-3.5 lg:w-3.5 2xl:h-[18px] 2xl:w-[18px]" />
                  </motion.span>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <p className="whitespace-nowrap text-[13px] font-medium leading-tight text-[#0B2545] sm:text-[11px] lg:text-[11px] xl:text-[12px] 2xl:text-[13px]">
                      {item.title}
                    </p>

                    <p className="mt-0.5 whitespace-nowrap text-[11px] font-normal leading-tight text-[#6B6A7A] sm:text-[9px] lg:text-[8px] xl:text-[10px] 2xl:text-[11px]">
                      {item.text}
                    </p>
                  </div>

                  {/* Desktop arrow */}
                  <ArrowUpRight className="hidden h-3.5 w-3.5 shrink-0 text-[#B8B4C8] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#44398F] lg:block 2xl:h-4 2xl:w-4" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default TechnologyStrip;