
import axios from "axios";
import { getAuthToken } from "./authToken";

import { API_URL } from "../config/constants";

const successStoryApi = axios.create({
  baseURL: `${API_URL.replace(/\/$/, "")}/success-stories`,
  timeout: 15000,
});

// Attach admin authentication token
successStoryApi.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// API response interface
export interface ApiSuccessStory {
  id: number;
  name: string;
  role: string | null;
  company: string | null;
  title: string | null;
  story: string;
  image_url: string | null;
  program?: string | null;
  year?: string | number | null;
  status: "published" | "draft";
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

// Request payload interface
export interface SuccessStoryPayload {
  name?: string;
  role?: string;
  company?: string;
  title?: string;
  story?: string;
  image_url?: string;
  program?: string;
  year?: string;
  status?: "published" | "draft";
}

export type SuccessStoryData = SuccessStoryPayload | FormData;

// Convert normal object payload into multipart FormData
const prepareFormData = (data: SuccessStoryData): FormData => {
  if (data instanceof FormData) {
    return data;
  }

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

// GET ALL SUCCESS STORIES
export const getSuccessStories = async () => {
  const response = await successStoryApi.get("/");
  return response.data;
};

// GET SINGLE SUCCESS STORY
export const getSuccessStory = async (id: number) => {
  const response = await successStoryApi.get(`/${id}`);
  return response.data;
};

// CREATE SUCCESS STORY
export const createSuccessStory = async (data: SuccessStoryData) => {
  const formData = prepareFormData(data);

  const response = await successStoryApi.post("/", formData);

  return response.data;
};

// UPDATE SUCCESS STORY
export const updateSuccessStory = async (
  id: number,
  data: SuccessStoryData
) => {
  const formData = prepareFormData(data);

  const response = await successStoryApi.put(`/${id}`, formData);

  return response.data;
};

// DELETE SUCCESS STORY
export const deleteSuccessStory = async (id: number) => {
  const response = await successStoryApi.delete(`/${id}`);
  return response.data;
};

export default successStoryApi;
