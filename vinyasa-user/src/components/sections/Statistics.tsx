import { useEffect, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  Layers3,
  Rocket,
} from "lucide-react";
import { motion } from "motion/react";

import {
  statisticsReveal,
  statisticsStagger,
  statisticsIcon,
  statisticsNumber,
  viewport,
} from "@/lib/motion";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  description: string;
  icon: React.ElementType;
  static?: boolean;
}

const stats: Stat[] = [
  {
    value: 2016,
    suffix: "",
    label: "Established",
    description: "Where our journey began",
    icon: CalendarDays,
    static: true,
  },
  {
    value: 6,
    suffix: "+",
    label: "Services",
    description: "Solutions under one roof",
    icon: Layers3,
  },
  {
    value: 10,
    suffix: "+",
    label: "Years of Expertise",
    description: "Experience that delivers",
    icon: BriefcaseBusiness,
  },
  {
    value: 100,
    suffix: "+",
    label: "Projects Delivered",
    description: "Ideas transformed into results",
    icon: Rocket,
  },
];

function Statistics() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0B2545] py-3 sm:py-3 md:py-4 lg:py-5">
      {/* Background Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={viewport}
        transition={{
          duration: 1.2,
          ease: "easeOut",
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[180px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7779C6]/[0.07] blur-[80px] sm:h-[300px] sm:w-[400px]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 lg:px-8">
        {/* Header */}
        <motion.div
          className="mx-auto mb-3 max-w-2xl text-center sm:mb-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
        >
          <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-[#8C8BD1] sm:text-[9px]">
            Our Journey
          </span>

          <h2 className="mt-1 text-lg font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-2xl md:text-3xl lg:text-[34px]">
            Built on{" "}
            <span className="text-[#8C8BD1]">experience</span>
          </h2>

          <p className="mx-auto mt-1.5 max-w-xl text-[9px] font-normal leading-4 text-[#D8D7ED]/65 sm:text-[10px] sm:leading-5">
            Years of expertise, diverse services and solutions built to create
            lasting value.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="relative"
          variants={statisticsStagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {/* Desktop Connecting Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={viewport}
            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
            className="absolute left-[12.5%] right-[12.5%] top-[22px] hidden h-px origin-center bg-gradient-to-r from-transparent via-[#7779C6]/45 to-transparent lg:block"
          />

          {/* Mobile Connecting Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={viewport}
            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
            className="absolute left-[5%] right-[5%] top-[20px] h-px origin-center bg-gradient-to-r from-transparent via-[#7779C6]/40 to-transparent lg:hidden"
          />

          {/* Statistics Row */}
          <div className="grid grid-cols-4 gap-1 sm:gap-3 lg:gap-0">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  variants={statisticsReveal}
                  whileHover={{
                    y: -3,
                    transition: {
                      duration: 0.3,
                      ease: "easeOut",
                    },
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="group relative min-w-0 px-1 sm:px-2 lg:px-5"
                >
                  {/* Icon */}
                  <motion.div
                    variants={statisticsIcon}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    className="relative mx-auto flex h-7 w-7 items-center justify-center rounded-full border border-[#8C8BD1]/30 bg-[#0B2545] text-[#8C8BD1] sm:h-8 sm:w-8 lg:h-9 lg:w-9"
                  >
                    <Icon
                      size={13}
                      strokeWidth={1.7}
                      className="sm:h-4 sm:w-4"
                    />

                    <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#8C8BD1]/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                  </motion.div>

                  {/* Content */}
                  <div className="mt-2 text-center sm:mt-2 lg:mt-3">
                    {/* Number */}
                    <motion.div
                      variants={statisticsNumber}
                      className="flex items-baseline justify-center"
                    >
                      {stat.static ? (
                        <span className="text-lg font-semibold tracking-[-0.05em] text-white sm:text-2xl md:text-3xl lg:text-[36px]">
                          {stat.value}
                        </span>
                      ) : (
                        <CountUpNumber
                          end={stat.value}
                          duration={1500}
                        />
                      )}

                      {stat.suffix && (
                        <span className="ml-0.5 text-base font-semibold text-[#8C8BD1] sm:text-xl lg:text-2xl">
                          {stat.suffix}
                        </span>
                      )}
                    </motion.div>

                    {/* Label */}
                    <p className="mt-0.5 truncate text-[7px] font-medium uppercase tracking-[0.08em] text-white sm:text-[9px] sm:tracking-[0.12em] lg:text-[10px]">
                      {stat.label}
                    </p>

                    {/* Description */}
                    <p className="mx-auto mt-0.5 hidden max-w-[170px] text-[8px] font-normal leading-4 text-[#D8D7ED]/50 sm:block sm:text-[9px] lg:text-[10px]">
                      {stat.description}
                    </p>
                  </div>

                  {/* Active Point */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={viewport}
                    transition={{
                      duration: 0.35,
                      delay: 0.2,
                      ease: "easeOut",
                    }}
                    className="absolute left-1/2 top-[16px] z-20 h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-[#8C8BD1] shadow-[0_0_10px_rgba(140,139,209,0.55)] sm:top-[17px] lg:top-[18px]"
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom Message */}
        <motion.div
          className="mt-3 border-t border-white/10 pt-2.5 text-center sm:mt-4 sm:pt-3"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{
            duration: 0.6,
            delay: 0.15,
            ease: "easeOut",
          }}
        >
          <p className="text-[8px] font-normal tracking-wide text-[#D8D7ED]/55 sm:text-[9px]">
            Built with experience
            <span className="mx-1.5 text-[#7779C6]">•</span>
            Driven by results
            <span className="mx-1.5 text-[#7779C6]">•</span>
            Focused on the future
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* Count Up Number */
interface CountUpNumberProps {
  end: number;
  duration?: number;
}

function CountUpNumber({
  end,
  duration = 1500,
}: CountUpNumberProps) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.4,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (time: number) => {
      if (startTime === null) {
        startTime = time;
      }

      const progress = Math.min(
        (time - startTime) / duration,
        1,
      );

      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(
        easedProgress * end,
      );

      setCount(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [started, end, duration]);

  return (
    <motion.span
      ref={ref}
      variants={statisticsNumber}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="text-xl font-semibold tracking-[-0.05em] text-white sm:text-3xl md:text-4xl lg:text-[42px]"
    >
      {count}
    </motion.span>
  );
}

export default Statistics;