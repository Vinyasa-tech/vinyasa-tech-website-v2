
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BriefcaseBusiness,
  ChevronDown,
  LayoutDashboard,
  Settings,
  Users,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  adminName?: string;
  adminRole?: string;
}

const AdminSidebar = ({
  mobileOpen,
  onClose,
  adminName = "Admin",
  adminRole = "Administrator",
}: AdminSidebarProps) => {
  const location = useLocation();

  const [mentorshipOpen, setMentorshipOpen] = useState(true);
  const [careersOpen, setCareersOpen] = useState(true);

  const initial = adminName.trim().charAt(0).toUpperCase() || "A";

  useEffect(() => {
    if (location.pathname.startsWith("/mentorship")) {
      setMentorshipOpen(true);
    }

    if (location.pathname.startsWith("/careers")) {
      setCareersOpen(true);
    }

    onClose();
  }, [location.pathname, onClose]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen, onClose]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 text-[14px] font-normal transition-colors sm:text-[13px] ${
      isActive
        ? "bg-white/[0.15] text-white"
        : "text-[#D8D4F0] hover:bg-white/10 hover:text-white"
    }`;

  const sectionButtonClass =
    "group flex min-h-10 w-full items-center justify-between rounded-lg px-3 text-[14px] font-normal text-[#D8D4F0] transition-colors hover:bg-white/10 hover:text-white sm:text-[13px]";

  const subLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-9 w-full items-center rounded-lg px-3 pl-9 text-[13px] font-normal transition-colors sm:text-xs ${
      isActive
        ? "bg-[#8C8BD1]/20 text-white"
        : "text-[#BDB9DD] hover:bg-white/10 hover:text-white"
    }`;

  const iconClass =
    "shrink-0 text-[#BDB9DD] transition-colors group-hover:text-white";

  return (
    <>
      {/* MOBILE OVERLAY */}
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={onClose}
        tabIndex={mobileOpen ? 0 : -1}
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-[60] bg-[#17144A]/55 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      />

      {/* SIDEBAR */}
      <aside
        id="admin-sidebar"
        aria-label="Admin navigation"
        aria-hidden={!mobileOpen && typeof window !== "undefined" && window.innerWidth < 1024}
        className={`
          fixed inset-y-0 left-0 z-[70]
          flex h-dvh shrink-0
          w-[min(260px,82vw)] max-w-[260px]
          flex-col overflow-hidden
          border-r border-white/10
          bg-gradient-to-b from-[#353187] via-[#302A78] to-[#25235F]
          shadow-[8px_0_30px_rgba(37,35,95,0.22)]
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}

          lg:sticky lg:top-0 lg:h-dvh
          lg:w-[230px] lg:max-w-[230px]
          lg:translate-x-0 lg:shadow-none

          xl:w-[245px] xl:max-w-[245px]
          2xl:w-[260px] 2xl:max-w-[260px]
        `}
      >
        {/* LOGO */}
        <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-white/10 px-3.5 sm:h-[64px] sm:px-4 lg:h-[68px]">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 sm:h-9 sm:w-9">
              <span className="text-base font-normal text-white">V</span>
            </div>

            <div className="min-w-0">
              <h1 className="text-[16px] font-normal tracking-[-0.03em] text-white sm:text-[17px]">
                VINYASA
              </h1>

              <p className="mt-0.5 text-[10px] font-normal uppercase tracking-[0.16em] text-[#BDB9DD] sm:text-[8px]">
                Admin Panel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#D8D4F0] transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* SCROLLABLE NAVIGATION */}
        <nav
          aria-label="Admin navigation links"
          className="sidebar-navigation min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-2.5 py-3 sm:px-3 sm:py-4"
        >
          <NavLink to="/" end className={linkClass} onClick={onClose}>
            <LayoutDashboard
              size={17}
              strokeWidth={1.8}
              className={iconClass}
            />
            <span>Dashboard</span>
          </NavLink>

          {/* MENTORSHIP */}
          <div className="mt-1.5">
            <button
              type="button"
              onClick={() => setMentorshipOpen((previous) => !previous)}
              className={sectionButtonClass}
              aria-expanded={mentorshipOpen}
            >
              <span className="flex items-center gap-2.5">
                <Users
                  size={17}
                  strokeWidth={1.8}
                  className={iconClass}
                />
                Mentorship
              </span>

              <ChevronDown
                size={14}
                className={`shrink-0 text-[#BDB9DD] transition-transform duration-200 ${
                  mentorshipOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {mentorshipOpen && (
              <div className="ml-5 mt-1 space-y-1 border-l border-white/15 pl-1.5">
                <NavLink
                  to="/mentorship/applications"
                  className={subLinkClass}
                  onClick={onClose}
                >
                  Applications
                </NavLink>

                <NavLink
                  to="/mentorship/success-stories"
                  className={subLinkClass}
                  onClick={onClose}
                >
                  Success Stories
                </NavLink>

                <NavLink
                  to="/mentorship/programs"
                  className={subLinkClass}
                  onClick={onClose}
                >
                  Programs
                </NavLink>
              </div>
            )}
          </div>

          {/* CAREERS */}
          <div className="mt-1.5">
            <button
              type="button"
              onClick={() => setCareersOpen((previous) => !previous)}
              className={sectionButtonClass}
              aria-expanded={careersOpen}
            >
              <span className="flex items-center gap-2.5">
                <BriefcaseBusiness
                  size={17}
                  strokeWidth={1.8}
                  className={iconClass}
                />
                Careers
              </span>

              <ChevronDown
                size={14}
                className={`shrink-0 text-[#BDB9DD] transition-transform duration-200 ${
                  careersOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {careersOpen && (
              <div className="ml-5 mt-1 space-y-1 border-l border-white/15 pl-1.5">
                <NavLink
                  to="/careers/jobs"
                  className={subLinkClass}
                  onClick={onClose}
                >
                  Job Openings
                </NavLink>

                <NavLink
                  to="/careers/applications"
                  className={subLinkClass}
                  onClick={onClose}
                >
                  Job Applications
                </NavLink>
              </div>
            )}
          </div>

          {/* PROJECTS */}
          <div className="mt-1.5">
            <NavLink
              to="/projects"
              className={linkClass}
              onClick={onClose}
            >
              <BriefcaseBusiness
                size={17}
                strokeWidth={1.8}
                className={iconClass}
              />
              <span>Projects</span>
            </NavLink>
          </div>

          {/* SETTINGS */}
          <div className="mt-3 border-t border-white/10 pt-3">
            <NavLink
              to="/settings"
              className={linkClass}
              onClick={onClose}
            >
              <Settings
                size={17}
                strokeWidth={1.8}
                className={iconClass}
              />
              <span>Settings</span>
            </NavLink>
          </div>
        </nav>

        {/* ADMIN PROFILE */}
        <div className="shrink-0 border-t border-white/10 bg-[#25235F]/50 p-2.5 sm:p-3">
          <div className="flex min-w-0 items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.07] px-2.5 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-[#8C8BD1] to-[#534495] text-sm font-normal text-white sm:h-9 sm:w-9 sm:text-xs">
              {initial}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-normal text-white sm:text-xs">
                {adminName}
              </p>

              <p className="mt-0.5 truncate text-[11px] font-normal text-[#BDB9DD] sm:text-[10px]">
                {adminRole}
              </p>
            </div>

            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8CDBB5]"
              title="Active"
            />
          </div>
        </div>
      </aside>

      <style>{`
        .sidebar-navigation {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .sidebar-navigation::-webkit-scrollbar {
          display: none;
          width: 0;
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;
