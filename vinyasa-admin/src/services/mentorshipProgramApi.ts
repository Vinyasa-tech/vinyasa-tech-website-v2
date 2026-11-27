import axios from "axios";
import { getAuthToken } from "./authToken";

import { API_URL } from "../config/constants";

const mentorshipProgramApi = axios.create({
  baseURL: `${API_URL}/mentorship-programs`,
});

mentorshipProgramApi.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getMentorshipPrograms = async () => {
  const response = await mentorshipProgramApi.get("/");
  return response.data;
};

export const createMentorshipProgram = async (program: unknown) => {
  const response = await mentorshipProgramApi.post("/", program);
  return response.data;
};

export const updateMentorshipProgram = async (
  id: number | string,
  program: unknown
) => {
  const response = await mentorshipProgramApi.put(`/${id}`, program);
  return response.data;
};

export const deleteMentorshipProgram = async (id: number | string) => {
  const response = await mentorshipProgramApi.delete(`/${id}`);
  return response.data;
};

export default mentorshipProgramApi;