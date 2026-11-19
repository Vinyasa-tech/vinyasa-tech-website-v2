import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { careersJobs } from "@/data/careersJobs";

export default function ApplicationSuccess() {
  const [params] = useSearchParams();
  const jobId = params.get("jobId");

  const job = careersJobs.find((item) => item.id === jobId);

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-5 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10 2xl:max-w-xl min-[2400px]:max-w-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 size={36} className="text-green-600" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Application Submitted!
        </h1>

        <p className="mt-3 leading-7 text-gray-600">
          Your demo application has been submitted successfully.
          {job ? ` Your selected position is ${job.title}.` : ""}
        </p>

        <p className="mt-3 text-sm text-gray-500">
          Your application status is Submitted.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/careers/dashboard"
            className="rounded-lg bg-gray-900 px-5 py-3 font-semibold !text-white"
          >
            View Dashboard
          </Link>

          <Link
            to="/careers"
            className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-900"
          >
            Browse More Jobs
          </Link>
        </div>
      </div>
    </main>
  );
}