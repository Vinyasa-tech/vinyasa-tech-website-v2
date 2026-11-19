
import { useEffect, useState } from "react";

import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";

import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import { services } from "@/data/services";

const navigation = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  {
    name: "Services",
    path: "/services",
    dropdown: true,
  },
  { name: "Projects", path: "" },
  { name: "Careers", path: "/careers" },
  { name: "Mentorship", path: "/mentorship" },
  { name: "Contact", path: "/contact" },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  /* =====================================================
     SCROLL STATE
  ===================================================== */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =====================================================
     CLOSE MENUS
  ===================================================== */

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    setDesktopServicesOpen(false);
  };

  /* =====================================================
     PROJECTS SCROLL
  ===================================================== */

  const scrollToProjects = () => {
    const goToProjects = () => {
      const projectsSection = document.getElementById("projects");

      if (projectsSection) {
        projectsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      window.history.replaceState(null, "", "/");
    };

    if (location.pathname === "/") {
      closeMenu();

      window.setTimeout(() => {
        goToProjects();
      }, 450);

      return;
    }

    closeMenu();
    navigate("/");

    window.setTimeout(() => {
      goToProjects();
    }, 550);
  };

  return (
    <>
      {/* PRESERVE NAVBAR SPACE WHEN FIXED */}
      {isScrolled && (
        <div
          aria-hidden="true"
          className="h-[67px] w-full sm:h-[71px] 2xl:h-[81px] min-[2400px]:h-[91px]"
        />
      )}

      <motion.header
        initial={false}
        animate={{
          y: isScrolled ? [-100, 0] : 0,
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`z-50 w-full bg-[#3D358B] ${
          isScrolled
            ? "fixed left-0 top-0 shadow-lg shadow-[#302A78]/25"
            : "relative shadow-md shadow-[#302A78]/15"
        }`}
      >
        {/* TOP ACCENT */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#3D358B] via-[#D8D4F0] to-[#3D358B]" />

        <motion.div
          initial={{
            opacity: 0,
            y: -8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14"
        >
          <div className="flex h-16 items-center justify-between sm:h-[68px] 2xl:h-[78px] min-[2400px]:h-[88px]">

            {/* LOGO */}
            <Link
              to="/"
              onClick={closeMenu}
              className="flex min-w-0 shrink-0 items-center"
            >
              <motion.img
                src="/images/vinyasa-logo.png"
                alt="VINYASA - Expect the unexpected"
                whileHover={{
                  scale: 1.015,
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="h-11 w-auto max-w-[175px] object-contain sm:h-14 sm:max-w-[190px] lg:h-[60px] 2xl:h-[68px] 2xl:max-w-[220px] min-[2400px]:h-[76px] min-[2400px]:max-w-[250px]"
              />
            </Link>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden items-center gap-6 lg:flex xl:gap-8 2xl:gap-10 min-[2400px]:gap-12">
              {navigation.map((item) => {

                /* SERVICES */
                if (item.dropdown) {
                  return (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={() => setDesktopServicesOpen(true)}
                      onMouseLeave={() => setDesktopServicesOpen(false)}
                    >
                      <NavLink
                        to="/services"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileServicesOpen(false);
                          setDesktopServicesOpen(false);
                        }}
                        className={({ isActive }) =>
                          `group relative flex items-center gap-1 py-2 text-[13px] font-semibold tracking-tight transition-colors duration-300 2xl:gap-1.5 2xl:text-[14px] min-[2400px]:gap-2 min-[2400px]:text-[15px] ${
                            isActive
                              ? "!text-[#D8D4F0]"
                              : "!text-white hover:!text-[#D8D4F0]"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span className="!text-inherit">
                              Services
                            </span>

                            <ChevronDown
                              className={`h-3.5 w-3.5 !text-inherit transition-transform duration-500 2xl:h-4 2xl:w-4 min-[2400px]:h-[18px] min-[2400px]:w-[18px] ${
                                desktopServicesOpen ? "rotate-180" : ""
                              }`}
                            />

                            <span
                              className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-[#D8D4F0] transition-all duration-500 ease-out ${
                                isActive || desktopServicesOpen
                                  ? "w-full"
                                  : "w-0 group-hover:w-full"
                              }`}
                            />
                          </>
                        )}
                      </NavLink>

                      {/* DESKTOP SERVICES DROPDOWN */}
                      <div
                        className={`absolute left-1/2 top-full z-50 w-[330px] -translate-x-1/2 pt-2 transition-all duration-300 ease-out 2xl:w-[380px] 2xl:pt-3 min-[2400px]:w-[430px] min-[2400px]:pt-4 ${
                          desktopServicesOpen
                            ? "visible opacity-100"
                            : "invisible opacity-0"
                        }`}
                      >
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: 5,
                          }}
                          animate={{
                            opacity: desktopServicesOpen ? 1 : 0,
                            y: desktopServicesOpen ? 0 : 5,
                          }}
                          transition={{
                            duration: 0.25,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden rounded-xl border border-[#E3DFF2] bg-[#F7F6FC] p-2 shadow-xl shadow-[#302A78]/15 2xl:rounded-2xl 2xl:p-3 min-[2400px]:rounded-2xl min-[2400px]:p-4"
                        >
                          {/* HEADER */}
                          <div className="px-3 py-2 2xl:px-4 2xl:py-3 min-[2400px]:px-5 min-[2400px]:py-4">
                            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#6C5CE7] 2xl:text-[10px] min-[2400px]:text-[11px]">
                              What We Do
                            </p>

                            <p className="mt-0.5 text-xs font-semibold tracking-tight text-[#302A78] 2xl:mt-1 2xl:text-sm min-[2400px]:text-base">
                              Technology meets creativity
                            </p>
                          </div>

                          {/* SERVICES LIST */}
                          <div className="border-t border-[#E3DFF2] pt-1">
                            <div className="max-h-[210px] overflow-y-auto pr-1 [scrollbar-color:#A9A2C5_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#A9A2C5] [&::-webkit-scrollbar-track]:bg-transparent 2xl:max-h-[270px] min-[2400px]:max-h-[320px]">
                              {services.map((service) => {
                                const Icon = service.icon;

                                return (
                                  <Link
                                    key={service.slug}
                                    to={`/services/${service.slug}`}
                                    onClick={() => setDesktopServicesOpen(false)}
                                    className="group/service flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-[#EAE7F7] 2xl:gap-4 2xl:px-4 2xl:py-2.5 min-[2400px]:gap-5 min-[2400px]:px-5 min-[2400px]:py-3"
                                  >
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#EAE7F7] text-[#6C5CE7] transition-colors duration-200 group-hover/service:bg-[#DCD7F0] group-hover/service:text-[#302A78] 2xl:h-9 2xl:w-9 2xl:rounded-lg min-[2400px]:h-10 min-[2400px]:w-10">
                                      <Icon
                                        size={13}
                                        className="2xl:!h-4 2xl:!w-4 min-[2400px]:!h-[18px] min-[2400px]:!w-[18px]"
                                      />
                                    </span>

                                    <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-[#302A78] transition-colors duration-200 group-hover/service:text-[#6C5CE7] 2xl:text-[13px] min-[2400px]:text-[14px]">
                                      {service.title}
                                    </span>

                                    <ArrowRight
                                      size={12}
                                      className="shrink-0 text-[#A9A2C5] transition-colors duration-200 group-hover/service:text-[#6C5CE7] 2xl:!h-4 2xl:!w-4 min-[2400px]:!h-[18px] min-[2400px]:!w-[18px]"
                                    />
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  );
                }

                /* PROJECTS */
                if (item.name === "Projects") {
                  return (
                    <NavLink
                      key={item.name}
                      to="/"
                      onClick={(event) => {
                        event.preventDefault();
                        scrollToProjects();
                      }}
                      className="group relative py-2 text-[13px] font-semibold tracking-tight !text-white transition-colors duration-300 hover:!text-[#D8D4F0] 2xl:text-[14px] min-[2400px]:text-[15px]"
                    >
                      <span className="!text-inherit">
                        Projects
                      </span>

                      <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-[#D8D4F0] transition-all duration-500 ease-out group-hover:w-full" />
                    </NavLink>
                  );
                }

                /* NORMAL ITEMS */
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `group relative py-2 text-[13px] font-semibold tracking-tight transition-colors duration-300 2xl:text-[14px] min-[2400px]:text-[15px] ${
                        isActive
                          ? "!text-[#D8D4F0]"
                          : "!text-white hover:!text-[#D8D4F0]"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="!text-inherit">
                          {item.name}
                        </span>

                        <span
                          className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-[#D8D4F0] transition-all duration-500 ease-out ${
                            isActive
                              ? "w-full"
                              : "w-0 group-hover:w-full"
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* DESKTOP CTA */}
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
              }}
              className="hidden lg:block"
            >
              <Link
                to="/contact"
                className="group flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[11px] font-bold !text-[#3D358B] shadow-sm transition-all duration-400 hover:bg-[#D8D4F0] hover:shadow-lg 2xl:gap-2.5 2xl:rounded-xl 2xl:px-5 2xl:py-3 2xl:text-xs min-[2400px]:gap-3 min-[2400px]:px-6 min-[2400px]:py-3.5 min-[2400px]:text-sm"
              >
                <span className="!text-[#3D358B]">
                  Get Started
                </span>

                <motion.span
                  whileHover={{ x: 3 }}
                  transition={{
                    duration: 0.35,
                    ease: "easeOut",
                  }}
                >
                  <ArrowRight className="h-3.5 w-3.5 !text-[#3D358B] 2xl:h-4 2xl:w-4 min-[2400px]:h-[18px] min-[2400px]:w-[18px]" />
                </motion.span>
              </Link>
            </motion.div>

            {/* MOBILE MENU BUTTON */}
            <motion.button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={
                mobileMenuOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
              aria-expanded={mobileMenuOpen}
              whileTap={{ scale: 0.9 }}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/20 transition-all duration-300 hover:border-[#D8D4F0] hover:bg-white/10 lg:hidden"
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <motion.span
                  className="absolute h-[2px] w-5 rounded-full bg-white"
                  animate={
                    mobileMenuOpen
                      ? { rotate: 45, y: 0 }
                      : { rotate: 0, y: -6 }
                  }
                  transition={{
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />

                <motion.span
                  className="absolute h-[2px] w-5 rounded-full bg-white"
                  animate={
                    mobileMenuOpen
                      ? { opacity: 0, scaleX: 0 }
                      : { opacity: 1, scaleX: 1 }
                  }
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                />

                <motion.span
                  className="absolute h-[2px] w-5 rounded-full bg-white"
                  animate={
                    mobileMenuOpen
                      ? { rotate: -45, y: 0 }
                      : { rotate: 0, y: 6 }
                  }
                  transition={{
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </span>
            </motion.button>
          </div>

          {/* MOBILE MENU */}
          <AnimatePresence initial={false}>
            {mobileMenuOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute left-0 right-0 top-full z-50 overflow-hidden border-t border-white/10 bg-[#302A78] shadow-xl shadow-[#302A78]/20 lg:hidden"
              >
                <nav className="flex flex-col gap-1 px-3 py-2.5 sm:px-6">

                  {/* HOME */}
                  <NavLink
                    to="/"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2.5 text-sm font-semibold leading-5 transition-all duration-300 ${
                        isActive
                          ? "!bg-white/10 !text-[#D8D4F0]"
                          : "!text-white hover:!bg-white/10 hover:!text-[#D8D4F0]"
                      }`
                    }
                  >
                    <span className="!text-inherit">Home</span>
                  </NavLink>

                  {/* ABOUT */}
                  <NavLink
                    to="/about"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2.5 text-sm font-semibold leading-5 transition-all duration-300 ${
                        isActive
                          ? "!bg-white/10 !text-[#D8D4F0]"
                          : "!text-white hover:!bg-white/10 hover:!text-[#D8D4F0]"
                      }`
                    }
                  >
                    <span className="!text-inherit">About</span>
                  </NavLink>

                  {/* MOBILE SERVICES */}
                  <div className="flex w-full items-center rounded-lg transition-all duration-300 hover:bg-white/10">
                    <NavLink
                      to="/services"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `min-w-0 flex-1 px-3 py-2.5 text-sm font-semibold leading-5 transition-all duration-300 ${
                          isActive
                            ? "!text-[#D8D4F0]"
                            : "!text-white hover:!text-[#D8D4F0]"
                        }`
                      }
                    >
                      <span className="!text-inherit">Services</span>
                    </NavLink>

                    <button
                      type="button"
                      onClick={() =>
                        setMobileServicesOpen((open) => !open)
                      }
                      aria-label={
                        mobileServicesOpen
                          ? "Collapse services"
                          : "Expand services"
                      }
                      aria-expanded={mobileServicesOpen}
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                        mobileServicesOpen
                          ? "!text-[#D8D4F0]"
                          : "!text-white"
                      }`}
                    >
                      <motion.div
                        animate={{
                          rotate: mobileServicesOpen ? 180 : 0,
                        }}
                        transition={{
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </button>
                  </div>

                  {/* MOBILE SERVICES LIST */}
                  <AnimatePresence initial={false}>
                    {mobileServicesOpen && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          height: 0,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                        }}
                        transition={{
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="ml-3 border-l border-[#D8D4F0]/30 py-1 pl-2">
                          <div className="max-h-[260px] overflow-y-auto overscroll-contain pr-1 [scrollbar-color:#7779C6_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#7779C6] [&::-webkit-scrollbar-track]:bg-transparent">
                            {services.map((service) => {
                              const Icon = service.icon;

                              return (
                                <Link
                                  key={service.slug}
                                  to={`/services/${service.slug}`}
                                  onClick={closeMenu}
                                  className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium !text-white transition-all duration-300 hover:bg-white/10 hover:!text-[#D8D4F0]"
                                >
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10">
                                    <Icon
                                      size={12}
                                      className="!text-[#D8D4F0]"
                                    />
                                  </span>

                                  <span className="min-w-0 flex-1 truncate !text-white">
                                    {service.title}
                                  </span>

                                  <ArrowUpRight
                                    size={11}
                                    className="shrink-0 !text-white/40"
                                  />
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* PROJECTS */}
                  <NavLink
                    to="/"
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToProjects();
                    }}
                    className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold leading-5 !text-white transition-all duration-300 hover:!bg-white/10 hover:!text-[#D8D4F0]"
                  >
                    <span className="!text-inherit">Projects</span>
                  </NavLink>

                  {/* CAREERS */}
                  <NavLink
                    to="/careers"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2.5 text-sm font-semibold leading-5 transition-all duration-300 ${
                        isActive
                          ? "!bg-white/10 !text-[#D8D4F0]"
                          : "!text-white hover:!bg-white/10 hover:!text-[#D8D4F0]"
                      }`
                    }
                  >
                    <span className="!text-inherit">Careers</span>
                  </NavLink>

                  {/* MENTORSHIP */}
                  <NavLink
                    to="/mentorship"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2.5 text-sm font-semibold leading-5 transition-all duration-300 ${
                        isActive
                          ? "!bg-white/10 !text-[#D8D4F0]"
                          : "!text-white hover:!bg-white/10 hover:!text-[#D8D4F0]"
                      }`
                    }
                  >
                    <span className="!text-inherit">Mentorship</span>
                  </NavLink>

                  {/* CONTACT */}
                  <NavLink
                    to="/contact"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2.5 text-sm font-semibold leading-5 transition-all duration-300 ${
                        isActive
                          ? "!bg-white/10 !text-[#D8D4F0]"
                          : "!text-white hover:!bg-white/10 hover:!text-[#D8D4F0]"
                      }`
                    }
                  >
                    <span className="!text-inherit">Contact</span>
                  </NavLink>

                  {/* MOBILE CTA */}
                  <Link
                    to="/contact"
                    onClick={closeMenu}
                    className="mt-1 flex min-h-10 w-50 items-center justify-center gap-2 rounded-lg bg-white px-3 py-2.5 text-sm font-bold !text-[#3D358B] transition-all duration-300 hover:bg-[#D8D4F0] active:scale-[0.99]"
                  >
                    <span className="!text-[#3D358B]">
                      Get Started
                    </span>

                    <ArrowRight className="h-4 w-4 !text-[#3D358B]" />
                  </Link>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* BOTTOM ACCENT */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D8D4F0]/50 to-transparent" />
      </motion.header>
    </>
  );
}

export default Navbar;
