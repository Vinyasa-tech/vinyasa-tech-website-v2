
import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  BriefcaseBusiness,
} from "lucide-react";

export default function CandidateRegister() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const jobId = params.get("jobId") ?? "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUrl = `/careers/login${
    jobId ? `?jobId=${encodeURIComponent(jobId)}` : ""
  }`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/candidate-auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            email: normalizedEmail,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message || "Unable to create your account. Please try again."
        );
        return;
      }

      // Registration succeeded. The candidate must log in with their password.
      const query = new URLSearchParams();

      if (jobId) query.set("jobId", jobId);
      query.set("email", normalizedEmail);

      navigate(`/careers/login?${query.toString()}`, {
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

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#F5F3FB] px-4 py-8 sm:px-6">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#D8D4F0] bg-white shadow-lg shadow-[#40358C]/5">
        <div className="px-6 pb-5 pt-7 sm:px-8 sm:pt-8">
          <Link to="/careers" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#40358C] text-white">
              <BriefcaseBusiness size={21} />
            </div>

            <span className="text-sm font-bold uppercase tracking-wider text-[#0B2545]">
              Vinyasa Careers
            </span>
          </Link>

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-[#0B2545] sm:text-3xl">
            Create your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Create your candidate account to continue applying for jobs.
          </p>
        </div>

        <div className="px-6 pb-7 sm:px-8 sm:pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-semibold text-[#0B2545]"
              >
                Full name
              </label>

              <div className="flex items-center rounded-lg border border-gray-300 transition focus-within:border-[#6668B8] focus-within:ring-2 focus-within:ring-[#6668B8]/15">
                <UserRound size={18} className="ml-3.5 shrink-0 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter your full name"
                  className="w-full min-w-0 bg-transparent px-3 py-3 text-sm text-gray-800 outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-[#0B2545]"
              >
                Email address
              </label>

              <div className="flex items-center rounded-lg border border-gray-300 transition focus-within:border-[#6668B8] focus-within:ring-2 focus-within:ring-[#6668B8]/15">
                <Mail size={18} className="ml-3.5 shrink-0 text-gray-400" />
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
                  placeholder="Enter your email address"
                  className="w-full min-w-0 bg-transparent px-3 py-3 text-sm text-gray-800 outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-[#0B2545]"
              >
                Password
              </label>

              <div className="flex items-center rounded-lg border border-gray-300 transition focus-within:border-[#6668B8] focus-within:ring-2 focus-within:ring-[#6668B8]/15">
                <LockKeyhole
                  size={18}
                  className="ml-3.5 shrink-0 text-gray-400"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter at least 8 characters"
                  className="w-full min-w-0 bg-transparent px-3 py-3 text-sm text-gray-800 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="mr-3.5 shrink-0 text-gray-500 hover:text-[#40358C]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <p className="mt-1.5 text-xs text-gray-500">
                Use at least 8 characters.
              </p>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#40358C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#302A78] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#6668B8] focus:ring-offset-2"
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && (
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to={loginUrl}
              className="font-semibold text-[#40358C] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
