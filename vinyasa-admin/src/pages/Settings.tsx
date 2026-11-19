
import {
  Check,
  UserRound,
  Mail,
  Globe,
  Save,
  LogOut,
  Loader2,
  BriefcaseBusiness,
  GraduationCap,
  Wrench,
  Info,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";

import { useAuth } from "../context/AuthContext";

import {
  getAdminSettings,
  updateAdminSettings,
  updateAdminProfile,
} from "../services/settingsApi";

interface WebsiteSettings {
  maintenance_mode: boolean;
  show_job_openings: boolean;
  show_mentorship_programs: boolean;
}

interface AdminSettingsResponse {
  maintenance_mode?: boolean;
  show_job_openings?: boolean;
  show_mentorship_programs?: boolean;
}

const defaultWebsiteSettings: WebsiteSettings = {
  maintenance_mode: false,
  show_job_openings: true,
  show_mentorship_programs: true,
};

const Settings = () => {
  const navigate = useNavigate();
  const { admin, updateAdmin, logout } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [websiteSettings, setWebsiteSettings] =
    useState<WebsiteSettings>(defaultWebsiteSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const getErrorMessage = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
      return (
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    }

    return "Something went wrong. Please try again.";
  };

  // LOAD SETTINGS
  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminSettings();

        if (!isMounted) return;

        const settings =
          response.data as AdminSettingsResponse;

        setName(admin?.name || "");
        setEmail(admin?.email || "");

        if (settings) {
          setWebsiteSettings({
            maintenance_mode: Boolean(settings.maintenance_mode),
            show_job_openings:
              settings.show_job_openings !== false,
            show_mentorship_programs:
              settings.show_mentorship_programs !== false,
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadSettings();

    return () => {
      isMounted = false;
    };
  }, [admin?.name, admin?.email]);

  // HANDLE SWITCH CHANGES
  const handlePreferenceChange = (
    key: keyof WebsiteSettings,
    value: boolean
  ) => {
    setWebsiteSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setError("");
    setSuccessMessage("");
  };

  // SAVE SETTINGS
  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const profileResponse = await updateAdminProfile({
        name: name.trim(),
        email: email.trim(),
      });

      await updateAdminSettings({
        maintenance_mode: websiteSettings.maintenance_mode,
        show_job_openings: websiteSettings.show_job_openings,
        show_mentorship_programs:
          websiteSettings.show_mentorship_programs,
      });

      const updatedAdmin = profileResponse.data;

      updateAdmin({
        id: updatedAdmin.id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
      });

      setName(updatedAdmin.name);
      setEmail(updatedAdmin.email);

      setSuccessMessage("Settings saved successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const inputClass =
    "h-10 w-full rounded-lg border border-[#D8D7ED] bg-white px-3 text-xs text-[#25224F] outline-none transition focus:border-[#3F3A8F] focus:ring-2 focus:ring-[#3F3A8F]/10";

  // TOGGLE SWITCH
  const Toggle = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: (value: boolean) => void;
    label: string;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3F3A8F]/20 ${
        checked ? "bg-[#3F3A8F]" : "bg-[#D5D4E1]"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200 ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#F5F6FC]">
        <div className="flex items-center gap-2 text-xs font-medium text-[#3F3A8F]">
          <Loader2 size={17} className="animate-spin" />
          Loading settings...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-[#F5F6FC] p-3 sm:p-5 lg:p-6 xl:p-7">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7779C6]">
            Admin Settings
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#25224F] sm:text-3xl">
            Settings
          </h1>

          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#77778A] sm:text-sm">
            Manage your administrator profile and website preferences.
          </p>
        </motion.div>

        {/* ERROR */}
        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
            {error}
          </div>
        )}

        {/* ADMIN PROFILE */}
        <section className="mt-6 overflow-hidden rounded-xl border border-[#E7E6F1] bg-white">
          <div className="border-b border-[#E7E6F1] px-4 py-4 sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF0FA] text-[#3F3A8F]">
                <UserRound size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#25224F]">
                  Admin Profile
                </h2>

                <p className="mt-0.5 text-[10px] text-[#9998A7]">
                  Update your administrator information.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#55556A]">
                Full Name
              </label>

              <div className="relative">
                <UserRound
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7779C6]"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter admin name"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#55556A]">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7779C6]"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter email address"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <p className="text-[10px] text-[#9998A7]">
                Account role:{" "}
                <span className="font-semibold capitalize text-[#3F3A8F]">
                  {admin?.role || "Admin"}
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* WEBSITE PREFERENCES */}
        <section className="mt-4 overflow-hidden rounded-xl border border-[#E7E6F1] bg-white">
          <div className="border-b border-[#E7E6F1] px-4 py-4 sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF0FA] text-[#3F3A8F]">
                <Globe size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#25224F]">
                  Website Preferences
                </h2>

                <p className="mt-0.5 text-[10px] text-[#9998A7]">
                  Control the visibility and availability of website sections.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-[#E7E6F1]">

            {/* MAINTENANCE MODE */}
            <div className="flex min-h-[86px] items-center justify-between gap-4 px-4 py-4 sm:px-5">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF4E8] text-[#C27A27]">
                  <Wrench size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#25224F]">
                    Maintenance Mode
                  </p>

                  <p className="mt-0.5 text-[10px] leading-4 text-[#858497] sm:text-xs">
                    Temporarily display a maintenance page to website visitors.
                  </p>
                </div>
              </div>

              <Toggle
                label="Maintenance Mode"
                checked={websiteSettings.maintenance_mode}
                onChange={(value) =>
                  handlePreferenceChange("maintenance_mode", value)
                }
              />
            </div>

            {/* JOB OPENINGS */}
            <div className="flex min-h-[86px] items-center justify-between gap-4 px-4 py-4 sm:px-5">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FA] text-[#3F3A8F]">
                  <BriefcaseBusiness size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#25224F]">
                    Job Openings
                  </p>

                  <p className="mt-0.5 text-[10px] leading-4 text-[#858497] sm:text-xs">
                    Display or hide the Careers job openings section.
                  </p>
                </div>
              </div>

              <Toggle
                label="Job Openings"
                checked={websiteSettings.show_job_openings}
                onChange={(value) =>
                  handlePreferenceChange("show_job_openings", value)
                }
              />
            </div>

            {/* MENTORSHIP PROGRAMS */}
            <div className="flex min-h-[86px] items-center justify-between gap-4 px-4 py-4 sm:px-5">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F1F0FA] text-[#6255A5]">
                  <GraduationCap size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#25224F]">
                    Mentorship Programs
                  </p>

                  <p className="mt-0.5 text-[10px] leading-4 text-[#858497] sm:text-xs">
                    Display or hide mentorship programs on the website.
                  </p>
                </div>
              </div>

              <Toggle
                label="Mentorship Programs"
                checked={websiteSettings.show_mentorship_programs}
                onChange={(value) =>
                  handlePreferenceChange("show_mentorship_programs", value)
                }
              />
            </div>
          </div>

          {/* INFORMATION */}
          <div className="flex items-start gap-2 border-t border-[#E7E6F1] bg-[#FAFAFD] px-4 py-3 sm:px-5">
            <Info size={14} className="mt-0.5 shrink-0 text-[#7779C6]" />

            <p className="text-[10px] leading-4 text-[#858497]">
              Changes will be applied to the public website only after the
              website frontend is connected to these preferences.
            </p>
          </div>
        </section>

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700">
            <Check size={15} />
            {successMessage}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="mt-5 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-100 bg-white px-4 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 sm:w-auto"
          >
            <LogOut size={14} />
            Logout
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#3F3A8F] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#302A78] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={14} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Settings;
