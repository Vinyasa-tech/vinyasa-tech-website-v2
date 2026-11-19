import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  Laptop,
  PenTool,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

interface HeroSlide {
  id: number;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
  imageAlt: string;
  category: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    eyebrow: "INNOVATIVE DIGITAL SOLUTIONS",
    title: "Empower your vision",
    highlight: "with Vinyasa solutions",
    description:
      "Unlock the potential of your ideas with cutting-edge technology and innovative solutions tailored for success.",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1800&q=90",
    imageAlt: "Technology team collaborating in a modern workspace",
    category: "Technology • Innovation • Success",
  },
  {
    id: 2,
    eyebrow: "SOFTWARE DEVELOPMENT",
    title: "Technology built",
    highlight: "around your vision",
    description:
      "Tailored software solutions designed to meet your specific business needs and help you move forward.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=90",
    imageAlt: "Professionals working in a modern technology office",
    category: "Software • Solutions • Growth",
  },
  {
    id: 3,
    eyebrow: "WEB & MOBILE DEVELOPMENT",
    title: "Digital experiences",
    highlight: "made for your business",
    description:
      "Responsive web applications and mobile experiences built with modern technologies for today's digital world.",
    image:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1800&q=90",
    imageAlt: "Creative team discussing a digital project",
    category: "Web • Mobile • Digital",
  },
  {
    id: 4,
    eyebrow: "BUSINESS TRANSFORMATION",
    title: "Transform your business",
    highlight: "with technology",
    description:
      "Leverage our expertise to create seamless, scalable, and impactful solutions for your enterprise.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=90",
    imageAlt: "Business professionals collaborating on a project",
    category: "Transformation • Technology • Impact",
  },
];

const floatingServices = [
  { icon: Code2, title: "Software & Mobile Engineering" },
  { icon: Laptop, title: "Web & Digital Solutions" },
  { icon: PenTool, title: "Graphic Designing" },
  { icon: BrainCircuit, title: "AI & Machine Learning" },
  { icon: Cloud, title: "Cloud & Infrastructure" },
  { icon: Database, title: "Data Management" },
];

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = heroSlides[currentSlide];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((current) =>
        current === heroSlides.length - 1 ? 0 : current + 1,
      );
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-w-0 overflow-hidden bg-[#1E4E8C]">
      {/* Background */}
      <div className="absolute inset-0">
        {heroSlides.map((heroSlide, index) => (
          <motion.div
            key={heroSlide.id}
            initial={false}
            animate={{
              opacity: currentSlide === index ? 1 : 0,
              scale: currentSlide === index ? 1 : 1.02,
            }}
            transition={{
              opacity: {
                duration: 1.1,
                ease: "easeInOut",
              },
              scale: {
                duration: 6,
                ease: "linear",
              },
            }}
            className="absolute inset-0"
          >
            <img
              src={heroSlide.image}
              alt={heroSlide.imageAlt}
              className="h-full w-full object-cover object-center"
            />
          </motion.div>
        ))}

        {/* Purple Overlay */}
        <div className="absolute inset-0 bg-[#44398F]/90" />

        {/* Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#302A78]/25 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[340px] w-full max-w-[1500px] items-center px-4 py-0 sm:min-h-[400px] sm:px-7 md:min-h-[420px] md:px-10 lg:min-h-[380px] lg:px-10 xl:px-16 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full min-w-0"
          >
            <div className="w-full max-w-[900px] min-w-0">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.08,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mb-2 flex min-w-0 items-center gap-2"
              >
                <span className="h-px w-5 shrink-0 bg-[#D8D4F0] sm:w-7 md:w-9" />

                <p className="truncate text-[8px] font-medium uppercase tracking-[0.14em] text-[#D8D4F0] sm:text-[9px] md:text-[10px]">
                  {slide.eyebrow}
                </p>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.15,
                  duration: 0.75,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-full max-w-[700px] break-words text-[30px] font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-[38px] md:text-[46px] lg:text-[46px] xl:text-[48px]"
              >
                {slide.title}
                <br />
                <span className="text-[26px] font-semibold text-white sm:text-[33px] md:text-[40px] lg:text-[36px] xl:text-[36px]">
                  {slide.highlight}
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.25,
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-2.5 w-full max-w-[490px] text-[10px] font-normal leading-[1.55] text-white/75 sm:text-[11px] sm:leading-5 md:text-[13px] md:leading-5.5"
              >
                {slide.description}
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.35,
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-3 flex flex-wrap items-center gap-2"
              >
                {/* Primary Button */}
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/services"
                    className="group relative inline-flex h-9 items-center justify-center gap-1.5 overflow-hidden rounded-full bg-[#D8D4F0] px-3.5 text-[8px] font-medium uppercase tracking-[0.04em] !text-[#302A78] shadow-[0_8px_25px_rgba(216,212,240,0.14)] sm:h-10 sm:px-4 sm:text-[9px] md:text-[10px]"
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

                    <span className="relative z-10 text-black">
                      Explore Services
                    </span>

                    <motion.span
                      variants={{
                        rest: { x: 0 },
                        hover: { x: 3 },
                      }}
                      transition={{
                        duration: 0.35,
                        ease: "easeOut",
                      }}
                      className="relative z-10 flex items-center"
                    >
                      <ArrowUpRight className="h-3 w-3 !text-[#302A78] sm:h-3.5 sm:w-3.5" />
                    </motion.span>
                  </Link>
                </motion.div>

                {/* Secondary Button */}
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    to="/contact"
                    className="group inline-flex h-9 items-center justify-center rounded-full border border-white/35 bg-white/10 px-3.5 text-[8px] font-medium uppercase tracking-[0.04em] !text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white sm:h-10 sm:px-4 sm:text-[9px] md:text-[10px]"
                  >
                    <span className="!text-white transition-colors duration-300 group-hover:!text-[#302A78]">
                      Contact Us
                    </span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Category */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.45,
                  duration: 0.55,
                }}
                className="mt-2 text-[6px] font-medium uppercase tracking-[0.14em] text-[#D8D4F0]/65 sm:text-[7px] md:text-[8px]"
              >
                {slide.category}
              </motion.p>

              {/* Floating Services */}
              <motion.div
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.52,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-3 grid w-full grid-cols-3 gap-1 sm:flex sm:items-center sm:gap-2.5 lg:gap-2"
              >
                {floatingServices.map((service, index) => {
                  const Icon = service.icon;

                  return (
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.58 + index * 0.06,
                        duration: 0.45,
                      }}
                      whileHover={{ y: -2 }}
                      className={`flex min-w-0 items-center justify-start gap-1.5 rounded-full border border-[#D8D4F0]/20 bg-[#302A78]/55 px-2.5 py-2 backdrop-blur-md sm:gap-2 sm:px-3 sm:py-2.5 lg:px-4 ${
                        index === 0 ? "sm:flex-[1.3]" : "sm:flex-1"
                      }`}
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#D8D4F0]/10">
                        <Icon className="h-3 w-3 text-[#C9C2F4] sm:h-3.5 sm:w-3.5" />
                      </span>

                      <span className="text-[8px] font-medium leading-tight text-white sm:text-[9px] md:text-[10px] lg:text-[11px]">
                        {service.title}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default Hero;