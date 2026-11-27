const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

export const API_URL = API_BASE_URL;

export const API_ORIGIN = new URL(API_BASE_URL).origin;