
import { Navigate, useSearchParams } from "react-router-dom";

export default function CareersAuthChecker() {
  const [params] = useSearchParams();
  const jobId = params.get("jobId") ?? "";

  const token = sessionStorage.getItem("vinyasa_candidate_token");

  const query = jobId
    ? `?jobId=${encodeURIComponent(jobId)}`
    : "";

  if (token) {
    return (
      <Navigate
        to={`/careers/dashboard${query}`}
        replace
      />
    );
  }

  return (
    <Navigate
      to={`/careers/register${query}`}
      replace
    />
  );
}
