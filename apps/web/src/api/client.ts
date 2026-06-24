import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5500/api";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
