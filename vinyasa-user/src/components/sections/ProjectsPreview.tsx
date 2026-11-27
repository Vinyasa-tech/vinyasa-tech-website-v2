
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import axios from "axios";

interface Project {
  id: number;
  title: string;
  logo: string;
  description: string;
  website: string | null;
  status?: "published" | "draft";
}
import { API_URL, API_ORIGIN } from "../../config/constants";

const PROJECTS_API_URL = `${API_URL}/projects`;

const getProjectLogoSrc = (logo: string): string => {
  if (
    logo.startsWith("http://") ||
    logo.startsWith("https://") ||
    logo.startsWith("data:") ||
    logo.startsWith("blob:")
  ) {
    return logo;
  }

  return `${API_ORIGIN}/${logo.replace(/^\/+/, "")}`;
};

function ProjectsPreview() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

  // Fetch published projects from the backend
  useEffect(() => {
    const controller = new AbortController();

    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(PROJECTS_API_URL, {
          signal: controller.signal,
        });

        const result = response.data;
        const projectList = Array.isArray(result)
          ? result
          : result?.data;

        if (!Array.isArray(projectList)) {
          throw new Error("Invalid projects response from server.");
        }

        setProjects(
          projectList.filter(
            (project: Project) =>
              project.status === undefined ||
              project.status === "published",
          ),
        );
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Failed to fetch projects:", err);
        setError("Unable to load projects. Please try again later.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => controller.abort();
  }, []);

  // Update carousel arrow states
  const updateButtons = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    setCanScrollLeft(slider.scrollLeft > 5);

    setCanScrollRight(
      slider.scrollLeft + slider.clientWidth <
        slider.scrollWidth - 5,
    );
  };

  const scrollSlider = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.scrollBy({
      left:
        direction === "right"
          ? slider.clientWidth * 0.85
          : -slider.clientWidth * 0.85,
      behavior: "smooth",
    });
  };

  // Recalculate carousel controls
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    updateButtons();

    slider.addEventListener("scroll", updateButtons);
    window.addEventListener("resize", updateButtons);

    return () => {
      slider.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [projects]);

  // Autoplay
  useEffect(() => {
    if (loading || error || projects.length < 2) return;

    const interval = window.setInterval(() => {
      if (isCardHovered) return;

      const slider = sliderRef.current;
      if (!slider) return;

      if (
        slider.scrollLeft + slider.clientWidth >=
        slider.scrollWidth - 5
      ) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({
          left: slider.clientWidth * 0.85,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => window.clearInterval(interval);
  }, [isCardHovered, loading, error, projects.length]);

  return (
    <section
      id="projects"
      className="scroll-mt-20 bg-white py-7 sm:py-7 md:py-9 lg:py-10"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
        {/* Header */}
        <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5 md:mb-6">
          <div className="min-w-0">
            <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-[#3F3A8F] sm:text-[9px] md:text-[10px]">
              Trusted by Our Clients
            </p>

            <h2 className="mt-1 whitespace-nowrap text-[18px] font-semibold leading-tight tracking-[-0.04em] text-[#0B2545] sm:text-3xl md:text-4xl lg:text-[36px]">
              Building Success Through
              <span className="text-[#6668B8]">
                {" "}Technology &amp; Design
              </span>
            </h2>
          </div>

          {/* Desktop controls */}
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollSlider("left")}
              disabled={!canScrollLeft}
              aria-label="Previous projects"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8D7ED] text-[#55556A] transition-all duration-300 hover:border-[#3F3A8F] hover:bg-[#3F3A8F] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft size={14} />
            </button>

            <button
              type="button"
              onClick={() => scrollSlider("right")}
              disabled={!canScrollRight}
              aria-label="Next projects"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8D7ED] text-[#55556A] transition-all duration-300 hover:border-[#3F3A8F] hover:bg-[#3F3A8F] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Loading and error states */}
        {loading && (
          <p className="py-10 text-center text-sm text-[#77778A]">
            Loading projects...
          </p>
        )}

        {!loading && error && (
          <p
            role="alert"
            className="py-10 text-center text-sm text-red-600"
          >
            {error}
          </p>
        )}

        {!loading && !error && projects.length === 0 && (
          <p className="py-10 text-center text-sm text-[#77778A]">
            No published projects available yet.
          </p>
        )}

        {/* Project carousel */}
        {!loading && !error && projects.length > 0 && (
          <>
            <div
              ref={sliderRef}
              className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-3 md:gap-4 xl:gap-5 2xl:gap-6 min-[2400px]:gap-7"
            >
              {projects.map((project) => (
                <article
                  key={project.id}
                  onMouseEnter={() => setIsCardHovered(true)}
                  onMouseLeave={() => setIsCardHovered(false)}
                  className="group w-[45%] shrink-0 snap-start rounded-xl border border-[#D8D7ED] bg-white p-2 transition-all duration-300 hover:border-[#8C8BD1] hover:shadow-lg hover:shadow-[#3F3A8F]/10 sm:w-[36%] sm:rounded-2xl sm:p-3 md:w-[28%] md:p-2.5 lg:w-[17%]"
                >
                  {/* Project logo */}
                  {project.website ? (
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${project.title} website`}
                      className="block"
                    >
                      <div className="flex h-20 items-center justify-center overflow-hidden rounded-lg bg-white sm:h-24 md:h-28 lg:h-30">
                        <img
                          src={getProjectLogoSrc(project.logo)}
                          alt={`${project.title} logo`}
                          loading="lazy"
                          className="h-20 w-20 object-contain transition-transform duration-300 group-hover:scale-110 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-28 lg:w-28"
                        />
                      </div>
                    </a>
                  ) : (
                    <div className="flex h-20 items-center justify-center overflow-hidden rounded-lg bg-white sm:h-24 md:h-28 lg:h-30">
                      <img
                        src={getProjectLogoSrc(project.logo)}
                        alt={`${project.title} logo`}
                        loading="lazy"
                        className="h-20 w-20 object-contain transition-transform duration-300 group-hover:scale-110 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-28 lg:w-28"
                      />
                    </div>
                  )}

                  {/* Project information */}
                  <div className="mt-0.5 min-h-[32px] text-center sm:mt-1.5">
                    <h3 className="text-xs font-medium text-[#0B2545] transition-colors duration-300 group-hover:text-[#6668B8] sm:text-sm md:text-base">
                      {project.title}
                    </h3>

                    <p className="mt-0.5 text-[9px] font-normal leading-3.5 text-[#77778A] sm:text-[10px] sm:leading-4">
                      {project.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Mobile controls */}
            <div className="mt-2.5 flex items-center justify-center sm:hidden">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollSlider("left")}
                  disabled={!canScrollLeft}
                  aria-label="Previous projects"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D8D7ED] text-[#55556A] transition-all duration-300 hover:border-[#3F3A8F] hover:bg-[#3F3A8F] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowLeft size={12} />
                </button>

                <button
                  type="button"
                  onClick={() => scrollSlider("right")}
                  disabled={!canScrollRight}
                  aria-label="Next projects"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D8D7ED] text-[#55556A] transition-all duration-300 hover:border-[#3F3A8F] hover:bg-[#3F3A8F] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default ProjectsPreview;
