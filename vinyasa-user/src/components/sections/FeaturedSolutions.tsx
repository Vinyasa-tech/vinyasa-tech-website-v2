import {
  ArrowUpRight,
  BrainCircuit,
  Cloud,
  Database,
  Code2,
  Laptop,
  Megaphone,
  PenTool,
  ChartNoAxesCombined,
  type LucideIcon,
} from "lucide-react";

import { Link } from "react-router-dom";
import { motion } from "motion/react";

import { viewport } from "@/lib/motion";
import { services } from "@/data/services";

interface Solution {
  title: string;
  slug: string;
  description: string;
  image: string;
  icon: LucideIcon;
}

const solutionImages: Record<string, string> = {
  "ai-machine-learning":
    "https://images.unsplash.com/photo-1677442135136-760c813028c0?auto=format&fit=crop&w=1000&q=85",
  "software-mobile-engineering":
    "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=1000&q=85",
  "web-digital-solutions":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=85",
  "cloud-infrastructure":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85",
  "data-management":
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85",
  "graphic-designing":
    "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1000&q=85",
  "digital-marketing":
    "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1000&q=85",
  "data-and-analysis":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85",
};

const solutionIcons = {
  "ai-machine-learning": BrainCircuit,
  "software-mobile-engineering": Code2,
  "web-digital-solutions": Laptop,
  "cloud-infrastructure": Cloud,
  "data-management": Database,
  "graphic-designing": PenTool,
  "digital-marketing": Megaphone,
  "data-and-analysis": ChartNoAxesCombined,
};

const solutions: Solution[] = services.map((service) => ({
  title: service.title,
  slug: service.slug,
  description: service.shortDescription,
  image:
    solutionImages[service.slug] ??
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85",
  icon:
    solutionIcons[service.slug as keyof typeof solutionIcons] ??
    Code2,
}));

function FeaturedSolutions() {
  return (
    <section className="relative w-full overflow-hidden bg-[#080D24] py-4 sm:py-5 lg:py-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-32 top-10 h-56 w-56 rounded-full bg-[#5148C8]/15 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-56 w-56 rounded-full bg-[#6366F1]/10 blur-[100px]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5 }}
          className="mb-4 flex flex-col justify-between gap-2 sm:mb-5 sm:flex-row sm:items-end"
        >
          <div>
            <span className="mb-1.5 inline-flex items-center text-[9px] font-semibold uppercase tracking-[0.18em] text-[#B8B2FF] sm:text-[10px]">
              Featured Services
            </span>

            <h2 className="text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl lg:text-[30px]">
              Solutions that turn{" "}
              <span className="bg-gradient-to-r from-[#AAA5FF] to-[#D1CEFF] bg-clip-text text-transparent">
                ideas into results
              </span>
            </h2>
          </div>

          <Link
            to="/services"
            className="group inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold text-[#B8B2FF] transition-colors hover:text-white sm:text-xs"
          >
            Explore all services
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>

        {/* Compact split layout */}
        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 lg:grid-cols-[0.8fr_1.5fr] lg:gap-4 xl:gap-5 2xl:gap-7 min-[2400px]:gap-8">
          {/* Featured image panel */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5 }}
            className="group relative min-h-[130px] overflow-hidden rounded-xl border border-white/10 sm:min-h-[160px] lg:min-h-[300px]"
          >
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85"
              alt="Technology and software development workspace"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#080D24] via-[#080D24]/55 to-[#080D24]/10" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#5148C8]/20 via-transparent to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#C3BEFF]">
                Ideas + Technology =
              </span>

              <h3 className="mt-1.5 text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl">
                Real Results
              </h3>

              <div className="mt-2.5 h-0.5 w-9 rounded-full bg-gradient-to-r from-[#8D86FF] to-[#C4C0FF]" />

              <p className="mt-2.5 max-w-sm text-[11px] leading-5 text-slate-300 sm:text-xs">
                Innovative digital solutions designed to simplify
                processes, solve challenges and move your business forward.
              </p>
            </div>
          </motion.div>

          {/* Service cards: 2 columns on mobile */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:gap-2.5 xl:gap-3 2xl:gap-4">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;

              return (
                <motion.div
                  key={solution.slug}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewport}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.04, 0.2),
                  }}
                  className="group min-w-0"
                >
                  <Link
                    to={`/services/${solution.slug}`}
                    className="flex h-full min-h-[72px] items-start gap-2.5 rounded-lg border border-[#7770D8]/25 bg-white/[0.025] p-2.5 transition-colors duration-300 hover:border-[#8D86FF]/60 hover:bg-[#5148C8]/10 sm:min-h-[82px] sm:gap-3 sm:p-3"
                  >
                    {/* Icon */}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#8D86FF]/20 bg-gradient-to-br from-[#5148C8] to-[#302B79] text-[#D1CEFF] transition-colors duration-300 group-hover:border-[#AAA5FF]/50 group-hover:text-white sm:h-9 sm:w-9">
                      <Icon size={17} strokeWidth={1.7} />
                    </span>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[11px] font-semibold leading-4 text-white transition-colors group-hover:text-[#C5C0FF] sm:text-xs">
                        {solution.title}
                      </h3>

                      <p className="mt-1 hidden line-clamp-2 text-[10px] leading-4 text-slate-400 sm:block">
                        {solution.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-colors duration-300 group-hover:border-[#8D86FF]/50 group-hover:bg-[#5148C8]/30 group-hover:text-white">
                      <ArrowUpRight
                        size={12}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedSolutions;