import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F9FD] px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg text-center">
        {/* 404 */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF0FA] text-[#3F3A8F] sm:h-20 sm:w-20">
          <span className="text-2xl font-semibold tracking-tight sm:text-3xl">
            404
          </span>
        </div>

        {/* LABEL */}
        <p className="mt-6 text-[9px] font-medium uppercase tracking-[0.2em] text-[#3F3A8F] sm:text-[10px]">
          Page Not Found
        </p>

        {/* HEADING */}
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#0B2545] sm:text-4xl md:text-5xl">
          Something went
          <span className="text-[#6668B8]"> off track.</span>
        </h1>

        {/* DESCRIPTION */}
        <p className="mx-auto mt-3 max-w-md text-xs font-normal leading-5 text-[#55556A] sm:text-sm sm:leading-6">
          The page you are looking for does not exist or may have been moved.
        </p>

        {/* BUTTON */}
        <Link
          to="/"
          className="group relative mt-7 inline-flex min-h-10 items-center gap-2 overflow-hidden rounded-lg bg-[#0B2545] px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.12em] !text-white transition-all duration-300 hover:-translate-y-0.5 sm:text-xs"
        >
          <span className="absolute inset-0 -translate-x-full bg-[#8C8BD1] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />

          <span className="relative z-10 transition-colors duration-300 group-hover:!text-[#0B2545]">
            Back to Home
          </span>

          <ArrowRight
            size={13}
            className="relative z-10 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#0B2545]"
          />
        </Link>
      </div>
    </main>
  );
}

export default NotFound;