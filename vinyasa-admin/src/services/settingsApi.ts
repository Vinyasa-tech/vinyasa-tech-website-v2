
import axios from "axios";
import { getAuthHeaders } from "./authToken";

import { API_URL } from "../config/constants";

const settingsApi = axios.create({
  baseURL: `${API_URL}/settings`,
});

// Admin settings response
export interface AdminSettings {
  id: number;
  admin_id: number;

  maintenance_mode: boolean;
  show_job_openings: boolean;
  show_mentorship_programs: boolean;
}

// Website preferences sent when saving
export interface WebsitePreferences {
  maintenance_mode: boolean;
  show_job_openings: boolean;
  show_mentorship_programs: boolean;
}

// Admin profile response
export interface AdminProfileData {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Authentication configuration
const authConfig = () => ({
  headers: getAuthHeaders(),
});

// GET ADMIN SETTINGS
export const getAdminSettings = async () => {
  const response = await settingsApi.get("/", authConfig());
  return response.data;
};

// UPDATE WEBSITE PREFERENCES
export const updateAdminSettings = async (
  data: WebsitePreferences
) => {
  const response = await settingsApi.put("/", data, authConfig());
  return response.data;
};

// UPDATE ADMIN PROFILE
export const updateAdminProfile = async (
  data: { name: string; email: string }
) => {
  const response = await settingsApi.put(
    "/profile",
    data,
    authConfig()
  );

  return response.data;
};

// CHANGE ADMIN PASSWORD
export const changeAdminPassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const response = await settingsApi.put(
    "/password",
    data,
    authConfig()
  );

  return response.data;
};

export default settingsApi;
