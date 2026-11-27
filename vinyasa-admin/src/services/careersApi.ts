
import axios from "axios";
import { getAuthToken } from "./authToken";
import { API_URL } from "../config/constants";



const careersApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ------------------------------------
// Authentication
// ------------------------------------

careersApi.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ------------------------------------
// Job types
// ------------------------------------

export type WorkMode = "On-site" | "Hybrid" | "Remote";

export type EmploymentType =
  | "Full Time"
  | "Part Time"
  | "Contract"
  | "Internship";

export type JobStatus = "open" | "closed" | "draft";

export interface ApiJob {
  id: number;
  title: string;
  department: string | null;
  location: string | null;
  experience: string | null;
  employment_type: EmploymentType;
  work_mode: WorkMode;
  description: string | null;
  responsibilities: string | null;
  required_skills: string | null;
  qualifications: string | null;
  status: JobStatus;
  application_deadline: string | null;
  created_by?: number | null;
  created_at?: string;
  updated_at?: string;
}

// ------------------------------------
// Candidate qualifications
// ------------------------------------

export interface ApiQualification {
  course: string;
  collegeName: string;
  year: string;
}

// ------------------------------------
// Application types
// ------------------------------------

export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "rejected"
  | "hired";

export interface ApiApplication {
  id: number;
  job_id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  experience: string | null;
  qualifications: ApiQualification[];
  technical_skills: string[];
  status: ApplicationStatus;
  applied_at: string;
  updated_at: string;
  job_title?: string;
  department?: string | null;
}

// ------------------------------------
// Generic API response
// ------------------------------------

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ------------------------------------
// Application status update response
// ------------------------------------

export interface UpdateApplicationResponse
  extends ApiResponse<ApiApplication> {
  emailSent?: boolean;
}

// ------------------------------------
// Job payloads
// ------------------------------------

export interface CreateJobPayload {
  title: string;
  department?: string | null;
  location?: string | null;
  experience?: string | null;
  employment_type?: EmploymentType;
  work_mode?: WorkMode;
  description?: string | string[] | null;
  responsibilities?: string | string[] | null;
  required_skills?: string | string[] | null;
  qualifications?: string | string[] | null;
  status?: JobStatus;
  application_deadline?: string | null;
}

export type UpdateJobPayload = Partial<CreateJobPayload>;

// ------------------------------------
// Job Opening APIs
// Backend base path: /api/job-openings
// ------------------------------------

export const getJobs = () =>
  careersApi.get<ApiResponse<ApiJob[]>>("/job-openings");

export const getJob = (id: number) =>
  careersApi.get<ApiResponse<ApiJob>>(`/job-openings/${id}`);

export const getJobsByStatus = (status: JobStatus) =>
  careersApi.get<ApiResponse<ApiJob[]>>(
    `/job-openings/status/${status}`
  );

export const createJob = (job: CreateJobPayload) =>
  careersApi.post<ApiResponse<ApiJob>>("/job-openings", {
    ...job,
    status: job.status ?? "open",
  });

export const updateJob = (
  id: number,
  job: UpdateJobPayload
) =>
  careersApi.put<ApiResponse<ApiJob>>(
    `/job-openings/${id}`,
    job
  );

export const deleteJob = (id: number) =>
  careersApi.delete<ApiResponse<null>>(
    `/job-openings/${id}`
  );

// ------------------------------------
// Job Application APIs
// ------------------------------------

export const getApplications = () =>
  careersApi.get<ApiResponse<ApiApplication[]>>(
    "/job-applications"
  );

export const getApplicationsByJob = (jobId: number) =>
  careersApi.get<ApiResponse<ApiApplication[]>>(
    `/job-applications/job/${jobId}`
  );

export const getApplication = (id: number) =>
  careersApi.get<ApiResponse<ApiApplication>>(
    `/job-applications/${id}`
  );

export const getApplicationsByStatus = (
  status: ApplicationStatus
) =>
  careersApi.get<ApiResponse<ApiApplication[]>>(
    `/job-applications/status/${status}`
  );

// ------------------------------------
// Submit a new application
// ------------------------------------

export interface CreateApplicationPayload {
  job_id: number;
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
  experience: string;
  qualifications: ApiQualification[];
  technical_skills: string[];
}

export const createApplication = (
  application: CreateApplicationPayload
) =>
  careersApi.post<ApiResponse<ApiApplication>>(
    "/job-applications",
    application
  );

// ------------------------------------
// Update application status
// ------------------------------------

export interface UpdateApplicationPayload {
  status: ApplicationStatus;
}

export const updateApplication = (
  id: number,
  data: UpdateApplicationPayload
) =>
  careersApi.put<UpdateApplicationResponse>(
    `/job-applications/${id}`,
    data
  );

// ------------------------------------
// Delete an application
// ------------------------------------

export const deleteApplication = (id: number) =>
  careersApi.delete<ApiResponse<null>>(
    `/job-applications/${id}`
  );

// ------------------------------------
// API error handling
// ------------------------------------

export const getApiError = (error: unknown): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Request failed."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

export default careersApi;
