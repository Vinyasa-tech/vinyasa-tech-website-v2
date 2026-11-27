
import axios from "axios";
import type { Qualification } from "@/types/careers";
import { getCandidateToken } from "@/lib/careersStorage";

import { API_URL } from "../config/constants";
const api = axios.create({
  baseURL: `${API_URL}/job-applications`,
});

export interface SubmitApplicationData {
  job_id: number;
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
  experience: string;
  qualifications: Qualification[];
  technical_skills: string[];
}



api.interceptors.request.use((config) => {
  const token = getCandidateToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function submitApplication(application: SubmitApplicationData) {
  try {
    const response = await api.post("/", application);

    return {
      success: true as const,
      message: response.data.message || "Application submitted successfully.",
      data: response.data.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false as const,
        message:
          error.response?.data?.message ||
          "Unable to submit your application. Please try again.",
      };
    }

    return {
      success: false as const,
      message: "An unexpected error occurred.",
    };
  }
}

export async function getJobApplications() {
  const response = await api.get("/");
  return response.data.data;
}
