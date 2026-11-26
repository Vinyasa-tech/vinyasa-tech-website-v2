
import axios from "axios";
import { getAuthToken } from "./authToken";

const API_URL = import.meta.env.VITE_API_URL ||
"http://localhost:5000/api/projects";

export interface Project {
  id: number;
  title: string;
  logo: string;
  description: string;
  website: string | null;
  status: "published" | "draft";
  created_at?: string;
  updated_at?: string;
}

export interface ProjectInput {
  title: string;
  logo: File | string;
  description: string;
  website?: string | null;
  status?: "published" | "draft";
}

export type UpdateProjectInput = Partial<ProjectInput>;

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const projectApiClient = axios.create({
  baseURL: API_URL,
});

// Attach authentication token
projectApiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Convert project data into FormData
const createProjectFormData = (
  project: ProjectInput | UpdateProjectInput
): FormData => {
  const formData = new FormData();

  if (project.title !== undefined) {
    formData.append("title", project.title);
  }

  if (project.logo !== undefined) {
    if (project.logo instanceof File) {
      formData.append("logo", project.logo);
    } else {
      formData.append("logo", project.logo);
    }
  }

  if (project.description !== undefined) {
    formData.append("description", project.description);
  }

  if (project.website !== undefined) {
    formData.append("website", project.website ?? "");
  }

  if (project.status !== undefined) {
    formData.append("status", project.status);
  }

  return formData;
};

// Public: Get published projects
export const getPublishedProjects = async (): Promise<Project[]> => {
  const response =
    await projectApiClient.get<ApiResponse<Project[]>>("/");

  return response.data.data;
};

// Admin: Get all projects
export const getAllProjects = async (): Promise<Project[]> => {
  const response =
    await projectApiClient.get<ApiResponse<Project[]>>("/admin");

  return response.data.data;
};

// Get one project
export const getProjectById = async (
  id: number
): Promise<Project> => {
  const response =
    await projectApiClient.get<ApiResponse<Project>>(`/${id}`);

  return response.data.data;
};

// Admin: Create project
export const createProject = async (
  project: ProjectInput
): Promise<Project> => {
  const formData = createProjectFormData(project);

  const response =
    await projectApiClient.post<ApiResponse<Project>>(
      "/",
      formData
    );

  return response.data.data;
};

// Admin: Update project
export const updateProject = async (
  id: number,
  project: UpdateProjectInput
): Promise<Project> => {
  const formData = createProjectFormData(project);

  const response =
    await projectApiClient.put<ApiResponse<Project>>(
      `/${id}`,
      formData
    );

  return response.data.data;
};

// Admin: Delete project
export const deleteProject = async (
  id: number
): Promise<void> => {
  await projectApiClient.delete(`/${id}`);
};

export default projectApiClient;
