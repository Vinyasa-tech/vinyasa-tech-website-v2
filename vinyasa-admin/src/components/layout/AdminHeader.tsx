import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Menu,
  Search,
  X,
  ChevronDown,
  UserRound,
  LogOut,
  Settings,
  Check,
  FileText,
  ArrowRight,
  LoaderCircle,
  GraduationCap,
  BriefcaseBusiness,
  FolderKanban,
  BookOpen,
  Users,
  Trash2,
} from "lucide-react";

import {
  getApplications,
  type ApiApplication,
} from "../../services/careersApi";

import {
  getMentorshipApplications,
  type MentorshipApplication,
} from "../../services/mentorshipApplicationApi";

interface AdminHeaderProps {
  onMenuClick: () => void;
  onLogout?: () => void;
  adminName?: string;
  adminRole?: string;
}

interface AdminSearchItem {
  title: string;
  description: string;
  path: string;
  keywords: string;
  icon: ElementType;
}

type NotificationItem =
  | {
      type: "job";
      id: string | number;
      name: string;
      title: string;
      date?: string;
    }
  | {
      type: "mentorship";
      id: string | number;
      name: string;
      title: string;
      date?: string;
    };

const searchItems: AdminSearchItem[] = [
  {
    title: "Dashboard",
    description: "View admin dashboard",
    path: "/",
    keywords: "home overview dashboard",
    icon: BriefcaseBusiness,
  },
  {
    title: "Job Openings",
    description: "Manage available job positions",
    path: "/careers/jobs",
    keywords: "careers jobs openings positions recruitment",
    icon: BriefcaseBusiness,
  },
  {
    title: "Job Applications",
    description: "View and manage candidate applications",
    path: "/careers/applications",
    keywords: "careers candidates applicants recruitment",
    icon: FileText,
  },
  {
    title: "Mentorship Applications",
    description: "Manage mentorship registrations",
    path: "/mentorship/applications",
    keywords: "mentorship students applications registrations",
    icon: GraduationCap,
  },
  {
    title: "Mentorship Programs",
    description: "Manage mentorship programs",
    path: "/mentorship/programs",
    keywords: "mentorship courses training programs",
    icon: BookOpen,
  },
  {
    title: "Success Stories",
    description: "Manage student success stories",
    path: "/mentorship/success-stories",
    keywords: "mentorship students achievements stories",
    icon: Users,
  },
  {
    title: "Projects",
    description: "Manage company projects",
    path: "/projects",
    keywords: "portfolio work projects",
    icon: FolderKanban,
  },
  {
    title: "Settings",
    description: "Manage admin settings",
    path: "/settings",
    keywords: "configuration preferences settings",
    icon: Settings,
  },
];

const getNotificationKey = (notification: NotificationItem) =>
  `${notification.type}-${notification.id}`;

const AdminHeader = ({
  onMenuClick,
  onLogout,
  adminName = "Admin",
  adminRole = "Administrator",
}: AdminHeaderProps) => {
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  const [profileOpen, setProfileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const dismissedIdsRef = useRef<Set<string>>(new Set());
  const loadingRef = useRef(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const initial = adminName.trim().charAt(0).toUpperCase() || "A";

  const filteredSearchItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return searchItems;

    return searchItems.filter((item) =>
      `${item.title} ${item.description} ${item.keywords}`
        .toLowerCase()
        .includes(term)
    );
  }, [searchTerm]);

  const loadNotifications = useCallback(async () => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setNotificationsLoading(true);
    setNotificationError("");

    try {
      const [jobResult, mentorshipResult] = await Promise.allSettled([
        getApplications(),
        getMentorshipApplications(),
      ]);

      const combined: NotificationItem[] = [];
      const activeKeys = new Set<string>();
      const errors: string[] = [];

      if (jobResult.status === "fulfilled") {
        const jobApplications: ApiApplication[] =
          jobResult.value.data?.data ?? [];

        jobApplications.forEach((application) => {
          if (application.status !== "new") return;

          const notification: NotificationItem = {
            type: "job",
            id: application.id,
            name:
              `${application.first_name || ""} ${
                application.last_name || ""
              }`.trim() || "New applicant",
            title: application.job_title || "Job application",
            date: application.applied_at,
          };

          activeKeys.add(getNotificationKey(notification));
          combined.push(notification);
        });
      } else {
        console.error("Job notification error:", jobResult.reason);
        errors.push("Job applications could not be loaded.");
      }

      if (mentorshipResult.status === "fulfilled") {
        const mentorshipApplications: MentorshipApplication[] =
          mentorshipResult.value ?? [];

        mentorshipApplications.forEach((application) => {
          if (application.status !== "pending") return;

          const notification: NotificationItem = {
            type: "mentorship",
            id: application.id,
            name:
              `${application.first_name || ""} ${
                application.last_name || ""
              }`.trim() || "New applicant",
            title: application.program_title || "Mentorship program",
            date: application.applied_at,
          };

          activeKeys.add(getNotificationKey(notification));
          combined.push(notification);
        });
      } else {
        console.error(
          "Mentorship notification error:",
          mentorshipResult.reason
        );
        errors.push("Mentorship applications could not be loaded.");
      }

      if (
        jobResult.status === "fulfilled" &&
        mentorshipResult.status === "fulfilled"
      ) {
        dismissedIdsRef.current.forEach((key) => {
          if (!activeKeys.has(key)) {
            dismissedIdsRef.current.delete(key);
          }
        });
      }

      combined.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });

      setNotifications(
        combined.filter(
          (item) => !dismissedIdsRef.current.has(getNotificationKey(item))
        )
      );

      if (errors.length > 0) {
        setNotificationError(errors.join(" "));
      }
    } catch (error) {
      console.error("Notification loading error:", error);
      setNotificationError("Unable to load notifications.");
    } finally {
      loadingRef.current = false;
      setNotificationsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    const interval = window.setInterval(loadNotifications, 60000);

    const handleFocus = () => loadNotifications();
    const handleNotificationUpdate = () => loadNotifications();

    window.addEventListener("focus", handleFocus);
    window.addEventListener(
      "admin-notifications-updated",
      handleNotificationUpdate
    );

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener(
        "admin-notifications-updated",
        handleNotificationUpdate
      );
    };
  }, [loadNotifications]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!searchRef.current?.contains(target)) setSearchOpen(false);
      if (!notificationRef.current?.contains(target)) {
        setNotificationOpen(false);
      }
      if (!profileRef.current?.contains(target)) setProfileOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotificationOpen(false);
        setProfileOpen(false);
        setProfileModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeDropdowns = () => {
    setSearchOpen(false);
    setNotificationOpen(false);
    setProfileOpen(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    window.dispatchEvent(
      new CustomEvent("admin-search", {
        detail: { searchTerm: value },
      })
    );
  };

  const toggleSearch = () => {
    setSearchOpen((previous) => !previous);
    setNotificationOpen(false);
    setProfileOpen(false);
  };

  const toggleNotifications = () => {
    const willOpen = !notificationOpen;

    setNotificationOpen(willOpen);
    setSearchOpen(false);
    setProfileOpen(false);

    if (willOpen) loadNotifications();
  };

  const toggleProfile = () => {
    setProfileOpen((previous) => !previous);
    setSearchOpen(false);
    setNotificationOpen(false);
  };

  const openSearchResult = (item: AdminSearchItem) => {
    closeDropdowns();
    setSearchTerm("");

    window.dispatchEvent(
      new CustomEvent("admin-search", {
        detail: { searchTerm: "" },
      })
    );

    navigate(item.path);
  };

  const clearAllNotifications = () => {
    notifications.forEach((notification) => {
      dismissedIdsRef.current.add(getNotificationKey(notification));
    });

    setNotifications([]);
  };

  const openNotification = (notification: NotificationItem) => {
    closeDropdowns();

    if (notification.type === "job") {
      navigate("/careers/applications", {
        state: {
          openApplicationId: notification.id,
          openApplicationType: "job",
        },
      });
    } else {
      navigate("/mentorship/applications", {
        state: {
          openApplicationId: notification.id,
          openApplicationType: "mentorship",
        },
      });
    }
  };

  const openSettings = () => {
    closeDropdowns();
    navigate("/settings");
  };

  const openProfile = () => {
    closeDropdowns();
    setProfileModalOpen(true);
  };

  const formatDate = (date?: string) => {
    if (!date) return "Recently";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Recently";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <header className="relative z-40 flex h-14 w-full shrink-0 items-center justify-between gap-1 border-b border-[#E7E6F1] bg-white px-2.5 shadow-sm sm:h-16 sm:gap-2 sm:px-4 md:px-5 lg:px-6 xl:px-7 2xl:h-[68px] 2xl:px-8">
        {/* LEFT */}
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open sidebar"
            aria-controls="admin-sidebar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#353187] transition hover:bg-[#F0EFFA] active:scale-95 lg:hidden"
          >
            <Menu size={21} />
          </button>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7779C6] sm:text-[10px] md:text-[11px]">
              Admin Dashboard
            </p>

            <h2 className="max-w-[150px] truncate text-[15px] font-semibold text-[#25224F] sm:max-w-[260px] sm:text-base md:max-w-[360px] md:text-lg">
              Welcome back, {adminName}
            </h2>
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex shrink-0 items-center gap-0 sm:gap-1 md:gap-2">
          {/* SEARCH */}
          <div ref={searchRef} className="relative">
            <button
              type="button"
              onClick={toggleSearch}
              aria-label="Search admin panel"
              aria-expanded={searchOpen}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B6A80] transition hover:bg-[#F0EFFA] hover:text-[#353187] sm:h-10 sm:w-10"
            >
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>

            {searchOpen && (
              <div className="fixed left-2 right-2 top-[60px] z-[80] overflow-hidden rounded-xl border border-[#E7E6F1] bg-white shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[340px] md:w-[370px]">
                <div className="border-b border-[#E7E6F1] p-3">
                  <label className="mb-2 block text-sm font-semibold text-[#25224F] sm:text-xs">
                    Search Admin Panel
                  </label>

                  <div className="flex h-10 items-center gap-2 rounded-lg border border-[#D8D7ED] bg-[#FAFAFE] px-3 focus-within:border-[#3F3A8F] focus-within:ring-2 focus-within:ring-[#3F3A8F]/10">
                    <Search size={16} className="shrink-0 text-[#7779C6]" />

                    <input
                      autoFocus
                      type="text"
                      value={searchTerm}
                      onChange={(event) =>
                        handleSearchChange(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" &&
                          filteredSearchItems.length > 0
                        ) {
                          openSearchResult(filteredSearchItems[0]);
                        }
                      }}
                      placeholder="Search pages, applications..."
                      className="min-w-0 flex-1 bg-transparent text-base text-[#25224F] outline-none placeholder:text-[#A4A2B3] sm:text-sm"
                    />

                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => handleSearchChange("")}
                        aria-label="Clear search"
                        className="shrink-0 text-[#77778A] hover:text-[#353187]"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-[min(340px,55dvh)] overflow-y-auto p-2">
                  <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#9998A8] sm:text-[10px]">
                    {searchTerm ? "Search results" : "Quick navigation"}
                  </p>

                  {filteredSearchItems.length > 0 ? (
                    filteredSearchItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.path}
                          type="button"
                          onClick={() => openSearchResult(item)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-[#F5F3FB]"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F0EFFA] text-[#40358C]">
                            <Icon size={17} />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-[#25224F] sm:text-xs">
                              {item.title}
                            </span>

                            <span className="mt-0.5 block truncate text-xs text-[#88879A] sm:text-[10px]">
                              {item.description}
                            </span>
                          </span>

                          <ArrowRight
                            size={14}
                            className="shrink-0 text-[#A5A3B6]"
                          />
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-8 text-center">
                      <Search
                        size={22}
                        className="mx-auto text-[#B3B0C8]"
                      />
                      <p className="mt-2 text-sm font-semibold text-[#25224F] sm:text-xs">
                        No results found
                      </p>
                      <p className="mt-1 text-xs text-[#88879A] sm:text-[11px]">
                        Try another page or keyword.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* NOTIFICATIONS */}
          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={toggleNotifications}
              aria-label={`Notifications: ${notifications.length} new items`}
              aria-expanded={notificationOpen}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#6B6A80] transition hover:bg-[#F0EFFA] hover:text-[#353187] sm:h-10 sm:w-10"
            >
              <Bell size={18} />

              {notifications.length > 0 && (
                <span className="absolute right-1 top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold leading-none text-white sm:text-[9px]">
                  {notifications.length > 9 ? "9+" : notifications.length}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="fixed left-2 right-2 top-[60px] z-[80] overflow-hidden rounded-xl border border-[#E7E6F1] bg-white shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[360px] md:w-[390px]">
                <div className="flex items-center justify-between gap-2 border-b border-[#E7E6F1] px-3 py-3 sm:px-4">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-[#25224F] sm:text-sm">
                      Notifications
                    </h3>
                    <p className="mt-0.5 text-xs text-[#88879A] sm:text-[11px]">
                      New job and mentorship applications
                    </p>
                  </div>

                  {notifications.length > 0 && (
                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="rounded-full bg-[#F0EFFA] px-2 py-1 text-xs font-semibold text-[#40358C] sm:text-[10px]">
                        {notifications.length} New
                      </span>

                      <button
                        type="button"
                        onClick={clearAllNotifications}
                        aria-label="Clear all notifications"
                        title="Clear all notifications"
                        className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 sm:text-[10px]"
                      >
                        <Trash2 size={14} />
                        <span>Clear all</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="max-h-[min(380px,60dvh)] overflow-y-auto">
                  {notificationsLoading && notifications.length === 0 ? (
                    <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-[#88879A] sm:text-xs">
                      <LoaderCircle
                        size={16}
                        className="animate-spin text-[#40358C]"
                      />
                      Loading notifications...
                    </div>
                  ) : notificationError && notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-red-500 sm:text-xs">
                        {notificationError}
                      </p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center px-4 py-9 text-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F0EFFA] text-[#5550A0]">
                        <Check size={21} />
                      </div>

                      <p className="mt-3 text-base font-semibold text-[#25224F] sm:text-sm">
                        You're all caught up!
                      </p>
                      <p className="mt-1 text-sm text-[#88879A] sm:text-xs">
                        No new notifications.
                      </p>
                    </div>
                  ) : (
                    <>
                      {notificationError && (
                        <p className="border-b border-[#F0EFF5] bg-amber-50 px-4 py-2 text-xs text-amber-700 sm:text-[10px]">
                          {notificationError}
                        </p>
                      )}

                      {notifications.slice(0, 8).map((notification) => {
                        const isMentorship =
                          notification.type === "mentorship";

                        return (
                          <button
                            key={getNotificationKey(notification)}
                            type="button"
                            onClick={() => openNotification(notification)}
                            className="flex w-full items-start gap-3 border-b border-[#F0EFF5] px-3 py-3 text-left transition hover:bg-[#FAF9FE] sm:px-4"
                          >
                            <div
                              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                isMentorship
                                  ? "bg-[#F0EFFA] text-[#40358C]"
                                  : "bg-[#EEF3FC] text-[#315A91]"
                              }`}
                            >
                              {isMentorship ? (
                                <GraduationCap size={17} />
                              ) : (
                                <FileText size={16} />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="truncate text-sm font-semibold text-[#25224F] sm:text-xs">
                                  {notification.name}
                                </p>
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#5149A3]" />
                              </div>

                              <p className="mt-1 break-words text-xs text-[#68677B] sm:text-[11px]">
                                {isMentorship
                                  ? "Applied for mentorship: "
                                  : "Applied for job: "}
                                <span className="font-medium text-[#40358C]">
                                  {notification.title}
                                </span>
                              </p>

                              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-[9px] ${
                                    isMentorship
                                      ? "bg-[#F0EFFA] text-[#40358C]"
                                      : "bg-[#EEF3FC] text-[#315A91]"
                                  }`}
                                >
                                  {isMentorship
                                    ? "Mentorship"
                                    : "Job Application"}
                                </span>

                                <span className="text-xs text-[#9998A8] sm:text-[10px]">
                                  {formatDate(notification.date)}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}

                      {notifications.length > 8 && (
                        <p className="px-4 py-2 text-center text-xs text-[#88879A] sm:text-[10px]">
                          Showing 8 of {notifications.length} notifications.
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div
            ref={profileRef}
            className="relative ml-0.5 border-l border-[#E7E6F1] pl-1.5 sm:ml-1 sm:pl-3"
          >
            <button
              type="button"
              onClick={toggleProfile}
              aria-label="Admin profile"
              aria-expanded={profileOpen}
              className="flex items-center gap-1 rounded-lg p-1 transition hover:bg-[#F5F3FB] sm:gap-2 sm:px-2"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#353187] to-[#6668B8] text-sm font-semibold text-white sm:h-9 sm:w-9 sm:text-xs">
                {initial}
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-[85px] truncate text-xs font-semibold text-[#25224F] md:max-w-[120px]">
                  {adminName}
                </p>
                <p className="text-[10px] text-[#88879A]">{adminRole}</p>
              </div>

              <ChevronDown
                size={14}
                className={`hidden text-[#77778A] transition-transform sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="fixed right-2 top-[60px] z-[80] w-[min(230px,calc(100vw-16px))] overflow-hidden rounded-xl border border-[#E7E6F1] bg-white shadow-xl sm:absolute sm:right-0 sm:top-12">
                <div className="border-b border-[#E7E6F1] bg-[#F8F7FC] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#353187] to-[#6668B8] text-base font-semibold text-white sm:text-sm">
                      {initial}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-[#25224F] sm:text-sm">
                        {adminName}
                      </p>
                      <p className="mt-0.5 text-sm text-[#88879A] sm:text-xs">
                        {adminRole}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    onClick={openProfile}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-base text-[#55556A] transition hover:bg-[#F0EFFA] hover:text-[#353187] sm:text-sm"
                  >
                    <UserRound size={16} />
                    My Profile
                  </button>

                  <button
                    type="button"
                    onClick={openSettings}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-base text-[#55556A] transition hover:bg-[#F0EFFA] hover:text-[#353187] sm:text-sm"
                  >
                    <Settings size={16} />
                    Settings
                  </button>

                  {onLogout && (
                    <>
                      <div className="my-1 border-t border-[#E7E6F1]" />
                      <button
                        type="button"
                        onClick={() => {
                          closeDropdowns();
                          onLogout();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-base font-medium text-red-600 transition hover:bg-red-50 sm:text-sm"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* PROFILE MODAL */}
      {profileModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#17144F]/40 px-3 py-5 backdrop-blur-[2px] sm:px-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setProfileModalOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-profile-title"
            className="my-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-[#E7E6F1] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E7E6F1] px-4 py-4 sm:px-5">
              <div>
                <h3
                  id="admin-profile-title"
                  className="text-lg font-semibold text-[#25224F] sm:text-base"
                >
                  My Profile
                </h3>
                <p className="mt-0.5 text-sm text-[#88879A] sm:text-xs">
                  Administrator account details
                </p>
              </div>

              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                aria-label="Close profile"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#77778A] transition hover:bg-[#F0EFFA] hover:text-[#353187]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-4 py-6 sm:px-5">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#353187] to-[#6668B8] text-2xl font-semibold text-white sm:text-xl">
                  {initial}
                </div>

                <h4 className="mt-3 max-w-full break-words text-lg font-semibold text-[#25224F] sm:text-base">
                  {adminName}
                </h4>
                <p className="mt-1 text-sm text-[#88879A] sm:text-xs">
                  {adminRole}
                </p>
              </div>

              <div className="mt-6 space-y-3 rounded-xl bg-[#F8F7FC] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[#88879A] sm:text-xs">
                    Account name
                  </span>
                  <span className="max-w-[60%] truncate text-right text-sm font-semibold text-[#25224F] sm:text-xs">
                    {adminName}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[#88879A] sm:text-xs">
                    Role
                  </span>
                  <span className="text-sm font-semibold text-[#25224F] sm:text-xs">
                    {adminRole}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-[#E7E6F1] px-4 py-3 sm:px-5">
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="rounded-lg bg-[#353187] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#25216F] sm:text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;