import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
} from "lucide-react";
import { motion } from "motion/react";
import axios from "axios";

import { fadeUp, viewport } from "@/lib/motion";
import defaultUserImage from "@/assets/images/user.png";

interface ApiSuccessStory {
  id: number;
  name: string;
  program: string | null;
  year: number | string | null;
  role: string | null;
  company: string | null;
  title: string | null;
  story: string;
  image_url: string | null;
  status: "published" | "draft";
  created_at?: string;
}

interface SuccessStory {
  id: number;
  name: string;
  image: string;
  program: string;
  year: string;
  internshipRole: string;
  currentRole: string;
  currentCompany: string;
  testimonial: string;
}

import { API_URL, API_ORIGIN } from "../../config/constants";


const SUCCESS_STORIES_API_URL =
  `${API_URL}/success-stories/published`;

const getImageUrl = (imagePath: string | null): string => {
  if (!imagePath) return defaultUserImage;

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }

  const normalizedPath = imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath}`;

  try {
    return new URL(normalizedPath, API_ORIGIN).toString();
  } catch {
    return defaultUserImage;
  }
};

const SuccessStories = () => {
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  // Fetch published success stories
  useEffect(() => {
    const controller = new AbortController();

    const loadStories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(SUCCESS_STORIES_API_URL, {
          signal: controller.signal,
        });

        const result = response.data;

        const rows: ApiSuccessStory[] = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        const publishedStories = rows
          .filter((story) => story.status === "published")
          .map((story) => ({
            id: story.id,
            name: story.name,
            image: getImageUrl(story.image_url),

            // Dynamic values from Admin Panel
            program: story.program?.trim() || "",
            year: story.year ? String(story.year) : "",

            internshipRole: story.role || "",
            currentRole: story.title || "",
            currentCompany: story.company || "",
            testimonial: story.story || "",
          }));

        setSuccessStories(publishedStories);
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Failed to load success stories:", err);
        setError("Unable to load success stories. Please try again later.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadStories();

    return () => controller.abort();
  }, []);

  // Responsive carousel
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;

      if (width >= 2400) {
        setItemsPerView(5);
      } else if (width >= 1536) {
        setItemsPerView(4);
      } else if (width >= 1024) {
        setItemsPerView(3);
      } else if (width >= 640) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    updateItemsPerView();

    window.addEventListener("resize", updateItemsPerView);

    return () => {
      window.removeEventListener("resize", updateItemsPerView);
    };
  }, []);

  const maxIndex = Math.max(
    0,
    successStories.length - itemsPerView
  );

  // Keep carousel index within valid range
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  // Autoplay
  useEffect(() => {
    if (successStories.length <= itemsPerView) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) =>
        prev >= maxIndex ? 0 : prev + 1
      );
    }, 5000);

    return () => window.clearInterval(interval);
  }, [itemsPerView, maxIndex, successStories.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev <= 0 ? maxIndex : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev >= maxIndex ? 0 : prev + 1
    );
  };

  return (
    <section className="w-full overflow-hidden bg-[#EEF0FA]">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">

        {/* Section Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-4 flex items-end justify-between gap-3"
        >
          <div className="max-w-xl">
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3F3A8F]">
              Success Stories
            </span>

            <h2 className="mt-1 text-xl font-semibold leading-tight tracking-tight text-[#0B2545] sm:text-2xl">
              Learning that leads{" "}
              <span className="text-[#3F3A8F]">
                to opportunity
              </span>
            </h2>

            <p className="mt-1 text-[11px] leading-4 text-[#666579] sm:text-xs">
              Real experiences. Real growth. Inspiring career journeys.
            </p>
          </div>

          {/* Navigation Buttons */}
          {!loading &&
            !error &&
            successStories.length > itemsPerView && (
              <div className="flex shrink-0 items-center gap-1.5 pb-0.5">
                <button
                  type="button"
                  onClick={handlePrevious}
                  aria-label="Previous success story"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D5D3E9] bg-white text-[#3F3A8F] transition-all hover:border-[#3F3A8F] hover:bg-[#3F3A8F] hover:text-white"
                >
                  <ArrowLeft size={13} />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next success story"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D5D3E9] bg-white text-[#3F3A8F] transition-all hover:border-[#3F3A8F] hover:bg-[#3F3A8F] hover:text-white"
                >
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
        </motion.div>

        {/* Loading */}
        {loading && (
          <p className="py-8 text-center text-xs text-[#666579]">
            Loading success stories...
          </p>
        )}

        {/* Error */}
        {!loading && error && (
          <p
            role="alert"
            className="py-8 text-center text-xs text-red-600"
          >
            {error}
          </p>
        )}

        {/* Empty State */}
        {!loading && !error && successStories.length === 0 && (
          <p className="py-8 text-center text-xs text-[#666579]">
            No published success stories available yet.
          </p>
        )}

        {/* Carousel */}
        {!loading && !error && successStories.length > 0 && (
          <>
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                style={{
                  width: `${(successStories.length / itemsPerView) * 100}%`,
                }}
                animate={{
                  x: `${-(currentIndex / successStories.length) * 100}%`,
                }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {successStories.map((story) => (
                  <div
                    key={story.id}
                    style={{
                      flex: `0 0 ${100 / successStories.length}%`,
                    }}
                    className="px-1.5"
                  >
                    <motion.article
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={viewport}
                      className="group flex h-full min-h-[205px] flex-col overflow-hidden rounded-xl border border-[#DDDCEA] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8986C8] hover:shadow-[0_7px_20px_rgba(63,58,143,0.09)]"
                    >
                      {/* Program and Year */}
                      <div className="flex items-center justify-between gap-2 border-b border-[#EFEEF5] px-3 py-2">
                        {story.program ? (
                          <span className="max-w-[80%] truncate rounded-full bg-[#F0EFF9] px-2.5 py-1 text-[8px] font-semibold tracking-wide text-[#3F3A8F]">
                            {story.program}
                          </span>
                        ) : (
                          <span />
                        )}

                        {story.year && (
                          <span className="shrink-0 text-[9px] font-medium text-[#88879A]">
                            {story.year}
                          </span>
                        )}
                      </div>

                      {/* Profile */}
                      <div className="mx-3 mt-3 flex h-20 shrink-0 items-center gap-2.5">
                        <div className="relative shrink-0">
                          <img
                            src={story.image}
                            alt={`${story.name} profile`}
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.src = defaultUserImage;
                            }}
                            className="h-20 w-20 rounded-full border-2 border-[#E5E3F2] object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-[13px] font-semibold text-[#0B2545]">
                            {story.name}
                          </h3>

                          {story.internshipRole && (
                            <p className="mt-0.5 truncate text-[10px] text-[#77778A]">
                              {story.internshipRole}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Testimonial */}
                      <div className="flex-1 px-3 pb-3 pt-3">
                        <div className="mb-2 h-[2px] w-7 rounded-full bg-[#8C8BD1]" />

                        <p className="text-[11px] leading-[1.55] text-[#55556A]">
                          "{story.testimonial}"
                        </p>
                      </div>

                      {/* Career Details */}
                      {(story.currentRole || story.currentCompany) && (
                        <div className="border-t border-[#EFEEF5] bg-[#FAFAFD] px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EFEEF9] text-[#3F3A8F]">
                              <BriefcaseBusiness size={12} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#7779B9]">
                                Career After Vinyasa
                              </p>

                              {story.currentRole && (
                                <p className="mt-0.5 truncate text-[11px] font-semibold text-[#0B2545]">
                                  {story.currentRole}
                                </p>
                              )}

                              {story.currentCompany && (
                                <p className="truncate text-[10px] text-[#77778A]">
                                  {story.currentCompany}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bottom Accent */}
                      <div className="h-[2px] w-full bg-[#EFEEF9]">
                        <div className="h-full w-0 bg-[#3F3A8F] transition-all duration-300 group-hover:w-full" />
                      </div>
                    </motion.article>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Carousel Indicators */}
            {successStories.length > itemsPerView && (
              <div className="mt-3 flex items-center justify-center gap-1.5">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? "w-5 bg-[#3F3A8F]"
                        : "w-1.5 bg-[#BDBCD5] hover:bg-[#8986C8]"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SuccessStories;