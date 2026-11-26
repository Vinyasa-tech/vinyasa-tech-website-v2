
import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function CandidateLogin() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const jobId = params.get("jobId") ?? "";

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
  `${API_URL}/candidate-auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            password,
          }),
        }
      );

      const result = await response.json();

      // Incorrect password or account not found:
      // stay on the login page.
      if (!response.ok) {
        setError(
          result.message || "Invalid email or password."
        );
        return;
      }

      const token = result.data?.token;
      const candidate = result.data?.candidate;

      if (!token || !candidate) {
        setError("Login response is incomplete. Please try again.");
        return;
      }

      // Save the authenticated session for the candidate area.
      sessionStorage.setItem("vinyasa_candidate_token", token);
      sessionStorage.setItem(
        "vinyasa_candidate",
        JSON.stringify(candidate)
      );

      const query = jobId
        ? `?jobId=${encodeURIComponent(jobId)}`
        : "";

      navigate(`/careers/dashboard${query}`, {
        replace: true,
      });
    } catch {
      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  const registerQuery = new URLSearchParams();

  if (jobId) {
    registerQuery.set("jobId", jobId);
  }

  const registerUrl = `/careers/register${
    registerQuery.toString()
      ? `?${registerQuery.toString()}`
      : ""
  }`;

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#F5F3FB] px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-lg rounded-2xl border border-[#D8D4F0] bg-white px-5 py-7 shadow-sm sm:px-9 sm:py-9">
        <Link to="/careers" className="inline-block">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6668B8]">
            Vinyasa Careers
          </p>
        </Link>

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#0B2545] sm:text-4xl">
          Welcome back
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
          Sign in to view your applications and continue applying.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-[#0B2545]"
            >
              Email address
            </label>

            <div className="flex items-center rounded-lg border border-gray-300 transition focus-within:border-[#6668B8] focus-within:ring-2 focus-within:ring-[#6668B8]/15">
              <Mail size={18} className="ml-3 shrink-0 text-gray-400" />

              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                placeholder="Enter your registered email"
                className="w-full min-w-0 rounded-lg bg-transparent px-3 py-3 text-sm text-gray-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-[#0B2545]"
            >
              Password
            </label>

            <div className="flex items-center rounded-lg border border-gray-300 transition focus-within:border-[#6668B8] focus-within:ring-2 focus-within:ring-[#6668B8]/15">
              <LockKeyhole
                size={18}
                className="ml-3 shrink-0 text-gray-400"
              />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="Enter your password"
                className="w-full min-w-0 bg-transparent px-3 py-3 text-sm text-gray-800 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="mr-3 shrink-0 text-gray-500 hover:text-[#40358C]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#40358C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#302A78] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#6668B8] focus:ring-offset-2"
          >
            {loading ? "Signing in..." : "Sign in"}

            {!loading && (
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to={registerUrl}
            className="font-semibold text-[#40358C] hover:underline"
          >
            Create an account
          </Link>
        </p>

        <div className="mt-5 flex items-start gap-2 border-t border-gray-100 pt-4">
          <LockKeyhole
            size={15}
            className="mt-0.5 shrink-0 text-[#6668B8]"
          />
          <p className="text-xs leading-5 text-gray-500">
            Sign in using the email address and password associated with your
            registered candidate account.
          </p>
        </div>
      </div>
    </main>
  );
}
