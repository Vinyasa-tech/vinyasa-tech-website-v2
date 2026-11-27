
import axios from "axios";
import { getCandidateToken } from "@/lib/careersStorage";

import { API_URL } from "../config/constants";
/* Backend connection */
const careersApi = axios.create({
  baseURL: API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

/* Attach candidate JWT token automatically */
careersApi.interceptors.request.use(
  (config) => {
    const token = getCandidateToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* Job opening type */
export interface ApiJob {
  id: number;
  title: string;
  department?: string | null;
  location: string;
  experience: string;

  employment_type:
    | "Full Time"
    | "Part Time"
    | "Internship"
    | "Contract";

  work_mode?: "On-site" | "Hybrid" | "Remote" | null;

  description: string;
  responsibilities: string | string[];
  required_skills: string | string[];
  qualifications: string | string[];

  status: "open" | "closed" | "draft";

  created_at?: string;
  updated_at?: string;
}

/* Application status */
export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "rejected"
  | "hired";

/* Qualification details */
export interface ApiQualification {
  course: string;
  year: string;
  collegeName: string;
}

/* Job application type */
export interface ApiApplication {
  id: number;
  job_id: number;

  job_title?: string;
  department?: string | null;

  first_name: string;
  last_name?: string;

  email: string;
  phone: string;
  experience: string;

  status: ApplicationStatus;

  applied_at?: string;
  updated_at?: string;

  qualifications: ApiQualification[];
  technical_skills: string[];
}

/* Application submission payload */
export interface SubmitApplicationPayload {
  job_id: number;
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
  experience: string;
  qualifications: ApiQualification[];
  technical_skills: string[];
}

/* Standard backend response */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/* Get all job openings */
export const getJobs = () =>
  careersApi.get<ApiResponse<ApiJob[]>>(
    "/job-openings"
  );

/* Get a single job opening */
export const getJob = (jobId: number) =>
  careersApi.get<ApiResponse<ApiJob>>(
    `/job-openings/${jobId}`
  );

/* Get public open job openings */
export const getOpenJobs = () =>
  careersApi.get<ApiResponse<ApiJob[]>>(
    "/job-openings/status/open"
  );

/* Submit candidate application to MySQL backend */
export const submitApplication = (
  data: SubmitApplicationPayload
) =>
  careersApi.post<ApiResponse<ApiApplication>>(
    "/job-applications",
    data
  );

/* Format API errors */
export const getApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Unable to connect to the server."
    );
  }

  return error instanceof Error
    ? error.message
    : "An unexpected error occurred.";
};

export default careersApi;
