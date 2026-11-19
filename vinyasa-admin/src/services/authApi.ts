import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  data?: {
    admin: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
    token: string;
  };
}

export const loginAdmin = async (
  credentials: AdminLoginData,
): Promise<AdminLoginResponse> => {
  const response = await authApi.post<AdminLoginResponse>(
    "/login",
    credentials,
  );

  return response.data;
};

export const getCurrentAdmin = async (token: string) => {
  const response = await authApi.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export default authApi;