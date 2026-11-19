
import {
  ArrowRight,
  LockKeyhole,
  Mail,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type { FormEvent } from "react";

import { useNavigate } from "react-router-dom";

import { motion } from "motion/react";

import { loginAdmin } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await loginAdmin({
        email: cleanEmail,
        password,
      });

      const token = response.data?.token;
      const admin = response.data?.admin;

      if (!response.success || !token || !admin) {
        setError(response.message || "Login failed.");
        return;
      }

      login(token, admin);

      setPassword("");

      navigate("/", { replace: true });
    } catch (err: unknown) {
      console.error("Admin login failed:", err);

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {
        const apiError = err as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        setError(
          apiError.response?.data?.message ||
            "Unable to connect to the server. Please try again."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#302A78] via-[#353187] to-[#25235F] px-4 py-3">

      {/* DECORATION */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[#7779C6]/10 blur-3xl"
      />

      {/* LOGIN CONTAINER */}
      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
        }}
        className="relative w-full max-w-sm"
      >

        {/* LOGO */}
        <div className="mb-3 text-center">
          <h1 className="text-xl font-semibold tracking-[-0.04em] text-white">
            VINYASA
          </h1>

          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#BDB9DD]">
            Admin Panel
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-[0_20px_55px_rgba(20,17,70,0.25)]">

          <div className="px-5 py-4 sm:px-6 sm:py-5">

            {/* HEADER */}
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-[#25224F]">
                Welcome back
              </h2>

              <p className="mt-1 text-xs leading-5 text-[#77778A]">
                Sign in to manage your Vinyasa admin panel.
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div
                role="alert"
                className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2"
              >
                <p className="text-xs font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="mt-4 space-y-3.5"
            >

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-medium text-[#55556A]"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7779C6]"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="Enter your admin email"
                    autoComplete="username"
                    required
                    disabled={isLoading}
                    className="h-10 w-full rounded-lg border border-[#D8D7ED] bg-white pl-9 pr-3 text-xs text-[#25224F] outline-none transition-all focus:border-[#3F3A8F] focus:ring-2 focus:ring-[#3F3A8F]/10 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-medium text-[#55556A]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7779C6]"
                  />

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                    className="h-10 w-full rounded-lg border border-[#D8D7ED] bg-white pl-9 pr-3 text-xs text-[#25224F] outline-none transition-all focus:border-[#3F3A8F] focus:ring-2 focus:ring-[#3F3A8F]/10 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="group flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#3F3A8F] px-4 text-xs font-medium text-white transition-colors hover:bg-[#302A78] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In

                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>

      </motion.div>
    </main>
  );
};

export default Login;
