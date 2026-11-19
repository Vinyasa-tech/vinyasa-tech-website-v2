
import { getAuthToken } from "./authToken";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export type MentorshipApplicationStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface MentorshipApplication {
  id: number;
  program_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city?: string | null;
  college?: string | null;
  course?: string | null;
  graduation_year?: number | string | null;
  education?: string | null;
  duration?: string | null;
  goals?: string | null;
  additional_message?: string | null;
  status: MentorshipApplicationStatus;
  admin_notes?: string | null;
  applied_at?: string;
  updated_at?: string;
  program_title?: string | null;
  mentor_name?: string | null;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  applications?: T;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_URL}/mentorship-applications${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    }
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ||
        result?.error ||
        `Request failed with status ${response.status}`
    );
  }

  return result as T;
}

function unwrapApplications(
  result: ApiResponse<unknown> | MentorshipApplication[]
): MentorshipApplication[] {
  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result.data)) {
    return result.data as MentorshipApplication[];
  }

  if (Array.isArray(result.applications)) {
    return result.applications as MentorshipApplication[];
  }

  if (
    result.data &&
    typeof result.data === "object" &&
    "applications" in result.data &&
    Array.isArray(result.data.applications)
  ) {
    return result.data.applications as MentorshipApplication[];
  }

  return [];
}

/** Fetch all mentorship applications for the admin panel. */
export async function getMentorshipApplications(): Promise<
  MentorshipApplication[]
> {
  const result = await request<
    ApiResponse<unknown> | MentorshipApplication[]
  >("");

  return unwrapApplications(result);
}

/** Fetch one mentorship application. */
export async function getMentorshipApplicationById(
  id: number | string
): Promise<MentorshipApplication> {
  const result = await request<
    ApiResponse<MentorshipApplication> | MentorshipApplication
  >(`/${id}`);

  if ("data" in result && result.data) {
    return result.data;
  }

  return result as MentorshipApplication;
}

/** Update application status. */
export async function updateMentorshipApplicationStatus(
  id: number | string,
  status: MentorshipApplicationStatus
): Promise<void> {
  await request(`/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

/** Save admin notes for an application. */
export async function updateMentorshipApplicationNotes(
  id: number | string,
  admin_notes: string
): Promise<void> {
  await request(`/${id}`, {
    method: "PUT",
    body: JSON.stringify({ admin_notes }),
  });
}

/** Delete an application. */
export async function deleteMentorshipApplication(
  id: number | string
): Promise<void> {
  await request(`/${id}`, {
    method: "DELETE",
  });
}
