import type { ApplicationStatus } from "@/types/careers";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const statusStyles: Record<ApplicationStatus, string> = {
  Submitted: "bg-blue-50 text-blue-700 ring-blue-200",
  "Under Review": "bg-amber-50 text-amber-700 ring-amber-200",
  Shortlisted: "bg-violet-50 text-violet-700 ring-violet-200",
  Interview: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Rejected: "bg-red-50 text-red-700 ring-red-200",
  Offer: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}